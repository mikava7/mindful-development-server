import { body } from 'express-validator'

// Validation for login endpoint
export const loginValidator = [
  body('email').isEmail(), // Check if email is valid
  body('password').isLength({ min: 5 }), // Check if password length is at least 5 characters
]

// Validation for register endpoint
export const registerValidator = [
  body('fullName').isLength({ min: 3 }), // Check if full name length is at least 3 characters
  body('password').isLength({ min: 5 }), // Check if password length is at least 5 characters
  body('email').isEmail(), // Check if email is valid
  body('avatarURL').optional().isURL(), // Check if avatarURL is optional and is a valid URL
]

// Validation for post create endpoint
export const postCreateValidation = [
  body('title').isLength({ min: 3 }).isString(),
  body('content').isLength({ min: 5 }).isString(),
  body('tags').optional().isArray(), // Check if tags is optional and is an array
  body('imageUrl').optional().isString(),
]
