import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboardEntries } from "../lib/aws";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardRow } from "./LeaderboardRow";
import { LeaderboardFilters } from "./LeaderboardFilters";
import { useState } from "react";

export const Leaderboard = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [uploaderFilter, setUploaderFilter] = useState("");

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

  const filteredEntries = entries.filter(entry => {
    const nameMatch = entry.name.toLowerCase().includes(nameFilter.toLowerCase());
    const uploaderMatch = (entry.uploaderName || 'Anonymous').toLowerCase().includes(uploaderFilter.toLowerCase());
    return nameMatch && uploaderMatch;
  });

  const hardScoreComponents = entries.length > 0 
    ? entries[0].scores.hardComposition
        .filter(comp => comp.score !== 0)
        .map(comp => comp.componentName)
    : [];

  return (
    <Card className="border-0 bg-secondary/50">
      <CardHeader>
        <CardTitle>Performance Leaderboard</CardTitle>
        <LeaderboardFilters
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          uploaderFilter={uploaderFilter}
          setUploaderFilter={setUploaderFilter}
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto w-full max-w-[95vw]">
          <Table>
            <LeaderboardHeader hardScoreComponents={hardScoreComponents} />
            <TableBody>
              {filteredEntries.map((entry, index) => (
                <LeaderboardRow
                  key={`${entry.name}-${entry.timestamp}`}
                  entry={entry}
                  index={index}
                  hardScoreComponents={hardScoreComponents}
                  entries={entries}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};