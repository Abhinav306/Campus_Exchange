const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();

// Get JWT secret from environment variables - this must match in all files
const JWT_SECRET = process.env.JWT_SECRET || "RANDOM-TOKEN";
const JWT_EXPIRES_IN = "24h";

// Configure Google OAuth client with environment variables
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

router.post("/google-auth", (req, res) => {
  const id_token = req.body.credential;

  // Check if Google credentials are configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn(
      "Missing Google OAuth environment variables - OAuth may not work correctly"
    );
  }

  // Verify the Google ID token
  client
    .verifyIdToken({
      idToken: id_token,
    })
    .then((ticket) => {
      const payload = ticket.getPayload();
      const { email, name, email_verified, picture } = payload;

      // Check if the email is already registered
      User.findOne({ email })
        .then((user) => {
          if (user) {
            // User exists, generate JWT token
            const token = jwt.sign(
              {
                userId: user._id,
                userEmail: user.email,
              },
              JWT_SECRET,
              { expiresIn: JWT_EXPIRES_IN }
            );

            console.log(
              `Token created for ${email} with expiration: ${new Date(
                Date.now() + 24 * 60 * 60 * 1000
              )}`
            );
            console.log(
              "JWT Secret used (first 3 chars):",
              JWT_SECRET.substring(0, 3) + "..."
            );

            res.status(200).json({
              token,
              email: user.email,
              name: user.name,
              picture: user.picture,
              phone: user.phonenumber,
            });
          } else {
            // Create new user
            const newUser = new User({
              email: email,
              name: name,
              isEmailVerified: email_verified,
              picture: picture,
            });

            newUser
              .save()
              .then((result) => {
                const token = jwt.sign(
                  {
                    userId: result._id,
                    userEmail: result.email,
                  },
                  JWT_SECRET,
                  { expiresIn: JWT_EXPIRES_IN }
                );

                console.log(
                  `Token created for new user ${email} with expiration: ${new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                  )}`
                );
                console.log(
                  "JWT Secret used (first 3 chars):",
                  JWT_SECRET.substring(0, 3) + "..."
                );

                res.status(201).json({
                  token,
                  email: result.email,
                  name,
                  picture,
                  phone: result.phonenumber,
                });
              })
              .catch((error) => {
                console.error("Error saving new user:", error);
                res
                  .status(500)
                  .json({ message: "Error registering user", error });
              });
          }
        })
        .catch((error) => {
          console.error("Error finding user:", error);
          res.status(500).json({ message: "Error finding user", error });
        });
    })
    .catch((error) => {
      console.error("Invalid Google ID token:", error);
      res.status(400).json({ message: "Invalid Google ID token", error });
    });
});

module.exports = router;
