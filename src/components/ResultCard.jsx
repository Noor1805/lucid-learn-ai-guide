import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const ResultCard = ({ title, content, keyPoints, type = 'summary' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = keyPoints 
      ? `${content}\n\nKey Points:\n${keyPoints.map(point => `• ${point}`).join('\n')}`
      : content;
    
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="glass-card p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary animate-glow-pulse" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="glass-button"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground leading-relaxed">{content}</p>
          </div>

          {/* Key Points */}
          {keyPoints && keyPoints.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h4 className="font-semibold text-primary flex items-center space-x-2">
                <span>Key Points</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              </h4>
              <ul className="space-y-2">
                {keyPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.4 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Footer Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
