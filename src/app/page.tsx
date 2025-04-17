"use client";
import { useState } from "react";
import CommentForm from "./components/CommentForm";
import CommentList from "./components/CommentList";

export default function Home() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async (videoUrl: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/comments?videoUrl=${encodeURIComponent(videoUrl)}`
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch comments");
      setComments(data.comments);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">YouTube Comment Fetcher</h1>
      <CommentForm onSubmit={fetchComments} isLoading={isLoading} />
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {isLoading && <div className="mt-4">Loading comments...</div>}
      {!isLoading && comments.length > 0 && (
        <div className="mt-8 w-full flex justify-center">
          <CommentList comments={comments} />
        </div>
      )}
    </div>
  );
}
