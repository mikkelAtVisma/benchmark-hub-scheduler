import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Only use these values for local development and testing
const DEV_ACCESS_KEY = "AKIAYZXPSXXWKUZ6Z74D";
const DEV_SECRET_KEY = "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";
const DEV_BUCKET = "test-bucket-benchmark-upload";

const s3Client = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: DEV_ACCESS_KEY,
    secretAccessKey: DEV_SECRET_KEY,
  },
});

const ENTRIES_PREFIX = 'entries/';
const LEADERBOARD_KEY = 'leaderboard.json';

interface SimplifiedEntry {
  name: string;
  uploaderName?: string;
  branch: string;
  runLabel: string;
  runType: string;
  timestamp: number;
  timeLimit: number;
  iteration: number;
  jobInfo: any;
  scores: {
    hard: number;
    soft: number;
    hardComposition: Array<{ componentName: string; score: number }>;
    softComposition: Array<{ componentName: string; score: number }>;
  };
}

const createSimplifiedEntry = (fullEntry: any): SimplifiedEntry => {
  const lastStatGroup = fullEntry.statGroups[fullEntry.statGroups.length - 1];
  
  return {
    name: fullEntry.name,
    uploaderName: fullEntry.uploaderName,
    branch: fullEntry.branch,
    runLabel: fullEntry.runLabel,
    runType: fullEntry.runType,
    timestamp: fullEntry.timestamp,
    timeLimit: fullEntry.timeLimit,
    iteration: fullEntry.iteration,
    jobInfo: fullEntry.jobInfo,
    scores: {
      hard: lastStatGroup.scoreHard,
      soft: lastStatGroup.scoreSoft,
      hardComposition: lastStatGroup.hardScoreComposition,
      softComposition: lastStatGroup.softScoreComposition
    }
  };
};

export const uploadEntry = async (entry: any, filename: string): Promise<string[]> => {
  // Upload full version
  const fullKey = `${ENTRIES_PREFIX}full/${filename}`;
  const fullCommand = new PutObjectCommand({
    Bucket: DEV_BUCKET,
    Key: fullKey,
    Body: JSON.stringify(entry),
    ContentType: 'application/json',
  });

  // Create and upload simplified version
  const simplifiedEntry = createSimplifiedEntry(entry);
  const simplifiedKey = `${ENTRIES_PREFIX}simplified/${filename}`;
  const simplifiedCommand = new PutObjectCommand({
    Bucket: DEV_BUCKET,
    Key: simplifiedKey,
    Body: JSON.stringify(simplifiedEntry),
    ContentType: 'application/json',
  });

  await Promise.all([
    s3Client.send(fullCommand),
    s3Client.send(simplifiedCommand)
  ]);

  return [
    `https://${DEV_BUCKET}.s3.amazonaws.com/${fullKey}`,
    `https://${DEV_BUCKET}.s3.amazonaws.com/${simplifiedKey}`
  ];
};

export const getLeaderboardEntries = async () => {
  const command = new ListObjectsV2Command({
    Bucket: DEV_BUCKET,
    Prefix: `${ENTRIES_PREFIX}simplified/`,  // Only fetch simplified versions for the leaderboard
  });

  const response = await s3Client.send(command);
  const entries = [];

  for (const object of response.Contents || []) {
    const getCommand = new GetObjectCommand({
      Bucket: DEV_BUCKET,
      Key: object.Key!,
    });

    const response = await s3Client.send(getCommand);
    const content = await response.Body?.transformToString();
    if (content) {
      entries.push(JSON.parse(content));
    }
  }

  return entries;
};