import express from "express";
import dotenv from "dotenv";
import connectToDB from "./connect.js";
import userRouter from "./routes/userRoute.js";
dotenv.config();
const app = express();
const port = 5000; // Use PORT value from .env file or fallback to 4000

app.use(express.json());
app.use(userRouter);

const start = async () => {
	try {
		await connectToDB(process.env.MONGODB_URI);
		console.log(process.env.MONGODB_URI);
		app.listen(port, () => {
			console.log(`server is listening to port ${port}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
