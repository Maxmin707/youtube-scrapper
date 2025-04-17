"use client";
import { useState } from "react";

interface CommentFormProps {
  onSubmit: (videoUrl: string) => void;
  isLoading: boolean;
}

export default function CommentForm({ onSubmit, isLoading }: CommentFormProps) {
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      onSubmit(videoUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <input
        type="url"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter YouTube video URL"
        className="flex-grow p-3 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Get Comments"}
      </button>
    </form>
  );
}
