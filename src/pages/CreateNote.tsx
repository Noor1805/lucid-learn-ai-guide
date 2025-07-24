import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !paragraph) {
      toast({
        title: "Error",
        description: "Please fill out both fields.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("notes").insert([
      {
        user_id: user?.id,
        title,
        original_text: paragraph,
        simplified_text: paragraph,
        key_points: [],
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create note.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Note created successfully.",
      });
      navigate("/notes");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-2xl p-6 bg-card text-white">
        <CardHeader>
          <CardTitle className="text-white">Create a New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-white mb-1">Heading</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
                className="text-white placeholder:text-gray-400 bg-background"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-1">Paragraph</label>
              <Textarea
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                rows={6}
                placeholder="Write your note here..."
                className="text-white placeholder:text-gray-400 bg-background"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Save Note
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNote;


