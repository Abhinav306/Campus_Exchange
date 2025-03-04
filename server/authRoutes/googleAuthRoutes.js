const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model here
const { OAuth2Client } = require('google-auth-library');

const app = express();

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

app.post("/google-auth", (req, res) => {
    const id_token = req.body.credential;
    // Verify the Google ID token
    client
      .verifyIdToken({
        idToken: id_token,
      })
      .then((ticket) => {
        const { email } = ticket.getPayload();
        const { name } = ticket.getPayload();
        const { email_verified } = ticket.getPayload();
        const { picture } = ticket.getPayload();
  
        // console.log(ticket);
  
        // Check if the email is already registered in your system
        User.findOne({ email })
          .then((user) => {
            if (user) {
              // If the user exists, generate a JWT token and return it to the client
              const token = jwt.sign(
                {
                  userId: user._id,
                  userEmail: user.email,
                },
                "RANDOM-TOKEN",
                { expiresIn: "24h" }
              );
  
              res
                .status(200)
                .json({
                  token,
                  email: user.email,
                  name: user.name,
                  picture: user.picture,
                  phone: user.phonenumber,
                });
            } else {
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
                    "RANDOM-TOKEN",
                    { expiresIn: "24h" }
                  );
                  res
                    .status(201)
                    .json({
                      token,
                      email: result.email,
                      name,
                      picture,
                      phone: result.phonenumber,
                    });
                })
                .catch((error) => {
                  res
                    .status(500)
                    .json({ message: "Error registering user", error });
                });
            }
          })
          .catch((error) => {
            res.status(500).json({ message: "Error finding user", error });
          });
      })
      .catch((error) => {
        res.status(400).json({ message: "Invalid Google ID token", error });
      });
  });
module.exports = app;
  