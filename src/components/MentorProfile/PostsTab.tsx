// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../services/axiosInstance";
// import CommonModal, {type  ModalType } from "../CommonModal";

// interface Post {
//   postId: number;
//   userId: number;
//   userName: string;
//   content: string;
//   mediaUrl?: string;
//   likeCount: number;
//   commentCount: number;
//   hasLiked:boolean;
//   createdAt: string;
// }

// interface Comment {
//   commentId: number;
//   userId: number;
//   userName: string;
//   commentText: string;
//   createdAt: string;
// }

// export default function PortfolioTab({
//   posts: initialPosts,
//   loggedInUserId
// }: {
//   posts: Post[];
//   loggedInUserId: number | undefined;
// }) {
//   const [posts, setPosts] = useState<Post[]>(initialPosts);
//   const [showCommentModal, setShowCommentModal] = useState(false);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [activePostId, setActivePostId] = useState<number | null>(null);
//   const [addComment, setAddComment] = useState("");
//   const [editCommentId, setEditCommentId] = useState<number | null>(null);
//   const [editCommentText, setEditCommentText] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalType, setModalType] = useState<ModalType>("success");
//  useEffect(() => {
//     setPosts(initialPosts);
//   }, [initialPosts]);
//   // Like/unlike post, optimistic UI
// const handleLike = async (postId: number) => {
//   try {
//     await axiosInstance.post(`/post/${postId}/toggle-like`);
//     setPosts(prev =>
//       prev.map(p =>
//         p.postId === postId
//           ? {
//               ...p,
//               hasLiked: !p.hasLiked,
//               likeCount: p.hasLiked ? p.likeCount - 1 : p.likeCount + 1, // reflect toggle correctly
//             }
//           : p
//       )
//     );
//   } catch {
//     setModalType("error");
//     setModalMessage("Failed to update like.");
//     setModalOpen(true);
//   }
// };


//   // Load comments for a post
//   const openComments = async (postId: number) => {
//     setActivePostId(postId);
//     setShowCommentModal(true);
//     try {
//       const res = await axiosInstance.get(`/post/${postId}/comments`);
//       setComments(res.data.data?.$values ?? []);
//     } catch {
//       setComments([]);
//     }
//   };

//   // Add comment
//   const handleAddComment = async () => {
//     if (!addComment.trim() || !activePostId) return;
//     try {
//       await axiosInstance.post(`/post/${activePostId}/comment`, { commentText: addComment });
//       setAddComment("");
//       // reload comments and increment count
//       openComments(activePostId);
//       setPosts(prev =>
//         prev.map(p =>
//           p.postId === activePostId ? { ...p, commentCount: p.commentCount + 1 } : p
//         )
//       );
//     } catch {
//       setModalType("error");
//       setModalMessage("Failed to add comment.");
//       setModalOpen(true);
//     }
//   };

//   // Edit comment
//   const handleEditComment = async () => {
//     if (!editCommentId) return;
//     try {
//       await axiosInstance.put(`/post/${editCommentId}/comment`, { commentText: editCommentText });
//       setEditCommentId(null);
//       setEditCommentText("");
//       if (activePostId) openComments(activePostId);
//     } catch {
//       setModalType("error");
//       setModalMessage("Failed to update comment.");
//       setModalOpen(true);
//     }
//   };

//   // Delete comment
//   const handleDeleteComment = async (commentId: number) => {
//     try {
//       await axiosInstance.delete(`/post/${commentId}/comments`);
//       if (activePostId) openComments(activePostId);
//       setPosts(prev =>
//         prev.map(p =>
//           p.postId === activePostId
//             ? { ...p, commentCount: Math.max(0, p.commentCount - 1) }
//             : p
//         )
//       );
//     } catch {
//       setModalType("error");
//       setModalMessage("Failed to delete comment.");
//       setModalOpen(true);
//     }
//   };

//   return (
//     <div>
//       {posts.length === 0 ? (
//         <span className="text-gray-400">No posts yet.</span>
//       ) : (
//         posts.map(post => (
//           <div key={post?.postId} className="rounded-lg mb-8 bg-white shadow p-5">
//             <div className="flex items-center gap-2 mb-1">
//               <span className="font-bold">{post.userName}</span>
//               <span className="text-xs text-gray-400">
//                 {new Date(post.createdAt).toLocaleString()}
//               </span>
//             </div>
//             <div className="break-words text-base mb-2">{post.content}</div>
//             {post.mediaUrl && (
//               <div className="w-full flex justify-center my-2">
//                 <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer">
//                   <img
//                     src={post.mediaUrl}
//                     alt="post"
//                     className="rounded-md max-w-sm h-60 object-cover shadow border"
//                   />
//                 </a>
//               </div>
//             )}
//             <div className="flex gap-6 mt-3">
//               <button
//                 onClick={() => handleLike(post.postId)}
//                 className="flex items-center gap-1 text-pink-600 hover:scale-110 transition-transform focus:outline-none"
//                 aria-label="Like"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill={post.hasLiked  ? "currentColor" : "none"}
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                    className={`w-6 h-6 ${post.hasLiked ? "fill-pink-600" : "stroke-pink-600"}`}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.757l1.318-1.439a4.5 4.5 0 116.364 6.364L12 20.485l-7.682-7.803a4.5 4.5 0 010-6.364z"
//                   />
//                 </svg>
//                 <span>{post.likeCount}</span>
//               </button>
//               <button
//                 className="flex items-center gap-1 text-blue-600 hover:underline"
//                 aria-label="Comment"
//                 onClick={() => openComments(post.postId)}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
//                   />
//                 </svg>
//                 <span>{post.commentCount}</span>
//               </button>
//             </div>
//           </div>
//         ))
//       )}

