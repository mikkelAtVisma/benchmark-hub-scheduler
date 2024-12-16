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
  forcePathStyle: true // Add this to ensure correct URL formatting
});

const ENTRIES_PREFIX = 'entries/';

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
    uploaderName: fullEntry.uploaderName || 'Anonymous',
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
  const entryWithMetadata = {
    ...entry,
    metadata: {
      uploadTimestamp: Date.now(),
      uploadDate: new Date().toISOString(),
      fileSize: entry.fileSize || 0,
      fileName: entry.fileName || 'unknown'
    }
  };

  const fullKey = `${ENTRIES_PREFIX}full/${filename}`;
  const fullCommand = new PutObjectCommand({
    Bucket: DEV_BUCKET,
    Key: fullKey,
    Body: JSON.stringify(entryWithMetadata),
    ContentType: 'application/json',
  });

  const simplifiedEntry = createSimplifiedEntry(entryWithMetadata);
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
    `https://${DEV_BUCKET}.s3.eu-west-1.amazonaws.com/${fullKey}`,
    `https://${DEV_BUCKET}.s3.eu-west-1.amazonaws.com/${simplifiedKey}`
  ];
};

export const getLeaderboardEntries = async () => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: DEV_BUCKET,
      Prefix: `${ENTRIES_PREFIX}simplified/`,
    });

    const response = await s3Client.send(command);
    const entries = [];

    if (response.Contents) {
      for (const object of response.Contents) {
        if (object.Key) {
          const getCommand = new GetObjectCommand({
            Bucket: DEV_BUCKET,
            Key: object.Key,
          });

          const response = await s3Client.send(getCommand);
          const content = await response.Body?.transformToString();
          if (content) {
            entries.push(JSON.parse(content));
          }
        }
      }
    }

    return entries;
  } catch (error) {
    console.error('Error fetching leaderboard entries:', error);
    return [];
  }
};