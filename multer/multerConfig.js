import multer from "multer";

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

export default upload;
