import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI learning assistant. Ask me anything about your studies, and I'll help simplify complex concepts or solve your doubts!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your question! This is a simulated response. In a real implementation, this would connect to OpenAI's API to provide intelligent answers to your learning questions.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 text-muted-foreground">
      <Bot className="h-4 w-4" />
      <span className="text-sm">AI is typing</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-primary rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-[600px] w-full max-w-4xl mx-auto glass-card p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-white/10">
        <Bot className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">AI Learning Assistant</h3>
        <div className="flex-1"></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-muted-foreground">Online</span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-card'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass-card rounded-lg p-3">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything about your studies..."
          className="flex-1 bg-white/5 border-white/20"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          className="glass-button glow-primary"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;