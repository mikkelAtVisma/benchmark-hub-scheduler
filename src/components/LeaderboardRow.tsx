import { TableCell, TableRow } from "@/components/ui/table";
import { RankBadge } from "./RankBadge";
import { ScoreDisplay } from "./ScoreDisplay";
import { LeaderboardEntry } from "../types/leaderboard";

type LeaderboardRowProps = {
  entry: LeaderboardEntry;
  index: number;
  hardScoreComponents: string[];
  entries: LeaderboardEntry[];
};

export const LeaderboardRow = ({ entry, index, hardScoreComponents, entries }: LeaderboardRowProps) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toISOString().split('T')[0];
  };

  return (
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
  );
};