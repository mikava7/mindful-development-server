import mongoose from "mongoose";

/**
 * Connects to a MongoDB database using the specified URL.
 *
 * @param {string} url The connection URL for the MongoDB database.
 */
const connectToDB = (url) => {
	mongoose
		.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("Connected to MongoDB");
		})
		.catch((err) => {
			console.error("Error connecting to MongoDB:", err);
		});
};

export default connectToDB;
