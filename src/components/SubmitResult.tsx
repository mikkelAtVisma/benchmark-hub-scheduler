import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { uploadEntry, getLeaderboardEntries } from "../lib/aws";

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
  branch: string;
  runLabel: string;
  runType: string;
  timestamp: number;
  timeLimit: number;
  iteration: number;
  jobInfo: {
    id: string;
    organisationId: string;
    scheduleType: string;
    demandType: string;
    planningHorizon: {
      startDate: string;
      endDate: string;
      fteStartDay: {
        date: string;
      };
      fteEndDay: {
        date: string;
      };
    };
  };
  statGroups: StatGroup[];
  uploaderName?: string;
}

export const SubmitResult = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploaderName, setUploaderName] = useState("");
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const validateJsonStructure = (data: any): data is BenchmarkResult => {
    return (
      data &&
      typeof data.name === "string" &&
      typeof data.branch === "string" &&
      typeof data.runLabel === "string" &&
      typeof data.runType === "string" &&
      typeof data.timestamp === "number" &&
      typeof data.timeLimit === "number" &&
      typeof data.iteration === "number" &&
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

  const appendToLeaderboard = async (newEntry: BenchmarkResult, uploaderName: string) => {
    // Get existing entries to check for duplicates
    const existingEntries = await queryClient.fetchQuery({
      queryKey: ['leaderboard'],
      queryFn: async () => {
        const entries = await getLeaderboardEntries();
        return entries;
      },
    });

    // Check for duplicate runLabel
    const isDuplicate = existingEntries.some(entry => entry.runLabel === newEntry.runLabel);
    if (isDuplicate) {
      throw new Error("A result with this run label already exists");
    }

    const entryWithUploader = {
      ...newEntry,
      uploaderName,
      metadata: {
        uploadTimestamp: Date.now(),
        uploadDate: new Date().toISOString(),
        fileSize: file?.size || 0,
        fileName: file?.name || 'unknown'
      }
    };

    try {
      // Upload the entry to S3
      const filename = `${Date.now()}-${entryWithUploader.name}`;
      await uploadEntry(entryWithUploader, filename);

      toast({
        title: "Success!",
        description: "Entry added to leaderboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload entry",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uploaderName.trim()) {
      toast({
        title: "Error",
        description: "Please select a file and enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Process the file and update leaderboard
      const resultData = await handleFileRead(file);
      await appendToLeaderboard(resultData, uploaderName);
      
      setFile(null);
      setUploaderName("");
      
      toast({
        title: "Success!",
        description: "Entry added to leaderboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process result",
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
            <Label htmlFor="uploaderName">Your Name</Label>
            <Input
              id="uploaderName"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
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
