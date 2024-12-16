import { Badge } from "@/components/ui/badge";

type RankBadgeProps = {
  rank: number;
};

export const RankBadge = ({ rank }: RankBadgeProps) => {
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