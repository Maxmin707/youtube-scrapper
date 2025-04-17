import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

if (!youtube) {
  console.error("Failed to initialize YouTube API client.");
}

export function extractVideoId(url: string): string | null {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

export async function getVideoComments(videoId: string, maxResults = 100) {
  try {
    const response = await youtube.commentThreads.list({
      part: ["snippet", "replies"],
      videoId,
      maxResults,
    });

    const comments =
      response.data.items?.map((item) => {
        const topLevelComment = item.snippet?.topLevelComment?.snippet;
        const replies = item.replies?.comments || [];
        return {
          id: item.id,
          author: topLevelComment?.authorDisplayName,
          authorProfileImageUrl: topLevelComment?.authorProfileImageUrl,
          text: topLevelComment?.textDisplay,
          likeCount: topLevelComment?.likeCount,
          publishedAt: topLevelComment?.publishedAt,
          replies: replies.map((reply) => ({
            id: reply.id,
            author: reply.snippet?.authorDisplayName,
            authorProfileImageUrl: reply.snippet?.authorProfileImageUrl,
            text: reply.snippet?.textDisplay,
            likeCount: reply.snippet?.likeCount,
            publishedAt: reply.snippet?.publishedAt,
          })),
        };
      }) || [];

    return { comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { comments: [], error: "Failed to fetch comments" };
  }
}
