import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, RotateCcw, Save, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { geminiService } from '@/lib/gemini';



const Flashcards = () => {
  const [inputText, setInputText] = useState('');
  const [deckName, setDeckName] = useState('');
  const [currentDeck, setCurrentDeck] = useState(null);
  const [savedDecks, setSavedDecks] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSavedDecks();
    }
  }, [user]);

  const loadSavedDecks = async () => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedDecks((data || []).map(deck => ({
        ...deck,
        cards: deck.cards
      })));
    } catch (error) {
      console.error('Error loading decks:', error);
    }
  };

  const generateFlashcards = async () => {
    if (!inputText.trim() || !deckName.trim()) {
      toast({
        title: "Error",
        description: "Please enter both text content and a deck name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const cards = await geminiService.generateFlashcards(inputText);
      const newDeck = {
        deck_name: deckName,
        cards,
      };
      setCurrentDeck(newDeck);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveDeck = async () => {
    if (!currentDeck || !user) return;

    try {
      const { error } = await supabase.from('flashcards').insert({
        user_id: user.id,
        deck_name: currentDeck.deck_name,
        cards: currentDeck.cards,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Flashcard deck saved successfully!",
      });

      await loadSavedDecks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save deck. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadDeck = (deck) => {
    setCurrentDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyMode(true);
  };

  const nextCard = () => {
    if (currentDeck && currentCardIndex < currentDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const resetDeck = () => {
    setCurrentDeck(null);
    setInputText('');
    setDeckName('');
    setStudyMode(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (studyMode && currentDeck) {
    const currentCard = currentDeck.cards[currentCardIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {currentDeck.deck_name}
              </h1>
              <p className="text-muted-foreground">
                Card {currentCardIndex + 1} of {currentDeck.cards.length}
              </p>
            </div>
            <Button variant="outline" onClick={() => setStudyMode(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Decks
            </Button>
          </div>

          <div className="flex justify-center mb-8">
            <motion.div
              className="w-full max-w-md h-64 perspective-1000"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-600 cursor-pointer ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front of card */}
                <Card className="absolute inset-0 backface-hidden border-border/50 backdrop-blur-sm bg-card/90">
                  <CardContent className="h-full flex items-center justify-center p-6">
                    <div className="text-center">
                      <BookOpen className="h-8 w-8 text-orange-500 mx-auto mb-4" />
                      <p className="text-lg font-medium">{currentCard.front}</p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Click to reveal answer
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Back of card */}
                <Card className="absolute inset-0 rotate-y-180 backface-hidden border-border/50 backdrop-blur-sm bg-card/90">
                  <CardContent className="h-full flex items-center justify-center p-6">
                    <div className="text-center">
                      <Target className="h-8 w-8 text-red-500 mx-auto mb-4" />
                      <p className="text-lg">{currentCard.back}</p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Click to see question
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={currentCardIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Flip Card
              </Button>
            </div>

            <Button
              onClick={nextCard}
              disabled={currentCardIndex === currentDeck.cards.length - 1}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            AI Flashcards
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform your study material into interactive flashcards for better retention
          </p>
        </div>

        {/* Generator Section */}
        {!currentDeck && (
          <Card className="border-border/50 backdrop-blur-sm bg-card/90 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Create New Flashcard Deck
              </CardTitle>
              <CardDescription>
                Paste your study material and AI will create Q&A flashcards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter deck name (e.g., 'Biology Chapter 5', 'Spanish Vocabulary')"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="bg-background/50"
              />
              <Textarea
                placeholder="Paste your study material here... AI will extract key concepts and create flashcards."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] bg-background/50"
              />
              <Button 
                onClick={generateFlashcards}
                disabled={loading || !inputText.trim() || !deckName.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {loading ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Flashcards...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Flashcards
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Preview Generated Cards */}
        {currentDeck && !studyMode && (
          <Card className="border-border/50 backdrop-blur-sm bg-card/90 mb-8">
            <CardHeader>
              <CardTitle>Preview: {currentDeck.deck_name}</CardTitle>
              <CardDescription>
                {currentDeck.cards.length} flashcards generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {currentDeck.cards.map((card, index) => (
                  <div key={index} className="p-3 border border-border/50 rounded-lg bg-background/50">
                    <p className="font-medium text-sm mb-2">Q: {card.front}</p>
                    <p className="text-sm text-muted-foreground">A: {card.back}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <Button onClick={saveDeck} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save Deck
                </Button>
                <Button 
                  onClick={() => setStudyMode(true)} 
                  variant="outline" 
                  className="flex-1"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Study Mode
                </Button>
                <Button onClick={resetDeck} variant="outline">
                  Create New
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Decks */}
        {savedDecks.length > 0 && (
          <Card className="border-border/50 backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Your Saved Decks</CardTitle>
              <CardDescription>
                Click on any deck to start studying
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedDecks.map((deck) => (
                  <motion.div
                    key={deck.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="cursor-pointer border-border/50 hover:border-primary/50 transition-colors"
                      onClick={() => loadDeck(deck)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{deck.deck_name}</h3>
                        <Badge variant="secondary">
                          {deck.cards.length} cards
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default Flashcards;