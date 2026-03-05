import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.static('public'));

app.get('/session', async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        modalities: ["audio", "text"],
        instructions:
          "You are an AI team member for A1 Professional Asphalt and Concrete. " +
          "Start every session by saying exactly: \"Hello, I’m an AI team member for A1 Professional Asphalt and Concrete. How can I help you?\" " +
          "Then wait for the user to speak. Do not repeat the greeting."
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "API Failure" });
  }
});

app.listen(process.env.PORT || 3000);
