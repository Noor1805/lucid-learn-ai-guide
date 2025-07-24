import { motion } from 'framer-motion';
import { ArrowRight, Brain, Sparkles, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-bg.jpg';
import aiBrain from '@/assets/ai-brain.png';

const Home = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Text Simplifier',
      description: 'Transform complex content into easy-to-understand summaries with AI-powered analysis.',
      href: '/simplify',
      color: 'from-blue-500 to-purple-500',
    },
    {
      icon: Target,
      title: 'Study Planner',
      description: 'Create personalized study schedules that adapt to your learning goals and timeline.',
      href: '/planner', 
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Brain,
      title: 'AI Chat Assistant',
      description: 'Get instant answers to your questions with our intelligent learning companion.',
      href: '/chat',
      color: 'from-pink-500 to-red-500',
    },
  ];

  const stats = [
    { label: 'Students Helped', value: '10,000+' },
    { label: 'Concepts Simplified', value: '50,000+' },
    { label: 'Study Plans Created', value: '25,000+' },
    { label: 'Questions Answered', value: '100,000+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              animate={{
                x: [0, Math.random() * 100, 0],
                y: [0, Math.random() * 100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* AI Brain Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <img 
                src={aiBrain} 
                alt="AI Brain" 
                className="w-24 h-24 animate-float glow-primary"
              />
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text">Learn Smarter</span>
              <br />
              <span className="text-foreground">with AI Power</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Transform your learning journey with intelligent tools that simplify complex concepts, 
              create personalized study plans, and provide instant help when you need it most.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="glass-button glow-primary text-lg px-8 py-6">
                <Link to="/simplify" className="flex items-center space-x-2">
                  <span>Start Learning</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-button text-lg px-8 py-6 border-white/20"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Complete <span className="gradient-text">AI Learning</span> Suite
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to enhance your learning experience with AI-powered tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              ...features,
              {
                icon: Brain,
                title: 'AI Quiz Generator',
                description: 'Create interactive quizzes from any text content to test your knowledge.',
                href: '/quiz',
                color: 'from-green-500 to-teal-500',
              },
              {
                icon: Sparkles,
                title: 'Smart Flashcards',
                description: 'Generate flashcards automatically and review them with spaced repetition.',
                href: '/flashcards',
                color: 'from-orange-500 to-yellow-500',
              },
              {
                icon: Target,
                title: 'Note Manager',
                description: 'Organize and manage your study notes with AI-powered insights.',
                href: '/notes',
                color: 'from-indigo-500 to-blue-500',
              },
              {
                icon: Brain,
                title: 'Problem Solver',
                description: 'Get step-by-step solutions to complex problems across all subjects.',
                href: '/sandbox',
                color: 'from-red-500 to-pink-500',
              },
              {
                icon: Users,
                title: 'Career Explorer',
                description: 'Discover career paths and opportunities related to your studies.',
                href: '/career',
                color: 'from-purple-500 to-indigo-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link to={feature.href}>
                  <Card className="glass-card p-6 h-full hover:glow-primary transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary group-hover:translate-x-2 transition-transform">
                      <span className="text-xs font-medium">Try it now</span>
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to <span className="gradient-text">Transform</span> Your Learning?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students who are already learning smarter with AI-powered tools.
            </p>
            <Button size="lg" className="glass-button glow-primary text-lg px-12 py-6">
              <Link to="/simplify" className="flex items-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;