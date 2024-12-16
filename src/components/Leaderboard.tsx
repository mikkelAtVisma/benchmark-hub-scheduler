import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboardEntries } from "../lib/aws";
import { cn } from "@/lib/utils";

type ScoreComposition = {
  componentName: string;
  score: number;
};

type StatGroup = {
  timestamp: number;
  round: number;
  scoreHard: number;
  scoreSoft: number;
  missingMinutesMinDemand: number;
  hardScoreComposition: ScoreComposition[];
  softScoreComposition: ScoreComposition[];
};

type LeaderboardEntry = {
  name: string;
  uploaderName?: string;
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
  scores: {
    hard: number;
    soft: number;
    hardComposition: ScoreComposition[];
    softComposition: ScoreComposition[];
  };
};

const getScoreColor = (currentScore: number, entries: LeaderboardEntry[], componentName: string, fileName: string) => {
  // Find previous entries with the same filename
  const previousEntries = entries
    .filter(entry => entry.name === fileName)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  if (previousEntries.length <= 1) return '';

  // Find the score for this component in the previous entry
  const previousEntry = previousEntries[1];
  const previousScore = previousEntry.scores.hardComposition.find(
    comp => comp.componentName === componentName
  )?.score || 0;

  // Return appropriate color class based on improvement
  if (currentScore > previousScore) return 'text-green-500';
  if (currentScore < previousScore) return 'text-red-500';
  return 'text-yellow-500';
};

export const Leaderboard = () => {
  const { data: entries = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const entries = await getLeaderboardEntries();
      return entries.sort((a, b) => {
        const aScore = a.scores.hard + a.scores.soft;
        const bScore = b.scores.hard + b.scores.soft;
        return bScore - aScore;
      });
    },
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 5000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
    retry: false,
    structuralSharing: false
  });

  // Get unique component names from all entries
  const hardScoreComponents = entries.length > 0 
    ? entries[0].scores.hardComposition.map(comp => comp.componentName)
    : [];

  return (
    <Card className="border-0 bg-secondary/50">
      <CardHeader>
        <CardTitle>Performance Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-secondary/80">
              <TableHead className="w-[60px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Total Hard Score</TableHead>
              {hardScoreComponents.map((component) => (
                <TableHead key={component} className="whitespace-nowrap">
                  {component.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </TableHead>
              ))}
              <TableHead>Branch</TableHead>
              <TableHead>Run Type</TableHead>
              <TableHead>Run Label</TableHead>
              <TableHead>Time Limit</TableHead>
              <TableHead>Iteration</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.name + entry.timestamp} className="hover:bg-secondary/80">
                <TableCell>{getRankBadge(index + 1)}</TableCell>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>{entry.uploaderName || 'Anonymous'}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.scores.hard)}</TableCell>
                {hardScoreComponents.map((component) => {
                  const score = entry.scores.hardComposition.find(
                    comp => comp.componentName === component
                  )?.score || 0;
                  return (
                    <TableCell 
                      key={component} 
                      className={cn(
                        "font-mono",
                        entry.name === "gat-worktype1.json" && 
                        getScoreColor(score, entries, component, entry.name)
                      )}
                    >
                      {formatScore(score)}
                    </TableCell>
                  );
                })}
                <TableCell>{entry.branch}</TableCell>
                <TableCell>{entry.runType}</TableCell>
                <TableCell className="font-mono">{entry.runLabel}</TableCell>
                <TableCell>{entry.timeLimit}s</TableCell>
                <TableCell>{entry.iteration}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatTimestamp(entry.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const getRankBadge = (rank: number) => {
  switch(rank) {
    case 1:
      return <Badge variant="default" className="bg-yellow-500">🥇</Badge>;
    case 2:
      return <Badge variant="default" className="bg-gray-400">🥈</Badge>;
    case 3:
      return <Badge variant="default" className="bg-amber-700">🥉</Badge>;
    default:
      return <Badge variant="secondary">{rank}</Badge>;
  }
};

const formatScore = (score: number) => {
  if (score > 0) {
    return score.toFixed(2) + "%";
  }
  return score.toLocaleString();
};

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toISOString().split('T')[0];
};