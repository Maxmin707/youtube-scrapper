"use client";

import { useRef } from "react";
import PdfExport from "./PdfExport";

export interface Comment {
  id: string;
  author: string;
  authorProfileImageUrl: string;
  text: string;
  likeCount: number;
  publishedAt: string;
  replies?: Comment[];
}

export interface CommentListProps {
  comments: Comment[];
  videoTitle?: string;
}

export default function CommentList({
  comments,
  videoTitle = "YouTube Comments",
}: CommentListProps) {
  const commentsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-2xl">
      <PdfExport comments={comments} videoTitle={videoTitle} />
      <div ref={commentsRef}>
        <h2 className="text-lg font-bold mb-4">Comments ({comments.length})</h2>
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-b pb-2">
              <div className="flex items-center gap-2">
                {comment.authorProfileImageUrl && (
                  <img
                    src={comment.authorProfileImageUrl}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full"
                    crossOrigin="anonymous"
                  />
                )}
                <span className="font-semibold">{comment.author}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-1">{comment.text}</div>
              <div className="text-xs text-gray-600">
                👍 {comment.likeCount}
              </div>
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 mt-2">
                  <div className="font-semibold text-sm mb-1">
                    Replies ({comment.replies.length})
                  </div>
                  <ul className="space-y-2">
                    {comment.replies.map((reply) => (
                      <li key={reply.id} className="border-l-2 pl-2">
                        <div className="flex items-center gap-2">
                          {reply.authorProfileImageUrl && (
                            <img
                              src={reply.authorProfileImageUrl}
                              alt={reply.author}
                              className="w-6 h-6 rounded-full"
                              crossOrigin="anonymous"
                            />
                          )}
                          <span className="font-semibold">{reply.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-1">{reply.text}</div>
                        <div className="text-xs text-gray-600">
                          👍 {reply.likeCount}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
