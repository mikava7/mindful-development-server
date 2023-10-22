import express from 'express'
import cors from 'cors'
import connectToDB from './connect.js'
import userRouter from './routes/userRoute.js'
import postRouter from './routes/postRoutes.js'
import tagsRouter from './routes/tagsRoutes.js'
import commentRouter from './routes/commentsRoute.js'
// load environment variables from .env file
import dotenv from 'dotenv'
dotenv.config()
import multer from 'multer'
import cookieParser from 'cookie-parser'

const connection_string = process.env.MONGODB_URI
const app = express()
const port = 5000
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',

    credentials: true,
  })
)
app.use(express.json())
app.use(userRouter)
app.use(postRouter)
app.use(tagsRouter)
app.use(commentRouter)

// Serve static files from the "uploads" directory

const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  // Set the filename to the original name of the uploaded file
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

// Create a new multer instance using the disk storage engine we just created
const upload = multer({ storage })

app.use('/uploads', express.static('uploads'))

// Define a route to handle POST requests to the "/uploads" endpoint
app.post('/uploads', upload.single('image'), (req, res) => {
  try {
    // Return a JSON response with the URL of the uploaded file
    res.json({
      url: `/uploads/${req.file.originalname}`,
    })
  } catch (error) {
    // If there is an error, send an error response to the client
    console.log(error)
    res.status(500).send('Internal server error')
  }
})

const start = async () => {
  try {
    // Connect to the MongoDB database
    await connectToDB(connection_string)
    // console.log(connection_string)

    // Start the server and listen for incoming requests
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    // If there is an error connecting to the database or starting the server,
    // log the error and return an error message to the client
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

start()
