import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import ResultCard from '@/components/ResultCard';

import { geminiService } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

const Simplify = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSimplify = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await geminiService.simplifyText(inputText);
      setResult(response);
      toast({
        title: "Text Simplified!",
        description: "Your content has been successfully simplified."
      });
    } catch (error) {
      console.error('Simplification error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to simplify text. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to dummy data for demo
      setResult({
        summary: "This is a simplified version of your text. The AI integration encountered an error, but here's a demo response to show how the feature works.",
        keyPoints: [
          "Main concept extracted from the original text",
          "Key supporting details and evidence", 
          "Important terminology and definitions",
          "Practical applications or examples",
          "Summary of conclusions or takeaways"
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
  };

  const examples = [
    "Quantum computing harnesses quantum mechanical phenomena...",
    "Machine learning algorithms utilize statistical techniques...",
    "The photosynthesis process involves complex biochemical reactions..."
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-4">
              <FileText className="w-full h-full text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Text Simplifier</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform complex academic content into clear, digestible summaries. 
            Our AI breaks down difficult concepts while preserving essential information.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Input Your Text</span>
                </h2>
                
                <Textarea
                  placeholder="Paste your complex text here... (research papers, technical articles, academic content)"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[300px] bg-white/5 border-white/20 resize-none"
                />
                
                <div className="text-sm text-muted-foreground">
                  {inputText.length} characters
                </div>

                {/* Example Buttons */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputText(example)}
                        className="glass-button text-xs"
                      >
                        Example {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSimplify}
                    disabled={!inputText.trim() || isLoading}
                    className="flex-1 glass-button glow-primary"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Simplifying...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Simplify Text
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="glass-button border-white/20"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {result ? (
              <ResultCard
                title="Simplified Summary"
                content={result.summary}
                keyPoints={result.keyPoints}
                type="summary"
              />
            ) : (
              <Card className="glass-card p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Your simplified content will appear here</h3>
                  <p className="text-muted-foreground">
                    Enter some text and click "Simplify Text" to see the AI-powered summary and key points.
                  </p>
                </div>
              </Card>
            )}

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-3 text-primary">💡 Tips for Better Results</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Include complete sentences and paragraphs</li>
                  <li>• Provide context when dealing with technical terms</li>
                  <li>• Longer texts (200+ words) yield better summaries</li>
                  <li>• Academic papers and research articles work best</li>
                </ul>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Simplify;