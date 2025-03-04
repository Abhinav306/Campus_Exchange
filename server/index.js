const express = require("express");
const mongoose = require("mongoose");

const Product = require('./models/Product');

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const auth = require("./middleware/auth");
require('dotenv').config();

const authRoutes = require('./authRoutes/authRoutes');
const googleAuthRoutes = require('./authRoutes/googleAuthRoutes');
const chatRoutes = require('./chatRoutes/chatRoutes');
const profileRoutes = require('./profileRoutes/profileRoutes');


const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Connection failed!");
    console.log(error);
  });

app.use('/', authRoutes); 
app.use('/', googleAuthRoutes);
app.use('/', profileRoutes);
app.use('/', chatRoutes);


app.post("/add_product", auth, async (req, res) => {
  try {
    // Create a new Product document
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

    // Save the uploaded files in pic1 to pic12 fields
    for (let i = 0; i < req.body.uploadedFiles.length && i < 12; i++) {
      const fieldName = `productpic${i + 1}`;
      product[fieldName] = req.body.uploadedFiles[i];
    }
    // Save the product document
    await product.save();

    console.log("The product has been saved successfully.");
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
    }
    else{
    // delete the ownerpicture from Cloudinary if it exists
    if (product.ownerpicture) {
      const publicId = product.ownerpicture.match(/\/v\d+\/(\S+)\.\w+/)[1];
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(result);
    }

    // delete the product pictures from Cloudinary if they exist
    for (let i = 1; i <= 12; i++) {
      const productPic = `productpic${i}`;
      if (product[productPic]) {
        const publicId = product[productPic].match(/\/v\d+\/(\S+)\.\w+/)[1];
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(result);
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
    }
    else{
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
    }else{
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


app.listen(5000, () => {
  console.log("Server started on port 5000!");
});
