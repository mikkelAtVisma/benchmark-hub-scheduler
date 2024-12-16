import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

type LeaderboardHeaderProps = {
  hardScoreComponents: string[];
};

export const LeaderboardHeader = ({ hardScoreComponents }: LeaderboardHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-secondary/80">
        <TableHead className="w-[60px]">Rank</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Uploaded By</TableHead>
        <TableHead>Total Hard Score</TableHead>
        {hardScoreComponents.map((component) => (
          <TableHead key={component} className="whitespace-nowrap">
            {component.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </TableHead>
        ))}
        <TableHead>Branch</TableHead>
        <TableHead>Run Type</TableHead>
        <TableHead>Run Label</TableHead>
        <TableHead>Time Limit</TableHead>
        <TableHead>Iteration</TableHead>
        <TableHead className="text-right">Date</TableHead>
      </TableRow>
    </TableHeader>
  );
};