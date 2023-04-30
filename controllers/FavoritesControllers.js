import Favorites from '../modules/Favorites.js'

import User from '../modules/User.js'
import Post from '../modules/Posts.js'

export const getFavorites = async (req, res) => {
  try {
    const userId = req.userId

    const favorites = await Favorites.find({ author: userId }).populate('post')

    return res.status(200).json({ favorites })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const addFavorite = async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.userId

    let favorite = await Favorites.findOne({
      author: userId,
      post: postId,
    })

    if (favorite) {
      return res.status(400).json({ message: 'Post already favorited' })
    }

    favorite = new Favorites({
      author: userId,
      post: postId,
    })
    await favorite.save()

    return res.status(200).json(favorite)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

// export const addFavorite = async (req, res) => {
//   try {
//     const postId = req.params.postId
//     const userId = req.userId
//     const starColor = req.stared

//     const favorites = await Favorites.findOneAndUpdate(
//       { author: userId },
//       { $push: { posts: { post: postId, stared: !starColor } } },
//       { upsert: true, new: true }
//     )

//     return res
//       .status(200)
//       .json({ message: 'Favorite added successfully', favorites })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ message: 'Server error' })
//   }
// }

export const removeFavorite = async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.userId

    const favorite = await Favorites.findOneAndDelete({
      author: userId,
      post: postId,
    })

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' })
    }

    return res.status(200).json({ message: 'Favorite removed successfully' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
