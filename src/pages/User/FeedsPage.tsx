import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import PortfolioTab from "../../components/MentorProfile/PostsTab"; // reuse your existing post list UI
import { useAuth } from "../../context/AuthContext";

interface Post {
  postId: number;
  userId: number;
  userName: string;
  userProfilePictureUrl: string;
  content: string;
  mediaUrl?: string;
  likeCount: number;
  commentCount: number;
  hasLiked: boolean;
  createdAt: string;
}

export default function FeedsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  // Fetch posts for feed
const fetchPosts = async (pageNum: number) => {
  if (!user) return;
  setLoading(true);
  try {
    const res = await axiosInstance.get("/Post/feed", {
  params: { page: pageNum, pageSize },
});
    const newPosts = res.data.data?.$values ?? [];


    if (newPosts.length < pageSize) {
      setHasMore(false);
    }

    setPosts((prev) => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));
  } catch {
    // Handle error gracefully here
  }
  setLoading(false);
};


  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [user?.id]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    fetchPosts(nextPage);
    setPage(nextPage);
  };

  if (!user) return <div>Please log in to see your feed.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4">
      <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
      {posts.length === 0 && !loading && <p>No posts to show.</p>}

      <PortfolioTab posts={posts} loggedInUserId={user.id} />

      {loading && <p>Loading...</p>}

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Load More
        </button>
      )}

      {!hasMore && <p className="mt-4 text-gray-500">No more posts.</p>}
    </div>
  );
}
