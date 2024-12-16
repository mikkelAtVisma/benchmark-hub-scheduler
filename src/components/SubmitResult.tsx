import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadToS3 } from "@/lib/aws";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreComponent {
  componentName: string;
  score: number;
}

interface StatGroup {
  scoreHard: number;
  scoreSoft: number;
  hardScoreComposition: ScoreComponent[];
  softScoreComposition: ScoreComponent[];
}

interface BenchmarkResult {
  name: string;
  timestamp: number;
  statGroups: StatGroup[];
}

export const SubmitResult = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const validateJsonStructure = (data: any): data is BenchmarkResult => {
    return (
      data &&
      typeof data.name === "string" &&
      typeof data.timestamp === "number" &&
      Array.isArray(data.statGroups) &&
      data.statGroups.length > 0 &&
      typeof data.statGroups[0].scoreHard === "number" &&
      typeof data.statGroups[0].scoreSoft === "number"
    );
  };

  const handleFileRead = (file: File): Promise<BenchmarkResult> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (!validateJsonStructure(json)) {
            throw new Error("Invalid JSON structure");
          }
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const resultData = await handleFileRead(file);
      const filename = `${Date.now()}-${file.name}`;
      const url = await uploadToS3(file, filename);
      
      // Here you would typically save the submission to your database
      // along with the parsed scores
      console.log("Submitted:", {
        name,
        fileUrl: url,
        hardScore: resultData.statGroups[0].scoreHard,
        softScore: resultData.statGroups[0].scoreSoft,
        timestamp: resultData.timestamp,
      });
      
      toast({
        title: "Success!",
        description: "Your result has been uploaded",
      });
      
      setFile(null);
      setName("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload result",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Result</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Result File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="bg-background"
              accept=".json"
            />
            <p className="text-sm text-muted-foreground">
              Upload your JSON result file
            </p>
          </div>
          
          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? "Uploading..." : "Submit Result"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};