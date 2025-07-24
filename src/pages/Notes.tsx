import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Search, Calendar, Trash2, Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface SavedNote {
  id: string;
  title: string;
  original_text: string;
  simplified_text: string;
  key_points: string[];
  created_at: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<SavedNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<SavedNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPara, setNewPara] = useState('');

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm]);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newTitle.trim() || !newPara.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and paragraph are required.",
        variant: "destructive",
      });
      return;
    }

    const newNote = {
      title: newTitle,
      original_text: newPara,
      simplified_text: newPara,
      key_points: [],
      user_id: user?.id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('notes')
      .insert([newNote])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create note.",
        variant: "destructive",
      });
      return;
    }

    setNotes([data, ...notes]);
    setNewTitle('');
    setNewPara('');
    setShowCreateModal(false);

    toast({
      title: "Note Created",
      description: "Your note was successfully added.",
    });
  };

  const filterNotes = () => {
    if (!searchTerm.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.simplified_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.key_points.some(point =>
        point.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredNotes(filtered);
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user!.id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }

      toast({
        title: "Success",
        description: "Note deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedNote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={() => setSelectedNote(null)}>
              ← Back to Notes
            </Button>
            <Button variant="destructive" onClick={() => deleteNote(selectedNote.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Note
            </Button>
          </div>

          <Card className="border-border/50 backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedNote.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(selectedNote.created_at), 'PPP')}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Simplified Content
                </h3>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedNote.simplified_text}
                  </p>
                </div>
              </div>

              {selectedNote.key_points.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Points</h3>
                  <div className="space-y-2">
                    {selectedNote.key_points.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-1">
                          {index + 1}
                        </Badge>
                        <p className="flex-1">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  View Original Text
                </summary>
                <div className="mt-3 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedNote.original_text}
                  </p>
                </div>
              </details>
            </CardContent>
          </Card>
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
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            Your Saved Notes
          </h1>
          <p className="text-muted-foreground text-lg">
            All your simplified notes in one place
          </p>
        </div>

        {/* Create Note Button */}
        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowCreateModal(true)} className="bg-primary text-white">
            ➕ Create Note
          </Button>
        </div>

        {/* Create Note Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white text-black p-6 rounded-lg w-[90%] max-w-xl space-y-4 shadow-lg">
              <h2 className="text-xl font-semibold">Create a New Note</h2>
              <input
                type="text"
                placeholder="Enter title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Write your note here..."
                value={newPara}
                onChange={(e) => setNewPara(e.target.value)}
                rows={6}
                className="w-full p-2 border rounded"
              />
              <div className="flex text-white justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNote}>Save</Button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="cursor-pointer border-border/50 backdrop-blur-sm bg-card/90 hover:border-primary/50 transition-all h-full"
                onClick={() => setSelectedNote(note)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">
                    {note.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(note.created_at), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {note.simplified_text}
                  </p>

                  <div className="flex items-center justify-between">
  <Badge variant="secondary">
    {note.key_points.length} key points
  </Badge>
  <div className="flex gap-2">
    <Button
      size="icon"
      variant="outline"
      className="hover:bg-primary hover:text-white transition-colors duration-200"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedNote(note);
      }}
    >
      <Eye className="h-4 w-4" />
    </Button>
    <Button
      size="icon"
      variant="outline"
      className="hover:bg-destructive hover:text-white transition-colors duration-200"
      onClick={(e) => {
        e.stopPropagation();
        deleteNote(note.id);
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
</div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredNotes.length === 0 && searchTerm && (
          <Card className="border-border/50 backdrop-blur-sm bg-card/90">
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
              <p className="text-muted-foreground">
                No notes match your search term "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Notes;

