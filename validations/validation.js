import { body } from "express-validator";

// Validation for login endpoint
export const loginValidator = [
	body("email").isEmail(), // Check if email is valid
	body("password").isLength({ min: 5 }), // Check if password length is at least 5 characters
];

// Validation for register endpoint
export const registerValidator = [
	body("email").isEmail(), // Check if email is valid
	body("password").isLength({ min: 5 }), // Check if password length is at least 5 characters
	body("fullName").isLength({ min: 3 }), // Check if full name length is at least 3 characters
	body("avatarURL").optional().isURL(), // Check if avatarURL is optional and is a valid URL
];
