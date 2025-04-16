const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/chat-recommendation", async (req, res) => {
  const { message } = req.body;

  const apiKey = process.env.OPENROUTER_API_KEY;

  console.log("🔐 API KEY Loaded:", apiKey ? "YES" : "NO");

  if (!apiKey || !apiKey.startsWith("sk-")) {
    console.log("❌ Missing or invalid API key");
    return res.status(500).json({
      error: "OpenRouter API key not configured properly.",
    });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant recommending products to users.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("❌ AI Recommendation Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get AI recommendation" });
  }
});

module.exports = router;
