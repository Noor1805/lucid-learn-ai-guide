import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calculator, RefreshCw, Lightbulb, ArrowRight, BookOpen, Target } from 'lucide-react';
import { geminiService } from '@/lib/gemini';


const Sandbox = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sampleProblems = [
    "Solve for x: 2x + 5 = 13",
    "Find the derivative of f(x) = 3x² + 2x - 1",
    "A ball is thrown upward with an initial velocity of 20 m/s. When will it reach maximum height?",
    "Calculate the area of a circle with radius 5 cm",
    "Solve the system: x + y = 10, 2x - y = 5",
  ];

  const solveProblem = async () => {
    if (!problem.trim()) {
      toast({
        title: "Error",
        description: "Please enter a problem to solve.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await geminiService.solveProblemStepByStep(problem);
      setSolution(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to solve the problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSampleProblem = (sampleProblem) => {
    setProblem(sampleProblem);
    setSolution(null);
  };

  const clearSandbox = () => {
    setProblem('');
    setSolution(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
            AI Problem Solver
          </h1>
          <p className="text-muted-foreground text-lg">
            Get step-by-step solutions to math, physics, and chemistry problems
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="border-border/50 backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-500" />
                  Enter Your Problem
                </CardTitle>
                <CardDescription>
                  Type any math, physics, or chemistry problem for step-by-step solution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your problem here... (e.g., 'Solve for x: 2x + 5 = 13' or 'Find the derivative of f(x) = x²')"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="min-h-[120px] bg-background/50"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={solveProblem}
                    disabled={loading || !problem.trim()}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Solving...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Solve Step-by-Step
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={clearSandbox}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sample Problems */}
            <Card className="border-border/50 backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Try These Examples
                </CardTitle>
                <CardDescription>
                  Click any problem to load it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleProblems.map((sampleProblem, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-3 whitespace-normal"
                        onClick={() => loadSampleProblem(sampleProblem)}
                      >
                        <ArrowRight className="mr-2 h-4 w-4 flex-shrink-0" />
                        {sampleProblem}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Solution Section */}
          <div>
            {solution ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Answer Card */}
                <Card className="border-border/50 backdrop-blur-sm bg-card/90">
                  <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">
                      Final Answer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {solution.answer}
                    </div>
                  </CardContent>
                </Card>

                {/* Step-by-Step Solution */}
                <Card className="border-border/50 backdrop-blur-sm bg-card/90">
                  <CardHeader>
                    <CardTitle>Step-by-Step Solution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {solution.steps.map((step, index) => (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border border-border/50 rounded-lg bg-background/30"
                      >
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">
                            Step {step.step}
                          </Badge>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{step.description}</h4>
                            {step.formula && (
                              <div className="bg-muted/50 p-2 rounded mb-2 font-mono text-sm">
                                {step.formula}
                              </div>
                            )}
                            <p className="text-muted-foreground text-sm">
                              {step.explanation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Related Concepts */}
                {solution.concepts.length > 0 && (
                  <Card className="border-border/50 backdrop-blur-sm bg-card/90">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        Related Concepts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {solution.concepts.map((concept, index) => (
                          <Badge key={index} variant="secondary">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tips */}
                {solution.tips.length > 0 && (
                  <Card className="border-border/50 backdrop-blur-sm bg-card/90">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Tips & Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {solution.tips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ) : (
              <Card className="border-border/50 backdrop-blur-sm bg-card/90 h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Solve</h3>
                  <p className="text-muted-foreground">
                    Enter a problem and get detailed step-by-step solutions
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sandbox;