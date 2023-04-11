import express from "express";
import cors from "cors";
import connectToDB from "./connect.js";
import userRouter from "./routes/userRoute.js";
import postRoutes from "./routes/postRoutes.js";
import tagsRouter from "./routes/tagsRoutes.js";

// load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();
import upload from "./multer/multerConfig.js";
const connection_string = process.env.MONGODB_URI;
const app = express();
const port = 5000; // Use PORT value from .env file or fallback to 4000
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(postRoutes);

app.use(tagsRouter);
// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

// Define a route to handle POST requests to the "/uploads" endpoint
app.post("/uploads", upload.single("image"), (req, res) => {
	// Return a JSON response with the URL of the uploaded file
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

const start = async () => {
	try {
		// Connect to the MongoDB database
		await connectToDB(connection_string);
		console.log(connection_string);

		// Start the server and listen for incoming requests
		app.listen(port, () => {
			console.log(`Server is listening on port ${port}`);
		});
	} catch (error) {
		// If there is an error connecting to the database or starting the server,
		// log the error and return an error message to the client
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

start();
