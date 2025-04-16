const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Import models and routes
const Product = require("./models/Product");
const auth = require("./middleware/auth");
const authRoutes = require("./authRoutes/authRoutes");
const googleAuthRoutes = require("./authRoutes/googleAuthRoutes");
const chatRoutes = require("./chatRoutes/chatRoutes");
const profileRoutes = require("./profileRoutes/profileRoutes");
const recommendationRoutes = require("./recommendationRoutes/recommendationRoutes");

// Cloudinary configuration
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database!"))
  .catch((error) => console.log("Connection failed!", error));

// Payment Schema
const paymentSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  buyerEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Authentication middleware (example)
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication token required" });
  }
  try {
    // Add your token verification logic here
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Routes
app.use("/", authRoutes);
app.use("/", googleAuthRoutes);
app.use("/", profileRoutes);
app.use("/", chatRoutes);
app.use("/", recommendationRoutes);

// Payment Routes
app.get("/api/getkey", authenticateUser, (req, res) => {
  try {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("Error getting key:", error);
    res.status(500).json({ error: "Failed to get key" });
  }
});

app.post("/api/checkout", authenticateUser, async (req, res) => {
  try {
    const { amount, productId } = req.body;
    if (!amount || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "Amount and productId are required" });
    }
    const amountInPaise = Math.round(Number(amount));
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    await Payment.create({
      razorpay_order_id: order.id,
      productId: productId,
      buyerEmail: req.user?.email || "unknown",
      amount: amountInPaise / 100,
      status: "pending",
    });
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
});

app.post("/api/paymentverification", authenticateUser, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        { razorpay_payment_id, razorpay_signature, status: "completed" }
      );
      res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      await Payment.findOneAndUpdate(
        { razorpay_order_id },
        { status: "failed" }
      );
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
});

// Existing Product Routes
app.post("/add_product", auth, async (req, res) => {
  try {
    const product = new Product({
      useremail: req.user.userEmail,
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      price: req.body.price,
      owner: req.body.name,
      ownerpicture: req.body.image,
      catagory: req.body.catagory,
      subcatagory: req.body.subcatagory,
    });
    for (let i = 0; i < req.body.uploadedFiles.length && i < 12; i++) {
      const fieldName = `productpic${i + 1}`;
      product[fieldName] = req.body.uploadedFiles[i];
    }
    await product.save();
    res.status(200).send("The product has been saved successfully.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to save the product.");
  }
});

app.get("/myads_view", auth, async (req, res) => {
  try {
    const useremail = req.user.userEmail;
    const products = await Product.find({ useremail });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.delete("/myads_delete/:id", auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      useremail: req.user.userEmail,
    });
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    } else {
      if (product.ownerpicture) {
        const publicId = product.ownerpicture.match(/\/v\d+\/(\S+)\.\w+/)[1];
        await cloudinary.uploader.destroy(publicId);
      }
      for (let i = 1; i <= 12; i++) {
        const productPic = `productpic${i}`;
        if (product[productPic]) {
          const publicId = product[productPic].match(/\/v\d+\/(\S+)\.\w+/)[1];
          await cloudinary.uploader.destroy(publicId);
        }
      }
      res.send(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server Error" });
  }
});

app.post("/previewad/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    } else {
      let own = false;
      if (product.useremail === req.user.userEmail) {
        own = true;
      }
      res.send({ product, own });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/previewad/notloggedin/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    } else {
      res.send({ product });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/getProducts", async (req, res) => {
  const products = await Product.find();
  res.status(200).send(products);
});

app.get("/getProductsbyCategory/:category", async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({
    $or: [{ catagory: category }, { subcatagory: category }],
  });
  res.status(200).send(products);
});

app.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const products = await Product.find({
      title: { $regex: q, $options: "i" },
    });
    res.status(200).send(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getProductsbyemail", async (req, res) => {
  const { useremail } = req.query;
  const products = await Product.find({ useremail: useremail });
  res.status(200).send(products);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
  console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
});
