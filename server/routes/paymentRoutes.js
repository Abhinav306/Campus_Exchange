// paymentRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment"); // Create this model file
const Product = require("../models/Product");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get Razorpay Key
router.get("/getkey", auth, (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

// Create Order
router.post("/checkout", auth, async (req, res) => {
  try {
    const { amount, productId } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const options = {
      amount: Number(amount), // amount should already be in paise from frontend
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    await Payment.create({
      razorpay_order_id: order.id,
      productId: productId,
      buyerEmail: req.user.userEmail,
      amount: amount / 100, // Store amount in rupees
      status: "pending",
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Payment Verification
router.post("/paymentverification", auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        {
          razorpay_payment_id,
          razorpay_signature,
          status: "completed",
        }
      );

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        { status: "failed" }
      );

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
