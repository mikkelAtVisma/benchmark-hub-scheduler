export type ScoreComposition = {
  componentName: string;
  score: number;
};

export type StatGroup = {
  timestamp: number;
  round: number;
  scoreHard: number;
  scoreSoft: number;
  missingMinutesMinDemand: number;
  hardScoreComposition: ScoreComposition[];
  softScoreComposition: ScoreComposition[];
};

export type LeaderboardEntry = {
  name: string;
  uploaderName?: string;
  branch: string;
  runLabel: string;
  runType: string;
  timestamp: number;
  timeLimit: number;
  iteration: number;
  jobInfo: {
    id: string;
    organisationId: string;
    scheduleType: string;
    demandType: string;
    planningHorizon: {
      startDate: string;
      endDate: string;
      fteStartDay: {
        date: string;
      };
      fteEndDay: {
        date: string;
      };
    };
  };
  scores: {
    hard: number;
    soft: number;
    hardComposition: ScoreComposition[];
    softComposition: ScoreComposition[];
  };
};