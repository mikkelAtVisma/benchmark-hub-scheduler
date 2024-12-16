import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import leaderboardData from "../data/leaderboard.json";

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

export const Leaderboard = () => {
  const { data: entries = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      // In a real application, this would be an API call
      // For now, we're just returning the data from our JSON file
      return leaderboardData.entries.sort((a, b) => {
        const aScore = a.statGroups[0]?.scoreHard + a.statGroups[0]?.scoreSoft;
        const bScore = b.statGroups[0]?.scoreHard + b.statGroups[0]?.scoreSoft;
        return bScore - aScore;
      });
    },
  });

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
              <TableHead>Hard Score</TableHead>
              <TableHead>Soft Score</TableHead>
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
                <TableCell className="font-mono">{formatScore(entry.statGroups[0]?.scoreHard)}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.statGroups[0]?.scoreSoft)}</TableCell>
                <TableCell>{entry.branch}</TableCell>
                <TableCell>{entry.runType}</TableCell>
                <TableCell className="font-mono">{entry.runLabel}</TableCell>
                <TableCell>{entry.timeLimit}s</TableCell>
                <TableCell>{entry.iteration}</TableCell>
                <TableCell className="text-right font-mono">{formatTimestamp(entry.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};