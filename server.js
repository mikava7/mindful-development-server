import express from "express";
import connectToDB from "./connect.js";
import userRouter from "./routes/userRoute.js";
import postRoutes from "./routes/postRoutes.js";
// load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
const connection_string = process.env.MONGODB_URI;
const app = express();
const port = 5000; // Use PORT value from .env file or fallback to 4000

// Create a new disk storage engine with options for where to store files and how to name them
const storage = multer.diskStorage({
	// Set the destination folder for uploaded files
	destination: (_, __, cb) => {
		cb(null, "uploads");
	},
	// Set the filename to the original name of the uploaded file
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

// Create a new multer instance using the disk storage engine we just created
const upload = multer({ storage });

app.use(express.json());
app.use(userRouter);
app.use(postRoutes);
app.post("/uploads", upload.single(""), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

const start = async () => {
	try {
		await connectToDB(connection_string);
		console.log(connection_string);
		app.listen(port, () => {
			console.log(`server is listening to port ${port}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
