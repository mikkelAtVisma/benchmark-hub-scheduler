import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - replace with real data from your backend
const mockData = [
  { 
    name: "Alice",
    hardScore: -11108757,
    softScore: -250080,
    timestamp: "2024-02-20",
    totalScore: -11358837
  },
  { 
    name: "Bob",
    hardScore: -10108757,
    softScore: -150080,
    timestamp: "2024-02-19",
    totalScore: -10258837
  },
].sort((a, b) => b.totalScore - a.totalScore);

export const Leaderboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--secondary))",
                  border: "none",
                  borderRadius: "0.5rem",
                }}
              />
              <Line 
                type="monotone" 
                name="Hard Score"
                dataKey="hardScore" 
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                name="Soft Score"
                dataKey="softScore" 
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Hard Score</TableHead>
              <TableHead>Soft Score</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((entry, index) => (
              <TableRow key={entry.name}>
                <TableCell className="font-mono">{index + 1}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell className="font-mono">{entry.hardScore.toLocaleString()}</TableCell>
                <TableCell className="font-mono">{entry.softScore.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono">{entry.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};