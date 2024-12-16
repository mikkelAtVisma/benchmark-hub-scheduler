import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Only use these values for local development and testing
const DEV_ACCESS_KEY = "AKIAYZXPSXXWKUZ6Z74D";
const DEV_SECRET_KEY = "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";
const DEV_BUCKET = "test-bucket-benchmark-upload";
const REGION = "eu-west-1";

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: DEV_ACCESS_KEY,
    secretAccessKey: DEV_SECRET_KEY,
  },
  forcePathStyle: true
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

  try {
    await Promise.all([
      s3Client.send(fullCommand),
      s3Client.send(simplifiedCommand)
    ]);

    return [
      `https://${DEV_BUCKET}.s3.${REGION}.amazonaws.com/${fullKey}`,
      `https://${DEV_BUCKET}.s3.${REGION}.amazonaws.com/${simplifiedKey}`
    ];
  } catch (error) {
    console.error('Error uploading entry:', error);
    throw error;
  }
};

export const getLeaderboardEntries = async () => {
  try {
    // First, list all objects in the simplified entries directory
    const listCommand = new ListObjectsV2Command({
      Bucket: DEV_BUCKET,
      Prefix: `${ENTRIES_PREFIX}simplified/`,
    });

    const listResponse = await s3Client.send(listCommand);
    
    if (!listResponse.Contents) {
      console.log('No entries found in bucket');
      return [];
    }

    // Fetch all objects in parallel
    const entryPromises = listResponse.Contents.map(async (object) => {
      if (!object.Key) return null;

      const getCommand = new GetObjectCommand({
        Bucket: DEV_BUCKET,
        Key: object.Key,
      });

      try {
        const response = await s3Client.send(getCommand);
        const content = await response.Body?.transformToString();
        return content ? JSON.parse(content) : null;
      } catch (error) {
        console.error(`Error fetching entry ${object.Key}:`, error);
        return null;
      }
    });

    const entries = await Promise.all(entryPromises);
    return entries.filter((entry): entry is SimplifiedEntry => entry !== null);
    
  } catch (error) {
    console.error('Error fetching leaderboard entries:', error);
    throw error; // Let the error propagate to React Query for proper handling
  }
};