//       {/* Comments Modal - do NOT pass content as children to CommonModal */}
//       {showCommentModal && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
//             <button
//               className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 text-xl"
//               onClick={() => setShowCommentModal(false)}
//             >
//               ×
//             </button>
//             <div className="font-semibold mb-2">Comments</div>
//             <div className="max-h-64 overflow-auto py-2 px-1 space-y-2">
//               {comments.length === 0 ? (
//                 <span className="text-gray-400">No comments yet.</span>
//               ) : (
//                 comments.map(comment => (
//                   <div key={comment.commentId} className="flex items-baseline gap-2 border-b last:border-0 pb-1">
//                     <span className="font-semibold">{comment.userName}:</span>
//                     {editCommentId === comment.commentId ? (
//                       <>
//                         <input
//                           className="flex-1 border rounded px-2 py-1"
//                           value={editCommentText}
//                           onChange={e => setEditCommentText(e.target.value)}
//                         />
//                         <button
//                           className="text-indigo-600 text-xs ml-1"
//                           onClick={handleEditComment}
//                         >
//                           Save
//                         </button>
//                         <button
//                           className="text-gray-500 text-xs ml-1"
//                           onClick={() => {
//                             setEditCommentId(null);
//                             setEditCommentText("");
//                           }}
//                         >
//                           Cancel
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <span>{comment.commentText}</span>
//                         {comment.userId === loggedInUserId && (
//                           <>
//                             <button
//                               className="text-blue-600 text-xs ml-2"
//                               onClick={() => {
//                                 setEditCommentId(comment.commentId);
//                                 setEditCommentText(comment.commentText);
//                               }}
//                             >
//                               Edit
//                             </button>
//                             <button
//                               className="text-red-600 text-xs ml-1"
//                               onClick={() => handleDeleteComment(comment.commentId)}
//                             >
//                               Delete
//                             </button>
//                           </>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//             <div className="flex gap-2 mt-3">
//               <input
//                 className="flex-1 border rounded px-2 py-1"
//                 value={addComment}
//                 onChange={e => setAddComment(e.target.value)}
//                 placeholder="Write your comment…"
//               />
//               <button
//                 onClick={handleAddComment}
//                 className="bg-indigo-600 text-white px-4 py-1 rounded-lg"
//               >
//                 Post
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Message Modal */}
//       <CommonModal
//         isOpen={modalOpen}
//         type={modalType}
//         title={modalType === "error" ? "Error" : "Success"}
//         message={modalMessage}
//         onCancel={() => setModalOpen(false)}
//         confirmText="OK"
//         cancelText=""
//       />
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import CommonModal, { type ModalType } from "../CommonModal";

interface Post {
  postId: number;
  userId: number;
  userName: string;
   userProfilePictureUrl:string;
  content: string;
  mediaUrl?: string;
  likeCount: number;
  commentCount: number;
  hasLiked: boolean;
  createdAt: string;
}

interface Comment {
  commentId: number;
  userId: number;
  userName: string;
  commentText: string;
  createdAt: string;
}

