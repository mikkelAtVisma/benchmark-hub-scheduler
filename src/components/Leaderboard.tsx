import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboardEntries } from "../lib/aws";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { RankBadge } from "./RankBadge";
import { ScoreDisplay } from "./ScoreDisplay";
import { LeaderboardEntry } from "../types/leaderboard";

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

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toISOString().split('T')[0];
  };

  return (
    <Card className="border-0 bg-secondary/50">
      <CardHeader>
        <CardTitle>Performance Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <LeaderboardHeader hardScoreComponents={hardScoreComponents} />
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.name + entry.timestamp} className="hover:bg-secondary/80">
                <TableCell><RankBadge rank={index + 1} /></TableCell>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>{entry.uploaderName || 'Anonymous'}</TableCell>
                <TableCell className="font-mono">
                  <ScoreDisplay score={entry.scores.hard} />
                </TableCell>
                {hardScoreComponents.map((component) => {
                  const score = entry.scores.hardComposition.find(
                    comp => comp.componentName === component
                  )?.score || 0;
                  return (
                    <TableCell key={component}>
                      <ScoreDisplay 
                        score={score}
                        componentName={component}
                        fileName={entry.name}
                        entries={entries}
                      />
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