import Favorites from "../modules/Favorites.js";
import User from "../modules/User.js";
import Post from '../modules/Posts.js'

export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.userId
    console.log("userId",userId)
    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const favorites = user.favorites.map((favorite) => favorite.post);

    res.status(200).json({ favorites });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Can't get favorites",
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const postId = req.params.postId;

    const userId = req.userId

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postExists = await Post.exists({ _id: postId });

    if (!postExists) {
      console.log("Post not found");
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post is already a favorite of the user
    const favoriteExists = user.favorites.some(
      (favorite) => favorite.post.toString() === postId
    );

    if (favoriteExists) {
      console.log("Favorite already exists");
      return res.status(400).json({ message: "Favorite already exists" });
    }

    // Create a new favorite object with the post ID and user ID
    const favorite = { post: postId, author: userId };

    // Add the new favorite to the user's favorites array
    user.favorites.push(favorite);

    // Save the user object to update the favorites array
    await user.save();

    // Return a success response with the new favorite object
    return res.status(200).json({ favorite });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const removeFavorite = async (req,res)=>{
  try {
    const postId = req.params.postId;
console.log("postId",postId)
    const userId = req.userId
    console.log("userId",userId)

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const favorite = user.favorites.find(
      (favorite) => favorite.post.toString() === postId
    );

    if (!favorite) {
      console.log("Favorite not found");
      return res.status(404).json({ message: "Favorite not found" });
    }

    user.favorites = user.favorites.filter(
      (favorite) => favorite.post.toString() !== postId
    );

    await user.save();

    return res.status(200).json({ success: true, message: "Favorite removed" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}