import mongoose from "mongoose";
import Favorites from './Favorites.js'

// define user schema
const UserSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},

		favorites: {
			type:[] , 
			default: [],
		},
		readLater: {
			type:[] , 
			default: [],
		},

		avatarUrl: String,
	},
	{
		timestamps: true,
	},
);

// export user model
export default mongoose.model("User", UserSchema);
