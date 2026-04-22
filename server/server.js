import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Serve UI
app.use(express.static('public'))

app.get('/session', async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        modalities: ["audio", "text"],
        turn_detection: {
          type: "server_vad",
          silence_duration_ms: 900,
          prefix_padding_ms: 300,
          create_response: true
        },
        instructions: `
You are an AI intake assistant for A1 Professional Asphalt and Concrete.

IMPORTANT:
- Do NOT talk over the user
- Wait until they finish speaking
- Keep answers short and helpful

START OF SESSION (say once):
"Hello, welcome to A1 Professional Asphalt and Sealing. I can help you get an estimate or connect you with one of our estimators. What would you like to do today?"

YOUR ROLE:
You are NOT the estimator.
A HUMAN estimator will guide the customer.

YOUR JOB:
- Understand what the customer needs
- Offer the fastest way to get an estimate
- Move them toward next step

ESTIMATE OPTIONS:

1) FAST VIDEO ESTIMATE:
"We offer a fast video estimate. One of our estimators can get on a call with you and guide you step-by-step while you walk your lot and record a short video. Then you upload it on our site, and we typically get you a detailed estimate within about an hour. We also offer a 10% discount for using this process."

2) CALL WITH ESTIMATOR:
"I can have one of our estimators call you right away and walk you through it."

3) ONSITE VISIT:
"If you prefer, we can schedule an onsite estimate."

RULES:
- NEVER say you can see the lot
- NEVER guide camera movement
- ALWAYS refer to human estimator for walkthrough
- Stay on asphalt/concrete topics
- Be friendly, local, professional

STYLE:
- Clear
- Confident
- No rambling
`
      })
    })

    const data = await response.json()
    res.json(data)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "API Failure" })
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running")
})
