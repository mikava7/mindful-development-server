import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import User from "../modules/User.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

export const registerUser = async (req, res) => {
	try {
		// validate input fields using express-validator
		const error = validationResult(req);

		// if there are errors, return 400 status with the array of errors
		if (!error.isEmpty()) {
			return res.status(400).json(error.array());
		}
		const { fullName, password, email, avatarUrl } = req.body;

		// generate a salt and hash the password
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		// create a new user object with hashed password and other input fields
		const newUser = await User.create({
			fullName,
			email,
			avatarUrl,
			passwordHash: hash,
		});

		// create a JWT token with user id as payload
		const token = jwt.sign(
			{
				_id: newUser._id,
			},
			secretKey,
			{
				expiresIn: "7d",
			},
		);

		// remove passwordHash field from user object and return the user object with the JWT token
		const { passwordHash, ...userInfo } = newUser._doc;
		res.json({
			...userInfo,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Registration failed",
		});
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email } = req.body;
		// find user by email
		const user = await User.findOne({ email });

		// if user not found, return 404 status with error message
		if (!user) {
			return res.status(404).json({
				message: "Wrong password or login",
			});
		}

		// compare input password with hashed password
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		// if password is incorrect, return 404 status with error message
		if (!isValidPass) {
			return res.status(404).json({
				message: "Wrong password or login",
			});
		}

		// create a JWT token with user id as payload
		const token = jwt.sign(
			{
				_id: user._id,
			},
			secretKey,
			{
				expiresIn: "7d",
			},
		);

		// remove passwordHash field from user object and return the user object with the JWT token
		const { passwordHash, ...userInfo } = user._doc;
		res.json({
			...userInfo,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Server error",
		});
	}
};
