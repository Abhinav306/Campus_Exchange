const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Test server working!");
});

app.listen(5000, () => {
  console.log("Test server running on port 5000");
});
