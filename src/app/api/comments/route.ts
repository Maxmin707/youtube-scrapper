import { NextResponse } from "next/server";
import { extractVideoId, getVideoComments } from "@/app/lib/youtube";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("videoUrl");

  if (!videoUrl) {
    return NextResponse.json(
      { error: "Video URL is required" },
      { status: 400 }
    );
  }

  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  try {
    const { comments, error } = await getVideoComments(videoId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log("Fetched comments:", comments);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
