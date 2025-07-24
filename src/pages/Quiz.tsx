import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { geminiService } from '@/lib/gemini';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface Quiz {
  title: string;
  questions: Question[];
}

const Quiz = () => {
  const [inputText, setInputText] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateQuiz = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please paste some text to generate a quiz from.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const generatedQuiz = await geminiService.generateQuiz(inputText);
      setQuiz(generatedQuiz);
      setCurrentQuestion(0);
      setSelectedAnswers([]);
      setShowResults(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setShowResults(true);
    
    if (user && quiz) {
      const score = selectedAnswers.reduce((total, answer, index) => {
        return total + (answer === quiz.questions[index].correct ? 1 : 0);
      }, 0);

      try {
        // Save quiz to database
        await supabase.from('quizzes').insert({
          user_id: user.id,
          title: quiz.title,
          questions: quiz.questions as any,
          score,
          total_questions: quiz.questions.length,
          completed_at: new Date().toISOString(),
        });

        // Update user stats - for now we'll handle this manually
        const { data: currentStats } = await supabase
          .from('user_stats')
          .select('quizzes_completed')
          .eq('user_id', user.id)
          .single();
        
        if (currentStats) {
          await supabase
            .from('user_stats')
            .update({ 
              quizzes_completed: (currentStats.quizzes_completed || 0) + 1,
              last_activity_date: new Date().toISOString().split('T')[0]
            })
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Error saving quiz:', error);
      }
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setInputText('');
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const score = quiz ? selectedAnswers.reduce((total, answer, index) => {
    return total + (answer === quiz.questions[index].correct ? 1 : 0);
  }, 0) : 0;

  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              AI Quiz Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Paste your study material and let AI create interactive quizzes for you
            </p>
          </div>

          <Card className="border-border/50 backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Generate Quiz from Text
              </CardTitle>
              <CardDescription>
                Paste any text content (notes, articles, textbook chapters) and AI will create multiple-choice questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your study material here... (e.g., textbook chapter, lecture notes, article content)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] bg-background/50"
              />
              <Button 
                onClick={generateQuiz}
                disabled={loading || !inputText.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-border/50 backdrop-blur-sm bg-card/90">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
              <CardDescription>
                You scored {score} out of {quiz.questions.length} questions correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                  {Math.round((score / quiz.questions.length) * 100)}%
                </div>
                <Badge 
                  variant={score >= quiz.questions.length * 0.8 ? "default" : score >= quiz.questions.length * 0.6 ? "secondary" : "destructive"}
                  className="text-lg py-1 px-4"
                >
                  {score >= quiz.questions.length * 0.8 ? "Excellent!" : 
                   score >= quiz.questions.length * 0.6 ? "Good Job!" : "Keep Studying!"}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Review Your Answers</h3>
                {quiz.questions.map((question, index) => (
                  <div key={index} className="p-4 border border-border/50 rounded-lg bg-background/50">
                    <div className="flex items-start gap-3 mb-3">
                      {selectedAnswers[index] === question.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">{question.question}</p>
                        <div className="space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className={`p-2 rounded text-sm ${
                                optionIndex === question.correct 
                                  ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                                  : optionIndex === selectedAnswers[index] && selectedAnswers[index] !== question.correct
                                  ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                                  : 'bg-muted/50'
                              }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={resetQuiz} variant="outline" className="flex-1">
                  Create New Quiz
                </Button>
                <Button onClick={() => window.location.reload()} className="flex-1">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <Badge variant="outline">
              {currentQuestion + 1} of {quiz.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-border/50 backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                    className="w-full justify-start text-left p-4 h-auto whitespace-normal"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Quiz;