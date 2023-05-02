import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../modules/User.js'
import dotenv from 'dotenv'
// load environment variables from .env file
dotenv.config()
const secretKey = process.env.SECRET_KEY

export const registerUser = async (req, res) => {
  try {
    const { fullName, password, email, avatarUrl } = req.body

    // generate a salt and hash the password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // create a new user object with hashed password and other input fields
    const newUser = await User.create({
      fullName,
      email,
      avatarUrl,
      passwordHash: hash,
    })

    // create a JWT token with user id as payload
    const token = jwt.sign(
      {
        _id: newUser._id,
      },
      secretKey,
      {
        expiresIn: '7d',
      }
    )

    // remove passwordHash field from user object and return the user object with the JWT token
    const { passwordHash, ...userInfo } = newUser._doc
    res.status(201).json({
      ...userInfo,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: message.error || 'Registration failed',
    })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body
    // find user by email
    const user = await User.findOne({ email })

    // if user not found, return 404 status with error message
    if (!user) {
      return res.status(404).json({
        message: 'Wrong password or login',
      })
    }

    // compare input password with hashed password
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    )

    // if password is incorrect, return 404 status with error message
    if (!isValidPass) {
      return res.status(404).json({
        message: 'Wrong password or login',
      })
    }

    // create a JWT token with user id as payload
    const token = jwt.sign(
      {
        _id: user._id,
      },
      secretKey,
      {
        expiresIn: '7d',
      }
    )

    // remove passwordHash field from user object and return the user object with the JWT token
    const { passwordHash, ...userInfo } = user._doc
    res.json({
      ...userInfo,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Server error',
    })
  }
}

export const getUserInfo = async (req, res) => {
  try {
    // find user by user id in token payload
    const user = await User.findById(req.userId)

    // if user not found, return 404 status with error message
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // remove passwordHash field from user object and return the user object
    const { passwordHash, ...userData } = user._doc
    res.json(userData)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'No excess' })
  }
}
export const addVisitedPost = async (req, res) => {
  try {
    const postId = req.params.id
    console.log('postId from getVisitedPost', postId)
    const userId = req.userId
    console.log('userId from getVisitedPost', userId)
    const user = await User.findById(userId)
    if (user.visited.includes(postId)) {
      console.log('Post ID already exists in visited array')
    } else {
      user.visited.push(postId)
      await user.save()
      console.log('Added post ID to visited array')
    }

    const updatedVisited = await User.findById(userId).populate('visited')
    res.status(200).json(updatedVisited.visited)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message || "can't get post",
    })
  }
}

export const getVisitedPosts = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).populate('visited')
    res.status(200).json(user.visited)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message || "can't get visited posts",
    })
  }
}
export const clearHistory = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).populate('visited')
    user.visited = []
    // Save the updated user object
    await user.save()

    res.status(200).json([])
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message || "can't get visited posts",
    })
  }
}
