const express = require('express');
const auth = require("../middleware/auth");
const Message = require('../models/Message');
const User = require('../models/User');
const Product = require('../models/Product');
const app = express();

app.post("/sendMessage", auth, async (req, res) => {
  const id = req.body.id;
  const messageContent = req.body.message;
  const mailto = req.body.to;

  try {
    const product = await Product.findOne({ _id: id });
    const userto = await User.findOne({ email: mailto });

    if (!product || !userto) {
      return res.status(400).json({
        success: false,
        message: "Invalid product or recipient email",
      });
    }

    if (product.useremail === req.user.userEmail) {
      const message = await Message.findOne({ product_id: id, from: mailto });

      if (!message) {
        return res.status(201).json({
          success: false,
          message: "You can't send a message to this user for this product",
        });
      }
    }

    if (product.useremail !== mailto && product.useremail !== req.user.userEmail) {
      return res.status(201).json({
        success: false,
        message: "You can't send a message to this user for this product",
      });
    }

    const newMessage = new Message({
      from: req.user.userEmail,
      to: mailto,
      message: messageContent,
      product_id: id,
    });

    // Save the message document
    await newMessage.save();
    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, message: "Error sending message" });
  }
});


  
  app.get("/api/new-messages", auth, async (req, res) => {
    const id = req.query.id; // Use req.query to access query parameters
    const to = req.query.to; 
    const mailfrom = req.user.userEmail;
      try {
      const newMessages = await Message.find({
        $or: [
          { from: mailfrom, to:to, product_id: id },
          { to: mailfrom, from:to, product_id: id },
        ],
      });
      // console.log(newMessages)
      res.json(newMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  app.get("/api/newchats", auth, async (req, res) => {
    try {
      const mailfrom = req.user.userEmail;
  
      const newChats = await Message.aggregate([
        {
          $match: {
            $or: [{ from: mailfrom }, { to: mailfrom }],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: "$product_id",
            latestMessage: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$latestMessage" },
        },
      ]);
  
      const uniqueEmails = [...new Set(newChats.map(chat => chat.from === mailfrom ? chat.to : chat.from))];
      
      const users = await User.find({ email: { $in: uniqueEmails.map(email => email.toLowerCase()) } });
  
      const emailToUserMap = {};
      users.forEach(user => {
        emailToUserMap[user.email.toLowerCase()] = { name: user.name, picture: user.picture };
      });
  
      newChats.forEach(chat => {
        const otherUserEmail = chat.from === mailfrom ? chat.to : chat.from;
        chat.user = emailToUserMap[otherUserEmail.toLowerCase()];
      });
  
      newChats.sort((a, b) => b.createdAt - a.createdAt);
  
      res.json(newChats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  app.post("/deletechat/:id", auth, async (req, res) => {
    const id = req.params.id;
    const mailfrom = req.user.userEmail;
  
    try {
      const result = await Message.deleteMany({
        $or: [
          { from: mailfrom, product_id: id },
          { to: mailfrom, product_id: id },
        ],
      });
  
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Chat deleted" });
      } else {
        res.status(404).json({ message: "Chat not found" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = app;
