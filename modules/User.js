import mongoose from "mongoose";

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
		avatarUrl: String,
	},
	{
		timestamps: true,
	},
);

// export user model
export default mongoose.model("User", UserSchema);