export default function PortfolioTab({
  posts: initialPosts,
  loggedInUserId,
}: {
  posts: Post[];
  loggedInUserId: number | undefined;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [addComment, setAddComment] = useState("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<ModalType>("success");

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleLike = async (postId: number) => {
    try {
      await axiosInstance.post(`/post/${postId}/toggle-like`);
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === postId
            ? {
                ...p,
                hasLiked: !p.hasLiked,
                likeCount: p.hasLiked ? p.likeCount - 1 : p.likeCount + 1,
              }
            : p
        )
      );
    } catch {
      setModalType("error");
      setModalMessage("Failed to update like.");
      setModalOpen(true);
    }
  };

  const openComments = async (postId: number) => {
    setActivePostId(postId);
    setShowCommentModal(true);
    try {
      const res = await axiosInstance.get(`/post/${postId}/comments`);
      setComments(res.data.data?.$values ?? []);
    } catch {
      setComments([]);
    }
  };

  const handleAddComment = async () => {
    if (!addComment.trim() || !activePostId) return;
    try {
      await axiosInstance.post(`/post/${activePostId}/comment`, { commentText: addComment });
      setAddComment("");
      openComments(activePostId);
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === activePostId ? { ...p, commentCount: p.commentCount + 1 } : p
        )
      );
    } catch {
      setModalType("error");
      setModalMessage("Failed to add comment.");
      setModalOpen(true);
    }
  };

  const handleEditComment = async () => {
    if (!editCommentId) return;
    try {
      await axiosInstance.put(`/post/${editCommentId}/comment`, { commentText: editCommentText });
      setEditCommentId(null);
      setEditCommentText("");
      if (activePostId) openComments(activePostId);
    } catch {
      setModalType("error");
      setModalMessage("Failed to update comment.");
      setModalOpen(true);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axiosInstance.delete(`/post/${commentId}/comments`);
      if (activePostId) openComments(activePostId);
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === activePostId
            ? { ...p, commentCount: Math.max(0, p.commentCount - 1) }
            : p
        )
      );
    } catch {
      setModalType("error");
      setModalMessage("Failed to delete comment.");
      setModalOpen(true);
    }
  };

  return (
    <div>
      {posts.length === 0 ? (
        <span className="text-gray-400">No posts yet.</span>
      ) : (
        posts.map((post) => (
          <div
            key={post?.postId}
            className="rounded-xl mb-6 bg-white shadow border border-gray-100 px-4 pt-4 pb-2 max-w-xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                 src={`https://localhost:7027${post.userProfilePictureUrl}`|| "/default-avatar.png"}
                  alt="User"
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <div>
                  <span className="font-semibold text-base">
                    {post.userName}
                  </span>
                  <div className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              {/* ... more (optional dropdown) */}
            </div>

            {/* Content */}
            {post.content && (
              <div className="my-3 text-gray-900 whitespace-pre-line">{post.content}</div>
            )}

            {/* Image: take full width, fit, rounded */}
            {post.mediaUrl && (
              <div className="w-full flex justify-center mt-1 mb-2 overflow-hidden rounded-md">
                <img
                  src={post.mediaUrl}
                  alt=""
                  className="w-full max-h-80 object-cover rounded-md border"
                  style={{
                    aspectRatio: "16/9", // Keeps image condensed like LinkedIn
                    background: "#eee",
                  }}
                  loading="lazy"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-6 mt-2 text-sm">
              <button
                onClick={() => handleLike(post.postId)}
                className="flex items-center gap-1 text-pink-600 hover:scale-110 transition-transform focus:outline-none"
                aria-label="Like"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={post.hasLiked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-5 h-5 ${post.hasLiked ? "fill-pink-600" : "stroke-pink-600"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.757l1.318-1.439a4.5 4.5 0 116.364 6.364L12 20.485l-7.682-7.803a4.5 4.5 0 010-6.364z"
                  />
                </svg>
                <span>{post.likeCount}</span>
              </button>
              <button
                className="flex items-center gap-1 text-blue-600 hover:underline"
                aria-label="Comment"
                onClick={() => openComments(post.postId)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
                  />
                </svg>
                <span>{post.commentCount}</span>
              </button>
            </div>

            {/* Comments Modal */}
            {showCommentModal && activePostId === post.postId && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
                  <button
                    className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={() => setShowCommentModal(false)}
                  >
                    ×
                  </button>
                  <div className="font-semibold mb-2">Comments</div>
                  <div className="max-h-64 overflow-auto py-2 px-1 space-y-2">
                    {comments.length === 0 ? (
                      <span className="text-gray-400">No comments yet.</span>
                    ) : (
                      comments.map((comment) => (
                        <div
                          key={comment.commentId}
                          className="flex items-baseline gap-2 border-b last:border-0 pb-1"
                        >
                          <span className="font-semibold">{comment.userName}:</span>
                          {editCommentId === comment.commentId ? (
                            <>
                              <input
                                className="flex-1 border rounded px-2 py-1"
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                              />
                              <button
                                className="text-indigo-600 text-xs ml-1"
                                onClick={handleEditComment}
                              >
                                Save
                              </button>
                              <button
                                className="text-gray-500 text-xs ml-1"
                                onClick={() => {
                                  setEditCommentId(null);
                                  setEditCommentText("");
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <span>{comment.commentText}</span>
                              {comment.userId === loggedInUserId && (
                                <>
                                  <button
                                    className="text-blue-600 text-xs ml-2"
                                    onClick={() => {
                                      setEditCommentId(comment.commentId);
                                      setEditCommentText(comment.commentText);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="text-red-600 text-xs ml-1"
                                    onClick={() => handleDeleteComment(comment.commentId)}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <input
                      className="flex-1 border rounded px-2 py-1"
                      value={addComment}
                      onChange={(e) => setAddComment(e.target.value)}
                      placeholder="Write your comment…"
                    />
                    <button
                      onClick={handleAddComment}
                      className="bg-indigo-600 text-white px-4 py-1 rounded-lg"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Message Modal */}
            <CommonModal
              isOpen={modalOpen}
              type={modalType}
              title={modalType === "error" ? "Error" : "Success"}
              message={modalMessage}
              onCancel={() => setModalOpen(false)}
              confirmText="OK"
              cancelText=""
            />
          </div>
        ))
      )}
    </div>
  );
}
