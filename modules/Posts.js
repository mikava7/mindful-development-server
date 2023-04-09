import mongoose from "mongoose";

//define post schema

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId, // set the author field to an ObjectId
			ref: "User", // reference the 'User' model
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		category: String,
		tags: {
			type: Array,
			default: [],
		},
		viewCount: {
			type: Number,
			default: 0,
		},
		imageUrl: String,
	},
	{
		timestamps: true,
	},
);
//export post model
export default mongoose.model("Post", PostSchema);
