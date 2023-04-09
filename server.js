import express from "express";
import connectToDB from "./connect.js";
import userRouter from "./routes/userRoute.js";
import postRoutes from "./routes/postRoutes.js";
// load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();
const connection_string = process.env.MONGODB_URI;
const app = express();
const port = 5000; // Use PORT value from .env file or fallback to 4000

app.use(express.json());
app.use(userRouter);
app.use(postRoutes);

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
