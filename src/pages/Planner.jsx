import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Target, Clock, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { geminiService } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

const Planner = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [studyPlan, setStudyPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generatePlan = async () => {
    if (topics.length === 0) {
      toast({
        title: "No Topics",
        description: "Please add some study topics first.",
        variant: "destructive",
      });
      return;
    }

    if (!targetDate) {
      toast({
        title: "Target Date Required",
        description: "Please select a target completion date.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const topicNames = topics.map(topic => topic.name);
      const response = await geminiService.generateStudyPlan(topicNames, targetDate);
      setStudyPlan(response);
      toast({
        title: "Study Plan Generated!",
        description: `Created a ${response.length}-week study plan for your topics.`
      });
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again with different topics or date.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTopic = () => {
    if (newTopic.trim() && !topics.find(topic => topic.name === newTopic.trim())) {
      setTopics([...topics, { 
        id: Date.now(), 
        name: newTopic.trim(), 
        priority: 'medium' 
      }]);
      setNewTopic('');
    }
  };

  const removeTopic = (id) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  const setPriority = (id, priority) => {
    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, priority } : topic
    ));
  };

  const totalWeeks = studyPlan.length;
  const totalHours = studyPlan.reduce((sum, week) => sum + week.hours, 0);

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
            Our AI optimizes your learning path for maximum efficiency.
          </p>
        </motion.div>

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
                  <Button onClick={addTopic} className="glass-button" disabled={!newTopic.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Topics List */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {topics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="flex-1">{topic.name}</span>
                      <div className="flex items-center space-x-2">
                        <select 
                          value={topic.priority}
                          onChange={(e) => setPriority(topic.id, e.target.value)}
                          className="text-xs bg-white/10 border border-white/20 rounded px-2 py-1"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeTopic(topic.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Target Date */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Target Completion Date</span>
              </h2>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="bg-white/5 border-white/20"
              />
            </Card>

            {/* Generate Button */}
            <Button 
              onClick={generatePlan}
              disabled={isLoading || topics.length === 0 || !targetDate}
              className="w-full glass-button text-lg py-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Plan...
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 mr-2" />
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
              <div className="space-y-6">
                {/* Plan Overview */}
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Plan Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{totalWeeks}</div>
                      <div className="text-sm text-muted-foreground">Weeks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{totalHours}</div>
                      <div className="text-sm text-muted-foreground">Total Hours</div>
                    </div>
                  </div>
                </Card>

                {/* Weekly Breakdown */}
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Weekly Schedule</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {studyPlan.map((week, index) => (
                      <motion.div
                        key={week.week}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-white/10 rounded-lg p-4 bg-white/5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Week {week.week}: {week.topic}</h4>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {week.hours}h
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {week.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex items-start space-x-2 text-sm">
                              <Star className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{task}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="glass-card p-8 text-center">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Study Plan Yet</h3>
                <p className="text-muted-foreground">
                  Add your study topics and target date to generate a personalized study plan.
                </p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Planner;