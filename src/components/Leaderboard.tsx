import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - replace with real data from your backend
const mockData = [
  { name: "Alice", score: 95, timestamp: "2024-02-20" },
  { name: "Bob", score: 88, timestamp: "2024-02-19" },
  { name: "Charlie", score: 92, timestamp: "2024-02-18" },
].sort((a, b) => b.score - a.score);

export const Leaderboard = () => {
  return (
    <div className="space-y-8">
      <div className="h-[300px] bg-secondary rounded-lg p-4">
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
              dataKey="score" 
              stroke="hsl(var(--primary))"
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
            <TableHead>Score</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((entry, index) => (
            <TableRow key={entry.name}>
              <TableCell className="font-mono">{index + 1}</TableCell>
              <TableCell>{entry.name}</TableCell>
              <TableCell className="font-mono">{entry.score}</TableCell>
              <TableCell className="text-right font-mono">{entry.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};