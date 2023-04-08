import mongoose from "mongoose";

//define comment schema

const CommentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},

		author: {
			type: mongoose.Schema.Types.ObjectId, // set the author field to an ObjectId
			ref: "User", // reference the 'User' model
			required: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId, // set the post field to an ObjectId
			ref: "Post", // reference the 'Post' model
			required: true,
		},
	},
	{
		timestamps: true,
	},
);
//export comment model
export default mongoose.model("Comment", CommentSchema);
