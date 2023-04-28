import Comment from "../modules/Comments.js";
import Post from "../modules/Posts.js";
export const postComment = async (req, res) => {
	try {
		const { content, author } = req.body;
	

		const post = await Post.findById(req.params.id);
	
		if (!req.params.id) {
			return res.status(400).json({ message: "Missing post ID" });
		}
		
		if (!post) {
		  return res.status(404).json({ message: "Post not found" });
		}
	
		const comment = new Comment({
		  content,
		  author,
		  post: post._id,
		});
	
		await comment.save();
		post.comments.push(comment._id);
		await post.save();
	
		res.status(201).json({ message: "Comment added", comment });
	  } catch (error) {
		console.error(error);
		res.status(500).json({message: error.message || "Cant add comment" });
	  }
	};

export const getAllComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: post._id }).populate("author");

    const commentReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ _id: { $in: comment.replies } }).populate("author");
        return { comment, replies };
      })
    );

    res.status(200).json(commentReplies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 	message: error.message || "Server error" });
  }
};

export const removeComment = async (req, res) => {
	try {
		// Get the ID of the comment to remove from the request parameters
		const commentId = req.params.id;

		// Find the comment by ID and ensure that the user making the request is the author
		const removedComment = await Comment.findOneAndDelete({ _id: commentId, author: req.userId});

		// If no comment was found, return an error response with a message
		if (!removedComment) {
			return res.status(404).json({
				message: "Comment not found",
			});
		}

		// If the comment was successfully removed, return a success response with a message
		res.status(200).json({ success: true, message: "Comment was deleted" });
	} catch (error) {
		// If an error occurred during the removal process, log the error and return an error response
		console.log(error);
		res.status(501).json({
			message: error.message || "Can't delete comment",
		});
	}
};

