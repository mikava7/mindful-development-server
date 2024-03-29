import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../modules/User.js'
import dotenv from 'dotenv'
// load environment variables from .env file
dotenv.config()
const secretKey = process.env.SECRET_KEY

export const registerUser = async (req, res) => {
  try {
    const { fullName, password, email, imageUrl } = req.body
    console.log({ fullName, password, email, imageUrl })
    // generate a salt and hash the password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // create a new user object with hashed password and other input fields
    const newUser = await User.create({
      fullName,
      email,
      imageUrl,
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
      message: error.message || 'Registration failed',
    })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body
    // console.log(email)
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
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    // remove passwordHash field from user object and return the user object with the JWT token
    const { passwordHash, ...userInfo } = user._doc
    res.json({
      ...userInfo,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Server error',
    })
  }
}

export const logoutUser = async (req, res) => {
  res.clearCookie('authToken')
  res.status(200).json({ message: 'Logged out' })
}

export const getAllUsers = async (req, res) => {
  try {
    const AllUser = await User.find({})
    res.status(200).json({ AllUser })
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Cant get users',
    })
  }
}

export const getUserInfo = async (req, res) => {
  try {
    // find user by user id in token payload
    const userData = await User.findById(req.userId)

    // if user not found, return 404 status with error message
    if (!userData) {
      return res.status(404).json({ message: 'User not found' })
    }

    // remove passwordHash field from user object and return the user object
    const { passwordHash, ...user } = userData._doc
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'No excess' })
  }
}

export const getUserById = async (req, res) => {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    res.status(200).json(user)
  } catch (error) {
    console.log('Error fetching user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const editUserInfo = async (req, res) => {
  try {
    const userId = req.userId
    const { fullName, email, imageUrl } = req.body
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        imageUrl,
      },
      { new: true }
    )

    res.status(200).json({ success: true, updatedUser })
  } catch (error) {
    res.status(500).json({ message: error.message || 'cant update user ' })
  }
}

export const editPassword = async (req, res) => {
  try {
    const userId = req.userId
    const { currentPassword, newPassword } = req.body
    console.log('in backend', { userId, currentPassword, newPassword })
    // find user in database by ID
    const user = await User.findById(userId)

    // compare current password with password hash in database
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' })
    }

    // generate new salt and hash new password
    const salt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(newPassword, salt)

    // update user's password hash in database
    await User.findByIdAndUpdate(userId, { passwordHash: newHash })

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Cannot update password' })
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
    const reversedVisited = user.visited.reverse() // Reverse the order of visited posts
    res.status(200).json(reversedVisited)
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

export const addFavorite = async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.userId
    const user = await User.findById(userId)

    if (user.favorites.includes(postId)) {
      return res.status(400).json({ message: 'Post already in favorites' })
    } else {
      user.favorites.push(postId)
      await user.save()
    }

    const updatedUser = await User.findById(userId).populate('favorites')

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      message: 'Post added to favorites',
      favorites: updatedUser.favorites,
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: error.message || "Can't add to favorites" })
  }
}

export const removeFavorite = async (req, res) => {
  try {
    const postId = req.params.postId
    console.log('postId from removeFavorite', postId)

    const userId = req.userId
    console.log('userId from removeFavorite', userId)

    const user = await User.findById(userId)

    if (!user.favorites.includes(postId)) {
      return res.status(404).json({ message: 'Favorite not found' })
    }
    const updatedFavorites = user.favorites.filter(
      (favorite) => favorite.toString() !== postId
    )
    console.log('updatedFavorites removeFavorite', updatedFavorites)

    user.favorites = updatedFavorites
    user.save()

    return res.status(200).json({
      message: 'Removed from favorites',
      favorites: updatedFavorites.favorites,
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: error.message || "can't remove  favorite" })
  }
}

export const getFavorites = async (req, res) => {
  try {
    const userId = req.userId

    const user = await User.findById(userId)
    // console.log('user', user)

    const favorites = user.favorites
    // console.log('favorites', favorites)
    return res.status(200).json({ favorites })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const addFollower = async (req, res) => {
  try {
    const followUserId = req.body.followId
    const currentUser = req.userId

    const user = await User.findByIdAndUpdate(
      followUserId,
      {
        $push: { followers: currentUser },
      },
      { new: true }
    )

    await User.findByIdAndUpdate(
      currentUser,
      {
        $push: { following: followUserId },
      },
      { new: true }
    )

    res.status(200).json({ message: 'Follower added successfully' })
  } catch (error) {
    return res.status(422).json({ error: error.message })
  }
}

export const removeFollower = async (req, res) => {
  try {
    const followUserId = req.body.followId
    const currentUser = req.userId

    const user = await User.findByIdAndUpdate(
      followUserId,
      {
        $pull: { followers: currentUser },
      },
      { new: true }
    )

    await User.findByIdAndUpdate(
      currentUser,
      {
        $pull: { following: followUserId },
      },
      { new: true }
    )

    res.status(200).json({ message: 'Follower removed successfully' })
  } catch (error) {
    return res.status(422).json({ error: error.message })
  }
}
// export const addFollower = async (req, res) => {
//   const currentUserId = req.userId
//   const userToFollowId = req.params.id
//   console.log('in currentUserId', currentUserId)
//   console.log('in userToFollowId', userToFollowId)

//   try {
//     const currentUser = await User.findById(currentUserId)
//     const userToFollow = await User.findById(userToFollowId)
//     console.log('in currentUser', currentUser)
//     console.log('in userToFollow', userToFollow)
//     // Add the current user to the followers list of the user being followed
//     if (!userToFollow.followers.includes(currentUser._id)) {
//       userToFollow.followers.push(currentUser._id)
//       await userToFollow.save()
//     } else {
//       return res.status(400).json({ message: 'User is already followed.' })
//     }

//     // Add the user being followed to the following list of the current user
//     if (!currentUser.following.includes(userToFollow._id)) {
//       currentUser.following.push(userToFollow._id)
//       await currentUser.save()
//     } else {
//       return res
//         .status(400)
//         .json({ message: 'User is already being followed.' })
//     }

//     return res.status(200).json({ message: 'User followed successfully.' })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ message: 'Server error.' })
//   }
// }

// export const removeFollower = async (req, res) => {
//   const currentUserId = req.userId
//   const userToUnfollowId = req.params.id
//   console.log({ currentUserId })
//   try {
//     const currentUser = await User.findById(currentUserId)
//     const userToUnfollow = await User.findById(userToUnfollowId)

//     // Remove the current user from the followers list of the user being unfollowed
//     userToUnfollow.followers.pull(currentUser._id)

//     // Remove the user being unfollowed from the following list of the current user
//     currentUser.following.pull(userToUnfollow._id)

//     await currentUser.save()
//     await userToUnfollow.save()

//     res.status(200).json('success')
//   } catch (error) {
//     console.log(error)
//     res.status(500).json('error')
//   }
// }
