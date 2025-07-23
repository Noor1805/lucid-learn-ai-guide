import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiKeyManagerProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyManager = ({ onApiKeySet }: ApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
      onApiKeySet(storedKey);
    }
  }, [onApiKeySet]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setIsStored(true);
      onApiKeySet(apiKey.trim());
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsStored(false);
    onApiKeySet('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Gemini API Configuration</h3>
            {isStored && (
              <div className="flex items-center space-x-1 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Connected</span>
              </div>
            )}
          </div>

          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              Your API key is stored locally in your browser and never sent to our servers. 
              Get your API key from{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                Google AI Studio
              </a>
            </AlertDescription>
          </Alert>

          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-white/5 border-white/20 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleSaveKey} className="glass-button" disabled={!apiKey.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            {isStored && (
              <Button variant="outline" onClick={handleClearKey} className="glass-button border-red-500/30 text-red-400">
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ApiKeyManager;