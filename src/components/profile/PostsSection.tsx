import React, { useEffect, useState, useRef } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiPlus,
  FiX,
} from "react-icons/fi";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import CommonModal from "../CommonModal";

interface Props {
  user: any;
}

const PostsSection: React.FC<Props> = ({ user }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostMedia, setNewPostMedia] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [newComment, setNewComment] = useState("");

  // Load posts from user object
  useEffect(() => {
    if (user?.posts?.$values) {
      setPosts(user.posts.$values);
    } else {
      setPosts([]);
    }
    setLoading(false);
  }, [user]);

  // Add new post, including uploaded media
  const handleAddPost = async () => {
    if (!newPostContent.trim()) return;
    let postMediaUrl = newPostMedia;

    if (mediaFile) {
      const formData = new FormData();
      formData.append("file", mediaFile);
      formData.append("referenceType", "Post");
      formData.append("referenceId", user.id);

      try {
        const res = await axiosInstance.post("/media/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Assuming response has new media ID
        postMediaUrl = `https://localhost:7027/api/media/${res.data}`;
        setMediaFile(null);
      } catch (err) {
        console.error("Failed to upload post media", err);
      }
    }

    try {
      await axiosInstance.post("/post", {
        content: newPostContent,
        mediaUrl: postMediaUrl,
      });

      const newPost = {
        postId: Date.now(),
        userId: user.id,
        userName: user.name,
        content: newPostContent,
        mediaUrl: postMediaUrl,
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

  const handleMediaFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setMediaFile(event.target.files[0]);
      setShowMediaModal(false); // Hide modal after selection
    }
  };

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
        <div className="flex items-center gap-2">
          {/* "+" button for media upload (opens modal) */}
          <button
            type="button"
            className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-8 h-8 hover:bg-indigo-700"
            title="Add Media"
            onClick={() => setShowMediaModal(true)}
          >
            <FiPlus />
          </button>
          {/* Show selected media filename if any */}
          {mediaFile && (
            <span className="ml-2 text-xs text-gray-700">
              {mediaFile.name}
            </span>
          )}

          <CommonModal
            isOpen={showMediaModal}
            type="confirm"
            title="Add Media to Post?"
            message="Do you want to upload a media file with your post?"
            confirmText="Yes, select file"
            cancelText="Cancel"
            onConfirm={() => {
              setShowMediaModal(false);
              hiddenFileInput.current?.click();
            }}
            onCancel={() => setShowMediaModal(false)}
          />

          <input
            type="file"
            accept="image/*,video/*"
            ref={hiddenFileInput}
            style={{ display: "none" }}
            onChange={handleMediaFileChange}
          />

          {/* Media URL input (optional, for existing links) */}
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

      {/* 🧩 Posts List */}
      {loading ? (
        <p className="text-gray-400">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 italic">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.postId}
              onClick={() => setSelectedPost(post)}
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
