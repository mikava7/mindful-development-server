import jwt from "jsonwebtoken";

export default (req, res, next) => {
	// Extract token from Authorization header and remove "Bearer " string
	const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

	if (token) {
		try {
			// Verify token and decode its payload
			const decoded = jwt.verify(token, "secret365");

			if (decoded.exp < Date.now() / 1000) {
				return res.status(401).json({ message: "Token has expired" });
			}

			// Set userId property on request object to decoded user ID
			req.userId = decoded._id;

			// Call the next middleware in the stack
			next();
		} catch (error) {
			// Handle errors from verifying token
			return res.status(400).json({ message: "Invalid token" });
		}
	} else {
		// Exclude the /register route from requiring a token
		if (req.path === "/register" || req.path === "/login") {
			return next();
		} else {
			// Handle case where no token is provided for all other routes
			return res.status(403).json({ message: "Access denied. No token provided" });
		}
	}
};
