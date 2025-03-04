const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    ref: "User",
  },
  to: {
    type: String,
    required: true,
    ref: "User",
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // This references the 'Product' model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});
const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
