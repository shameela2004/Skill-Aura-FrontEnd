import React, { useState } from "react";
import axiosInstance from "../../services/axiosInstance"; // assuming you have like/comment endpoints

export default function PortfolioTab({ posts }: { posts: any[] }) {
  const [postLikes, setPostLikes] = useState<{[key:number]: number}>({});

  const handleLike = async (postId: number) => {
    // Call a like API, update likes
    await axiosInstance.post(`/post/${postId}/like`);
    setPostLikes(likes => ({...likes, [postId]: (likes[postId] || 0) + 1}));
  };

  return (
    <div>
      {posts.length === 0 ? (
        <span className="text-gray-400">No posts yet.</span>
      ) : (
        posts.map(post => (
          <div key={post.postId} className="border-b pb-3 mb-4">
            <div className="font-bold">{post.content}</div>
            <div className="flex items-center mt-2 gap-4">
              <button
                onClick={() => handleLike(post.postId)}
                className="text-indigo-600 hover:underline"
              >
                Like ({post.likeCount + (postLikes[post.postId] || 0)})
              </button>
              <button
                className="text-gray-600 hover:underline"
                // onClick={() => openCommentModal(post.postId)}
              >
                Comment ({post.commentCount})
              </button>
              {post.mediaUrl && (
                <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 underline">
                  Media
                </a>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
