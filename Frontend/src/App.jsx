import React, { useEffect, useState } from "react";
import API from "./api/Api";
import PostForm from "./components/PostForm";
import PostCard from "./components/postCard";
import Container from "./components/Container";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add new post
  const handleAddPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Toggle like
  const handleLike = async (postId) => {
    try {
      setLoading(true);
      const res = await API.post(`/posts/${postId}/like`);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: res.data.liked,
                likeCount: res.data.liked
                  ? post.likeCount + 1
                  : post.likeCount - 1
              }
            : post
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="text-center font-bold text-3xl my-5 drop-shadow-md">
        Mini Social App
      </h2>
      <PostForm onAddPost={handleAddPost} />
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={handleLike}
          loading={loading}
        />
      ))}
    </Container>
  );
}

export default App;