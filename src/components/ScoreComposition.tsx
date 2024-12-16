import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreComponent {
  componentName: string;
  score: number;
}

interface ScoreCompositionProps {
  hardScoreComposition: ScoreComponent[];
  softScoreComposition: ScoreComponent[];
}

export const ScoreComposition = ({ hardScoreComposition, softScoreComposition }: ScoreCompositionProps) => {
  // Group scores by category for better organization
  const categories = {
    demand: ['hard-demand-monitor', 'soft-demand-monitor', 'attribute-demand-score-monitor'],
    rest: ['rest-between-shifts-monitor', 'periodic-rest-score-monitor'],
    fairness: [
      'rest-between-shifts-fairness-score-monitor',
      'period-distribution-fairness-score-monitor',
      'employee-utilization-fairness-score-monitor',
      'employee-availability-fairness-score-monitor',
      'periodic-rest-fairness-score-monitor'
    ],
    utilization: ['employee-utilization-score-monitor', 'global-fte-monitor'],
    patterns: ['pattern-score-monitor'],
    other: ['vacant-employee-monitor', 'employee-shift-prioritization-monitor']
  };

  const formatScore = (score: number) => {
    if (score === 0) return "✓";
    return score > 0 ? `+${score}` : score.toString();
  };

  const renderScoreSection = (title: string, components: ScoreComponent[], category: string[]) => {
    const relevantScores = components.filter(comp => 
      category.includes(comp.componentName.toLowerCase())
    );

    if (relevantScores.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-foreground/80">{title}</h4>
        <div className="space-y-1">
          {relevantScores.map(comp => (
            <div key={comp.componentName} className="flex justify-between items-center text-sm">
              <span className="text-foreground/70">
                {comp.componentName.replace(/-monitor$/, '').split('-').join(' ')}
              </span>
              <span className={`font-mono ${
                comp.score === 0 ? 'text-green-500' :
                comp.score > 0 ? 'text-blue-500' : 'text-red-500'
              }`}>
                {formatScore(comp.score)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate total scores
  const totalHard = hardScoreComposition.reduce((sum, comp) => sum + comp.score, 0);
  const totalSoft = softScoreComposition.reduce((sum, comp) => sum + comp.score, 0);

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-secondary/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Score Overview</CardTitle>
          <div className="flex space-x-4 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-foreground/70">Hard Score</span>
              <span className={`font-mono ${totalHard >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatScore(totalHard)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-foreground/70">Soft Score</span>
              <span className={`font-mono ${totalSoft >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatScore(totalSoft)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderScoreSection("Demand Scores", [...hardScoreComposition, ...softScoreComposition], categories.demand)}
            {renderScoreSection("Rest Period Scores", [...hardScoreComposition, ...softScoreComposition], categories.rest)}
            {renderScoreSection("Fairness Scores", [...hardScoreComposition, ...softScoreComposition], categories.fairness)}
            {renderScoreSection("Utilization Scores", [...hardScoreComposition, ...softScoreComposition], categories.utilization)}
            {renderScoreSection("Pattern Scores", [...hardScoreComposition, ...softScoreComposition], categories.patterns)}
            {renderScoreSection("Other Scores", [...hardScoreComposition, ...softScoreComposition], categories.other)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};