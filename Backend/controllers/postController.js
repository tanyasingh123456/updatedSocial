const Post = require("../models/Post");
const Like = require("../models/Like");

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!content || content.length > 280) {
      return res.status(400).json({ message: "Invalid post content" });
    }

    const post = await Post.create({
      content,
      user: userId
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const userId = req.userId;

    const posts = await Post.find().sort({ createdAt: -1 });

    const postIds = posts.map(post => post._id);

    const likes = await Like.find({
      post: { $in: postIds }
    });

    const likeMap = {};
    const userLikedSet = new Set();

    likes.forEach(like => {
      const postId = like.post.toString();

      likeMap[postId] = (likeMap[postId] || 0) + 1;

      if (like.user === userId) {
        userLikedSet.add(postId);
      }
    });

    const formattedPosts = posts.map(post => ({
      ...post._doc,
      likeCount: likeMap[post._id.toString()] || 0,
      isLiked: userLikedSet.has(post._id.toString())
    }));

    res.json(formattedPosts);

  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};