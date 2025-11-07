import React, { useEffect, useState } from "react";
import { FiHeart, FiMessageCircle, FiEdit2, FiTrash2, FiX, FiPlus } from "react-icons/fi";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  user: any;
}

const PostsSection: React.FC<Props> = ({ user }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [editPost, setEditPost] = useState<any | null>(null);
  const [comment, setComment] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostMedia, setNewPostMedia] = useState<string | null>(null);

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axiosInstance.get(`/post/user/${user.id}`);
        setPosts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user.id]);

  // Add new post
  const handleAddPost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const res = await axiosInstance.post("/post", {
        content: newPostContent,
        mediaUrl: newPostMedia,
      });

      // Optimistically add new post to list
      setPosts((prev) => [
        {
          id: Date.now(),
          userId: user.id,
          userName: user.username,
          description: newPostContent,
          imageUrl: newPostMedia,
          likeCount: 0,
          commentCount: 0,
          isLiked: false,
          comments: [],
          createdAt: new Date(),
        },
        ...prev,
      ]);

      setNewPostContent("");
      setNewPostMedia(null);
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  // … Keep existing like, delete, edit, comment logic here

  return (
    <div className="bg-white/[0.08] backdrop-blur-xl p-8 rounded-2xl shadow-md border border-white/10">
      <h2 className="text-2xl font-bold mb-6">Posts</h2>

      {/* Add New Post */}
      <div className="bg-white/[0.05] p-4 rounded-xl mb-6 border border-white/10">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-white/[0.08] text-gray-200 px-3 py-2 rounded-xl outline-none mb-2 resize-none"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Media URL (optional)"
            value={newPostMedia || ""}
            onChange={(e) => setNewPostMedia(e.target.value)}
            className="bg-white/[0.08] text-gray-200 px-3 py-2 rounded-xl outline-none flex-1 mr-2"
          />
          <button
            onClick={handleAddPost}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-white"
          >
            <FiPlus /> Post
          </button>
        </div>
      </div>

      {/* Existing posts list */}
      {loading ? (
        <p className="text-gray-400">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 italic">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/[0.05] border border-white/10 p-5 rounded-xl hover:border-indigo-600/40 transition-all"
            >
              {/* ... Keep post rendering, like, comments, edit modal as before */}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsSection;
