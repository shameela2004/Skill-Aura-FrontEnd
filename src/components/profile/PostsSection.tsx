// import React, { useEffect, useState } from "react";
// import {
//   FiHeart,
//   FiMessageCircle,
//   FiEdit2,
//   FiTrash2,
//   FiX,
//   FiPlus,
// } from "react-icons/fi";
// import axiosInstance from "../../services/axiosInstance";
// import { motion } from "framer-motion";

// interface Props {
//   user: any;
// }

// const PostsSection: React.FC<Props> = ({ user }) => {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [newPostContent, setNewPostContent] = useState("");
//   const [newPostMedia, setNewPostMedia] = useState<string | null>(null);

//   // ✅ Load posts from user object
//   useEffect(() => {
//     if (user?.posts?.$values) {
//       setPosts(user.posts.$values);
//     } else {
//       setPosts([]);
//     }
//     setLoading(false); // ✅ stop showing loading
//   }, [user]);

//   // ➕ Add new post
//   const handleAddPost = async () => {
//     if (!newPostContent.trim()) return;

//     try {
//       const res = await axiosInstance.post("/post", {
//         content: newPostContent,
//         mediaUrl: newPostMedia,
//       });

//       // Optimistically add new post
//       const newPost = {
//         postId: Date.now(),
//         userId: user.id,
//         userName: user.name,
//         content: newPostContent,
//         mediaUrl: newPostMedia,
//         likeCount: 0,
//         commentCount: 0,
//         createdAt: new Date().toISOString(),
//       };

//       setPosts((prev) => [newPost, ...prev]);
//       setNewPostContent("");
//       setNewPostMedia(null);
//     } catch (err) {
//       console.error("Failed to create post", err);
//     }
//   };

//   return (
//     <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Posts</h2>

//       {/* ➕ Add New Post */}
//       <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
//         <textarea
//           value={newPostContent}
//           onChange={(e) => setNewPostContent(e.target.value)}
//           placeholder="What's on your mind?"
//           className="w-full bg-white text-gray-800 px-3 py-2 rounded-xl outline-none mb-3 resize-none border border-gray-300"
//           rows={3}
//         />
//         <div className="flex justify-between items-center">
//           <input
//             type="text"
//             placeholder="Media URL (optional)"
//             value={newPostMedia || ""}
//             onChange={(e) => setNewPostMedia(e.target.value)}
//             className="bg-white text-gray-800 px-3 py-2 rounded-xl outline-none flex-1 mr-2 border border-gray-300"
//           />
//           <button
//             onClick={handleAddPost}
//             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-white"
//           >
//             <FiPlus /> Post
//           </button>
//         </div>
//       </div>

//       {/* 🧩 Posts list */}
//       {loading ? (
//         <p className="text-gray-400">Loading posts...</p>
//       ) : posts.length === 0 ? (
//         <p className="text-gray-400 italic">No posts yet.</p>
//       ) : (
//         <div className="flex flex-col gap-6">
//           {posts.map((post) => (
//             <motion.div
//               key={post.postId}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
//             >
//               <div className="flex justify-between items-center mb-3">
//                 <div>
//                   <h3 className="font-semibold text-gray-800 text-lg">
//                     {post.userName}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     {new Date(post.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>

//               <p className="mb-4 text-gray-700 leading-relaxed">
//                 {post.content}
//               </p>

//               {post.mediaUrl && (
//                 <div className="overflow-hidden rounded-xl border border-gray-200 mb-3">
//                   <img
//                     src={post.mediaUrl}
//                     alt="post"
//                     className="w-full h-auto object-cover hover:scale-[1.01] transition-transform"
//                   />
//                 </div>
//               )}

//               <div className="flex items-center gap-6 text-gray-600">
//                 <button className="flex items-center gap-1 hover:text-pink-600">
//                   <FiHeart /> {post.likeCount}
//                 </button>
//                 <button className="flex items-center gap-1 hover:text-indigo-600">
//                   <FiMessageCircle /> {post.commentCount}
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostsSection;




