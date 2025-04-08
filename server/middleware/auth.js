// middleware/auth.js
const jwt = require("jsonwebtoken");

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

    // Verify the token
    const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");

    // Add user info to request
    request.user = decodedToken;

    // Continue to the endpoint
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    response.status(401).json({
      error: "Authentication failed",
      message: "Please login again",
    });
  }
};
