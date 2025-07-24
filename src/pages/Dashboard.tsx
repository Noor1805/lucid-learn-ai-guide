import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  Users,
} from 'lucide-react';

interface UserStats {
  quizzes_completed: number;
  flashcards_created: number;
  notes_saved: number;
  study_plans_created: number;
  daily_streak: number;
  total_study_hours: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({
    quizzes_completed: 0,
    flashcards_created: 0,
    notes_saved: 0,
    study_plans_created: 0,
    daily_streak: 0,
    total_study_hours: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching stats:', error);
        } else if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  const quickActions = [
    {
      title: 'Simplify Text',
      description: 'Convert complex text into easy-to-understand content',
      icon: BookOpen,
      path: '/simplify',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Generate Quiz',
      description: 'Create interactive quizzes from your notes',
      icon: Brain,
      path: '/quiz',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Study Planner',
      description: 'AI-powered personalized study schedules',
      icon: Calendar,
      path: '/planner',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Flashcards',
      description: 'Smart flashcards for better retention',
      icon: Target,
      path: '/flashcards',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const statCards = [
    {
      title: 'Quizzes Completed',
      value: stats.quizzes_completed,
      icon: Brain,
      color: 'text-purple-500',
    },
    {
      title: 'Flashcards Created',
      value: stats.flashcards_created,
      icon: Target,
      color: 'text-orange-500',
    },
    {
      title: 'Notes Saved',
      value: stats.notes_saved,
      icon: BookOpen,
      color: 'text-blue-500',
    },
    {
      title: 'Study Plans',
      value: stats.study_plans_created,
      icon: Calendar,
      color: 'text-green-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your learning journey with AI-powered tools
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-border/50 backdrop-blur-sm bg-card/90 hover:bg-card/95 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Streak and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-border/50 backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Daily Streak
                </CardTitle>
                <CardDescription>Keep learning every day!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold">{stats.daily_streak}</span>
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                    {stats.daily_streak > 0 ? 'Active' : 'Start Today'}
                  </Badge>
                </div>
                <Progress value={Math.min((stats.daily_streak / 30) * 100, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {30 - stats.daily_streak > 0 ? `${30 - stats.daily_streak} days to reach 30-day streak` : 'Amazing streak!'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-border/50 backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Study Time
                </CardTitle>
                <CardDescription>Total hours spent learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold">{stats.total_study_hours}h</span>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                    This Month
                  </Badge>
                </div>
                <Progress value={Math.min((stats.total_study_hours / 40) * 100, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Goal: 40 hours per month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-border/50 backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump into your favorite learning tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center text-center border-border/50 hover:border-primary/50 transition-all group"
                      onClick={() => navigate(action.path)}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;