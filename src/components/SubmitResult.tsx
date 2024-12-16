import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadToS3 } from "@/lib/aws";
import { useToast } from "@/components/ui/use-toast";

export const SubmitResult = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !score) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const filename = `${Date.now()}-${file.name}`;
      const url = await uploadToS3(file, filename);
      
      // Here you would typically save the submission to your database
      console.log("Submitted:", { name, score, fileUrl: url });
      
      toast({
        title: "Success!",
        description: "Your result has been uploaded",
      });
      
      setFile(null);
      setName("");
      setScore("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload result",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-secondary rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="score">Score</Label>
        <Input
          id="score"
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="bg-background mono"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="file">Result File</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="bg-background"
          accept=".json,.csv,.txt"
        />
      </div>
      
      <Button type="submit" disabled={isUploading} className="w-full">
        {isUploading ? "Uploading..." : "Submit Result"}
      </Button>
    </form>
  );
};