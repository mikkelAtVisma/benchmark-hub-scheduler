import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ScoreComponent {
  componentName: string;
  score: number;
}

interface ScoreCompositionProps {
  hardScoreComposition: ScoreComponent[];
  softScoreComposition: ScoreComponent[];
}

export const ScoreComposition = ({ hardScoreComposition, softScoreComposition }: ScoreCompositionProps) => {
  // Filter out zero scores and prepare data for visualization
  const hardScoreData = hardScoreComposition
    .filter(comp => comp.score !== 0)
    .map(comp => ({
      name: comp.componentName.replace('-monitor', ''),
      score: Math.abs(comp.score)  // Use absolute values for better visualization
    }))
    .sort((a, b) => b.score - a.score);

  const softScoreData = softScoreComposition
    .filter(comp => comp.score !== 0)
    .map(comp => ({
      name: comp.componentName.replace('-monitor', ''),
      score: Math.abs(comp.score)
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-secondary/50">
        <CardHeader>
          <CardTitle>Hard Score Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hardScoreData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                <Bar dataKey="score" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-secondary/50">
        <CardHeader>
          <CardTitle>Soft Score Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={softScoreData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};