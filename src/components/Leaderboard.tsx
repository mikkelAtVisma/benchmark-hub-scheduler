import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import leaderboardData from "../data/leaderboard.json";

type LeaderboardEntry = {
  name: string;
  hardScore: number;
  softScore: number;
  timestamp: string;
  totalScore: number;
  components: {
    IEval: number;
    BRH: number;
    MATH: number;
    GPQA: number;
    MUSR: number;
    "MMLU-PRO": number;
    "CFD-Cost": number;
  };
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

export const Leaderboard = () => {
  const { data: entries = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      // In a real application, this would be an API call
      // For now, we're just returning the data from our JSON file
      return leaderboardData.entries.sort((a, b) => b.totalScore - a.totalScore);
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
              <TableHead>IEval</TableHead>
              <TableHead>BRH</TableHead>
              <TableHead>MATH</TableHead>
              <TableHead>GPQA</TableHead>
              <TableHead>MUSR</TableHead>
              <TableHead>MMLU-PRO</TableHead>
              <TableHead>CFD-Cost</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.name} className="hover:bg-secondary/80">
                <TableCell>{getRankBadge(index + 1)}</TableCell>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.hardScore)}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.softScore)}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.components.IEval)}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.components.BRH)}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.components.MATH)}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.components.GPQA)}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.components.MUSR)}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.components["MMLU-PRO"])}</TableCell>
                <TableCell className="font-mono">{formatScore(entry.components["CFD-Cost"])}</TableCell>
                <TableCell className="text-right font-mono">{entry.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};