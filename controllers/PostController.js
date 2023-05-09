import Post from '../modules/Posts.js'
import Comment from '../modules/Comments.js'
import User from '../modules/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { ObjectId } from 'mongoose'
import mongoose from 'mongoose'

// load environment variables from .env file
dotenv.config()
const secretKey = process.env.SECRET_KEY

export const getAllTags = async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $unwind: '$tags' }, // deconstructs the tags array into separate documents
      { $group: { _id: '$tags' } }, // groups the documents by tag value
      { $project: { _id: 0, tag: '$_id' } }, // renames the "_id" field to "tag"
    ])
    res.status(200).json(tags)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

export const getLastFiveTags = async (req, res) => {
  try {
    // Find the last 5 posts, sorted by creation date (newest first)
    const lastFivePosts = await Post.find().sort({ createdAt: -1 }).limit(6)

    // Initialize an empty array to hold the tags from the last 5 posts
    const lastFiveTags = []

    // Iterate over each post and push its tags to the lastFiveTags array
    lastFivePosts.forEach((post) => {
      lastFiveTags.push(...post.tags)
    })

    // Create a new array with only the unique tags from lastFiveTags
    const uniqueLastFiveTags = [...new Set(lastFiveTags)]

    // Return the first 5 unique tags as a JSON response
    res.status(200).json(uniqueLastFiveTags.slice(0, 6))
  } catch (error) {
    // If there is an error, return a 500 error response with a message
    res.status(500).json({ message: 'Server Error' })
  }
}

export const createPost = async (req, res) => {
  try {
    // get the input fields from the request body
    const { title, content, tags, imageUrl, author } = req.body

    //create new post object with input fields and author ID
    const newPost = await Post.create({
      title,
      content,
      tags,
      imageUrl,
      author: req.userId,
    })

    //return newly created post object
    res.status(200).json(newPost)
    console.log(newPost)
  } catch (error) {
    console.log(error)
    res.status(501).json({
      message: error.message || 'Failed',
    })
  }
}

export const getAllPost = async (req, res) => {
  try {
    // Find all posts and populate the "author" field with user object
    const allPosts = await Post.find({}).populate('author').exec()

    // Use map() to iterate over each post object in the array
    const postInfo = allPosts.map((post) => {
      // Destructure the "passwordHash" field from the "author" object of the post
      const { passwordHash, ...rest } = post.author._doc

      // Create a new object with the remaining fields of the post object,
      // and the updated "author" object without the "passwordHash" field
      return {
        ...post._doc,
        author: rest,
      }
    })

    // Return the new array of post objects without the "passwordHash" field
    res.status(200).json(postInfo)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message || 'No posts',
    })
  }
}

export const getSinglePost = async (req, res) => {
  try {
    // Get the post ID from the request parameters(dynamic parameter)
    const postId = req.params.id

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewCount: 1 } },
      { new: true } // Return the updated document
    )
    console.log('post', post)

    // If the post is not found, return a 404 error
    if (!post) {
      return res.status(404).json({
        message: 'post not found',
      })
    }

    res.status(200).json({ post })
  } catch (error) {
    // If there's an error, log it and return an error response with an error message
    console.log(error)
    res.status(500).json({
      message: error.message || "can't get post",
    })
  }
}

export const removePost = async (req, res) => {
  try {
    // Get the ID of the post to remove from the request parameters
    const postId = req.params.id
    // Find the post by ID and ensure that the user making the request is the author
    const removedPost = await Post.findOneAndDelete({
      _id: postId,
      author: req.userId,
    })

    await User.updateMany(
      { favorites: postId },
      { $pull: { favorites: postId } }
    )

    // If no post was found, return an error response with a message
    if (!removedPost) {
      return res.status(404).json({
        message: 'Post not found',
      })
    }

    // If the post was successfully removed, return a success response with a message
    res.status(200).json({ success: true, message: 'Post was deleted' })
  } catch (error) {
    // If an error occurred during the removal process, log the error and return an error response
    console.log(error)
    res.status(501).json({
      message: error.message || "Can't delete post",
    })
  }
}

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id
    const { title, content, imageUrl, tags, author } = req.body
    const updatedPost = await Post.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        // Get the necessary data from the client's request body
        title,
        content,
        imageUrl,
        tags,

        // Get the user ID from the token
        author: req.userId,
      }
    )

    res
      .status(200)
      .json({ success: true, message: 'Updated successfully', updatedPost })
  } catch (error) {
    // If an error occurred during the removal process, log the error and return an error response
    console.log(error)
    res.status(500).json({
      message: error.message || "Can't update post",
    })
  }
}

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    res.status(200).json({ post })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params
    console.log('postId in likePost', postId)
    const userId = req.userId
    console.log('userId in likePost', userId)

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    if (post.reactedBy.includes(userId)) {
      return res
        .status(400)
        .json({ error: 'User has already reacted to this post', post })
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { reactedBy: req.userId } },
        { new: true }
      )

      return res.status(200).json({ post: updatedPost })
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "can't like post" })
  }
}

export const unLikePost = async (req, res) => {
  try {
    const { postId } = req.params
    console.log('postId in unLikePost', postId)

    const userId = req.userId
    console.log('userId in unLikePost', userId)

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    if (!post.reactedBy.includes(userId)) {
      return res
        .status(400)
        .json({ error: 'User has not reacted to this post' })
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        { $pull: { reactedBy: req.userId } },
        { new: true }
      )

      return res.status(200).json({ post: updatedPost })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message || "can't unlike post" })
  }
}
