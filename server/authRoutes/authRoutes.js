const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const auth = require("../middleware/auth");

// Get JWT secret from environment variables - this must match in all files
const JWT_SECRET = process.env.JWT_SECRET || "RANDOM-TOKEN";
const JWT_EXPIRES_IN = "24h";

router.get("/api/check-status", (req, res) => {
  res.json({ status: "online" });
});

router.get("/auth-endpoint", auth, (request, response) => {
  response.json({ isAuthenticated: true });
});

router.post("/register", (request, response) => {
  // Check if user exists first
  User.findOne({ email: request.body.email })
    .then((foundUser) => {
      if (foundUser) {
        return response.status(409).json({
          message: "User already exists",
        });
      }

      // Hash the password
      bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
          // Create a new user
          const newUser = new User({
            email: request.body.email,
            name: request.body.name,
            password: hashedPassword,
          });

          // Save the new user
          newUser
            .save()
            .then((result) => {
              response.status(201).send({
                message: "User Created Successfully",
                result,
              });
            })
            .catch((error) => {
              console.error("Error saving user:", error);
              response.status(500).send({
                message: "Error creating user",
                error,
              });
            });
        })
        .catch((e) => {
          console.error("Password hashing error:", e);
          response.status(500).send({
            message: "Password was not hashed successfully",
            e,
          });
        });
    })
    .catch((error) => {
      console.error("User lookup error:", error);
      response.status(500).send({
        message: "Error creating user",
        error,
      });
    });
});

// Login endpoint
router.post("/login", (request, response) => {
  // Check if email exists
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          message: "Email not found",
        });
      }

      // Compare the password
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          // Check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords do not match",
            });
          }

          // Create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
          );

          console.log(
            `Token created for ${user.email} with expiration: ${new Date(
              Date.now() + 24 * 60 * 60 * 1000
            )}`
          );
          console.log(
            "JWT Secret used (first 3 chars):",
            JWT_SECRET.substring(0, 3) + "..."
          );

          // Return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
            name: user.name,
            picture: user.picture,
            phone: user.phonenumber,
          });
        })
        .catch((error) => {
          console.error("Password comparison error:", error);
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    .catch((e) => {
      console.error("User lookup error:", e);
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

module.exports = router;
