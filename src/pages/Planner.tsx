import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Clock, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ApiKeyManager from '@/components/ApiKeyManager';
import { openAIService } from '@/lib/openai';
import { useToast } from '@/hooks/use-toast';

interface StudyTopic {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
}

interface StudyPlan {
  week: number;
  topic: string;
  hours: number;
  tasks: string[];
}

const Planner = () => {
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [studyPlan, setStudyPlan] = useState<StudyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    if (key) {
      openAIService.initialize(key);
    }
  };

  const addTopic = () => {
    if (!newTopic.trim()) return;
    
    const topic: StudyTopic = {
      id: Date.now().toString(),
      name: newTopic,
      priority: 'medium',
    };
    
    setTopics([...topics, topic]);
    setNewTopic('');
  };

  const removeTopic = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  const generatePlan = async () => {
    if (topics.length === 0 || !targetDate) return;
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to use this feature.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const topicNames = topics.map(t => t.name);
      const response = await openAIService.generateStudyPlan(topicNames, targetDate);
      setStudyPlan(response);
      toast({
        title: "Study Plan Generated!",
        description: "Your personalized study plan is ready."
      });
    } catch (error) {
      console.error('Plan generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate study plan. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to dummy data for demo
      const dummyPlan: StudyPlan[] = topics.map((topic, index) => ({
        week: index + 1,
        topic: topic.name,
        hours: Math.floor(Math.random() * 10) + 5,
        tasks: [
          `Review fundamentals of ${topic.name}`,
          `Practice exercises and problems`,
          `Complete assignments and projects`,
          `Take practice tests and quizzes`,
        ],
      }));
      
      setStudyPlan(dummyPlan);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <Target className="w-full h-full text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Study Planner</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create personalized study schedules that adapt to your goals and timeline. 
            Our AI generates optimal learning paths based on your subjects and deadlines.
          </p>
        </motion.div>

        <ApiKeyManager onApiKeySet={handleApiKeySet} />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Topics Input */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Add Study Topics</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter a subject or topic..."
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                    className="bg-white/5 border-white/20"
                  />
                  <Button onClick={addTopic} className="glass-button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Topics List */}
                <div className="space-y-2">
                  {topics.map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 glass-card rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge className={getPriorityColor(topic.priority)}>
                          {topic.priority}
                        </Badge>
                        <span>{topic.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTopic(topic.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Target Date */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Target Date</span>
              </h2>
              
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="bg-white/5 border-white/20"
              />
            </Card>

            {/* Generate Button */}
            <Button
              onClick={generatePlan}
              disabled={topics.length === 0 || !targetDate || isLoading}
              className="w-full glass-button glow-primary"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Target className="h-4 w-4" />
                  </motion.div>
                  Generating Plan...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {studyPlan.length > 0 ? (
              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Your Personalized Study Plan</span>
                </h2>

                <div className="space-y-6">
                  {studyPlan.map((week, index) => (
                    <motion.div
                      key={week.week}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative"
                    >
                      {/* Timeline Line */}
                      {index < studyPlan.length - 1 && (
                        <div className="absolute left-4 top-12 w-0.5 h-full bg-gradient-to-b from-primary to-transparent"></div>
                      )}
                      
                      <div className="flex space-x-4">
                        {/* Week Indicator */}
                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                          {week.week}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">{week.topic}</h3>
                            <Badge className="bg-primary/20 text-primary">
                              {week.hours}h/week
                            </Badge>
                          </div>
                          
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {week.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="flex items-start space-x-2">
                                <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="glass-card p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Your study plan will appear here</h3>
                  <p className="text-muted-foreground">
                    Add your topics and target date, then click "Generate Study Plan" to see your personalized schedule.
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Planner;