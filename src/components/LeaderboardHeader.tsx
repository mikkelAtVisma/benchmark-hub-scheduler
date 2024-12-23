import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

type LeaderboardHeaderProps = {
  hardScoreComponents: string[];
};

export const LeaderboardHeader = ({ hardScoreComponents }: LeaderboardHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-secondary/80">
        <TableHead rowSpan={2} className="w-[60px]">Rank</TableHead>
        <TableHead rowSpan={2}>Name</TableHead>
        <TableHead rowSpan={2}>Uploaded By</TableHead>
        <TableHead rowSpan={2}>Branch</TableHead>
        <TableHead rowSpan={2}>Run Type</TableHead>
        <TableHead rowSpan={2}>Run Label</TableHead>
        <TableHead rowSpan={2}>Time Limit</TableHead>
        <TableHead rowSpan={2}>Iteration</TableHead>
        <TableHead rowSpan={2} className="text-right">Date</TableHead>
      </TableRow>
    </TableHeader>
  );
};