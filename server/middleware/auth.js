// middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Use the same JWT_SECRET as in other files
const JWT_SECRET = process.env.JWT_SECRET || "RANDOM-TOKEN";

module.exports = async (request, response, next) => {
  try {
    // Check if authorization header exists
    if (!request.headers.authorization) {
      return response.status(401).json({
        error: "No token provided",
        message: "Please login to continue",
      });
    }

    // Get the token from the authorization header
    const token = request.headers.authorization.split(" ")[1];

    if (!token) {
      return response.status(401).json({
        error: "Invalid token format",
        message: "Please login again",
      });
    }

    // Debug token information
    try {
      const decoded = jwt.decode(token);
      if (decoded) {
        console.log("Token payload:", decoded);
        console.log("Current server time:", new Date());
        console.log("Token expiration:", new Date(decoded.exp * 1000));
      }
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
    }

    // Verify the token with the same secret used to create it
    const decodedToken = await jwt.verify(token, JWT_SECRET);

    // Add user info to request
    request.user = decodedToken;

    // Continue to the endpoint
    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    // More specific error messages based on error type
    if (error.name === "TokenExpiredError") {
      return response.status(401).json({
        error: "Token expired",
        message: "Your session has expired. Please login again.",
        expiredAt: error.expiredAt,
      });
    } else if (error.name === "JsonWebTokenError") {
      return response.status(401).json({
        error: "Invalid token",
        message: "Authentication failed. Please login again.",
      });
    }

    // Generic error message for other cases
    response.status(401).json({
      error: "Authentication failed",
      message: "Please login again",
    });
  }
};
