import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Brain, Sparkles, Zap } from 'lucide-react';
import ChatBox from '@/components/ChatBox';
import ApiKeyManager from '@/components/ApiKeyManager';
import { Card } from '@/components/ui/card';
import { geminiService } from '@/lib/gemini';

const Chat = () => {
  const [apiKey, setApiKey] = useState('');

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    if (key) {
      geminiService.initialize(key);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'Smart Responses',
      description: 'Get intelligent answers to complex academic questions',
    },
    {
      icon: Zap,
      title: 'Instant Help',
      description: 'Receive immediate assistance with your studies',
    },
    {
      icon: Sparkles,
      title: 'Learning Focused',
      description: 'Specialized in educational content and concepts',
    },
  ];

  const quickQuestions = [
    "Explain quantum physics in simple terms",
    "How does photosynthesis work?",
    "What are the key concepts in machine learning?",
    "Help me understand calculus derivatives",
    "Explain the causes of World War I",
    "How do chemical bonds form?",
  ];

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 p-4">
              <MessageCircle className="w-full h-full text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">AI Chat Assistant</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your intelligent learning companion is here to help. Ask questions, get explanations, 
            and receive instant support for all your academic needs.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {features.map((feature, index) => (
            <Card key={feature.title} className="glass-card p-6 text-center">
              <feature.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </motion.div>

        <ApiKeyManager onApiKeySet={handleApiKeySet} />

        {/* Main Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <ChatBox apiKey={apiKey} />
        </motion.div>

        {/* Quick Questions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Quick Question Ideas</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all text-sm"
                >
                  "{question}"
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-3 text-primary">💡 Chat Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• Be specific about your subject area</li>
                <li>• Ask for examples when needed</li>
                <li>• Request step-by-step explanations</li>
              </ul>
              <ul className="space-y-2">
                <li>• Mention your academic level for better answers</li>
                <li>• Ask for clarification if something is unclear</li>
                <li>• Use follow-up questions to dive deeper</li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;