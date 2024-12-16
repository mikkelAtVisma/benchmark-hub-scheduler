import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with real data from your backend
const mockData = [
  { 
    name: "Alice",
    hardScore: -11108757,
    softScore: -250080,
    timestamp: "2024-02-20",
    totalScore: -11358837,
    components: {
      IEval: 80.63,
      BRH: 62.51,
      MATH: 39.95,
      GPQA: 20.36,
      MUSR: 38.53,
      "MMLU-PRO": 70.03,
      "CFD-Cost": 33.01
    }
  },
  { 
    name: "Bob",
    hardScore: -10108757,
    softScore: -150080,
    timestamp: "2024-02-19",
    totalScore: -10258837,
    components: {
      IEval: 81.63,
      BRH: 61.92,
      MATH: 40.71,
      GPQA: 20.02,
      MUSR: 36.37,
      "MMLU-PRO": 66.80,
      "CFD-Cost": 15.00
    }
  },
].sort((a, b) => b.totalScore - a.totalScore);

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
            {mockData.map((entry, index) => (
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