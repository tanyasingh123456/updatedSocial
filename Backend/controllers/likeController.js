const Like = require("../models/Like");

exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingLike = await Like.findOne({
      user: userId,
      post: postId
    });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({ liked: false });
    }

    await Like.create({
      user: userId,
      post: postId
    });

    return res.json({ liked: true });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};