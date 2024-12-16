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

  const hardScoreComponents = entries.length > 0 
    ? entries[0].scores.hardComposition
        .filter(comp => comp.score !== 0)
        .map(comp => comp.componentName)
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
        <div className="overflow-x-auto w-full max-w-[95vw]">
          <Table>
            <LeaderboardHeader hardScoreComponents={hardScoreComponents} />
            <TableBody>
              {entries.map((entry, index) => (
                <>
                  {/* Job Information Row */}
                  <TableRow key={`${entry.name}-${entry.timestamp}-info`} className="hover:bg-secondary/80 border-b-0">
                    <TableCell rowSpan={2}><RankBadge rank={index + 1} /></TableCell>
                    <TableCell rowSpan={2} className="font-medium">{entry.name}</TableCell>
                    <TableCell rowSpan={2}>{entry.uploaderName || 'Anonymous'}</TableCell>
                    <TableCell>{entry.branch}</TableCell>
                    <TableCell>{entry.runType}</TableCell>
                    <TableCell className="font-mono">{entry.runLabel}</TableCell>
                    <TableCell>{entry.timeLimit}s</TableCell>
                    <TableCell>{entry.iteration}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatTimestamp(entry.timestamp)}
                    </TableCell>
                  </TableRow>
                  {/* Score Information Row */}
                  <TableRow key={`${entry.name}-${entry.timestamp}-scores`} className="hover:bg-secondary/80">
                    <TableCell colSpan={7} className="border-t-0">
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Total Hard Score</div>
                          <ScoreDisplay score={entry.scores.hard} />
                        </div>
                        {hardScoreComponents.map((component) => {
                          const score = entry.scores.hardComposition.find(
                            comp => comp.componentName === component
                          )?.score || 0;
                          if (score === 0) return null;
                          return (
                            <div key={component}>
                              <div className="text-xs text-muted-foreground mb-1">
                                {component.split('-').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </div>
                              <ScoreDisplay 
                                score={score}
                                componentName={component}
                                fileName={entry.name}
                                entries={entries}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};