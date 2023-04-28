import mongoose from "mongoose";

//define comment schema

const CommentSchema = new mongoose.Schema(
	{
	  content: {
		type: String,
		required: true,
	  },
	  author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	  },
	  post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		required: true,
	  },
	  
	},
	{
	  timestamps: true,
	}
  );
  
//export comment model
export default mongoose.model("Comment", CommentSchema);