import React, { useEffect, useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiX,
  FiPlus,
} from "react-icons/fi";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  user: any;
}

const PostsSection: React.FC<Props> = ({ user }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostMedia, setNewPostMedia] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [newComment, setNewComment] = useState("");

  // ✅ Load posts from user object
  useEffect(() => {
    if (user?.posts?.$values) {
      setPosts(user.posts.$values);
    } else {
      setPosts([]);
    }
    setLoading(false);
  }, [user]);

  // ➕ Add new post
  const handleAddPost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const res = await axiosInstance.post("/post", {
        content: newPostContent,
        mediaUrl: newPostMedia,
      });

      const newPost = {
        postId: Date.now(),
        userId: user.id,
        userName: user.name,
        content: newPostContent,
        mediaUrl: newPostMedia,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
        comments: [],
      };

      setPosts((prev) => [newPost, ...prev]);
      setNewPostContent("");
      setNewPostMedia(null);
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  // 💬 Add new comment (local simulation)
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    const updated = posts.map((p) =>
      p.postId === selectedPost.postId
        ? {
            ...p,
            comments: [
              ...(p.comments || []),
              { id: Date.now(), text: newComment, userName: user.name },
            ],
          }
        : p
    );

    setPosts(updated);
    setSelectedPost({
      ...selectedPost,
      comments: [
        ...(selectedPost.comments || []),
        { id: Date.now(), text: newComment, userName: user.name },
      ],
    });
    setNewComment("");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Posts</h2>

      {/* ➕ Add New Post */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-white text-gray-800 px-3 py-2 rounded-xl outline-none mb-3 resize-none border border-gray-300"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Media URL (optional)"
            value={newPostMedia || ""}
            onChange={(e) => setNewPostMedia(e.target.value)}
            className="bg-white text-gray-800 px-3 py-2 rounded-xl outline-none flex-1 mr-2 border border-gray-300"
          />
          <button
            onClick={handleAddPost}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-white"
          >
            <FiPlus /> Post
          </button>
        </div>
      </div>

      {/* 🧩 Posts list */}
      {loading ? (
        <p className="text-gray-400">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 italic">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.postId}
              onClick={() => setSelectedPost(post)} // 👈 open modal
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {post.userName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="mb-4 text-gray-700 leading-relaxed line-clamp-3">
                {post.content}
              </p>

              {post.mediaUrl && (
                <div className="overflow-hidden rounded-xl border border-gray-200 mb-3">
                  <img
                    src={post.mediaUrl}
                    alt="post"
                    className="w-full h-60 object-cover hover:scale-[1.01] transition-transform"
                  />
                </div>
              )}

              <div className="flex items-center gap-6 text-gray-600">
                <button className="flex items-center gap-1 hover:text-pink-600">
                  <FiHeart /> {post.likeCount}
                </button>
                <button className="flex items-center gap-1 hover:text-indigo-600">
                  <FiMessageCircle /> {post.commentCount}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🪟 Modal for viewing a post */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <FiX size={20} />
              </button>

              <h3 className="font-bold text-xl text-gray-800 mb-2">
                {selectedPost.userName}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(selectedPost.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-700 mb-4">{selectedPost.content}</p>

              {selectedPost.mediaUrl && (
                <img
                  src={selectedPost.mediaUrl}
                  alt="media"
                  className="w-full rounded-xl mb-4"
                />
              )}

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold mb-2 text-gray-800">
                  Comments ({selectedPost.comments?.length || 0})
                </h4>

                <div className="max-h-40 overflow-y-auto mb-3 space-y-2">
                  {selectedPost.comments?.map((c: any) => (
                    <div
                      key={c.id}
                      className="bg-gray-50 p-2 rounded-lg border border-gray-200"
                    >
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">{c.userName}: </span>
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 outline-none text-gray-800"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
                  >
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostsSection;
