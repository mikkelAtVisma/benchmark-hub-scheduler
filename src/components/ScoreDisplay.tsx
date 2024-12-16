import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "../types/leaderboard";

type ScoreDisplayProps = {
  score: number;
  componentName?: string;
  fileName?: string;
  entries?: LeaderboardEntry[];
};

export const ScoreDisplay = ({ score, componentName, fileName, entries }: ScoreDisplayProps) => {
  const getScoreColor = () => {
    if (!componentName || !fileName || !entries) return '';
    
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
    if (score > previousScore) return 'text-green-500';
    if (score < previousScore) return 'text-red-500';
    return 'text-yellow-500';
  };

  return (
    <span className={cn("font-mono", getScoreColor())}>
      {score > 0 ? score.toFixed(2) : score.toLocaleString()}
    </span>
  );
};