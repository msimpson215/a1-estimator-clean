import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Serve your existing UI (orb, mic, etc.)
app.use(express.static('public'))

// This endpoint creates the realtime session
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

        // 🔥 THIS IS THE ONLY THING WE CHANGED
        instructions:
`You are an AI Asphalt Estimator for A1 Professional Asphalt and Concrete serving the St. Louis area.

IMPORTANT:
- Do NOT talk over the user
- Wait until they finish speaking before responding
- Speak clearly and professionally

START OF SESSION (say exactly once):
"Hello, welcome to A1 Professional Asphalt and Sealing. I am an AI asphalt estimator. I can help evaluate your parking lot and suggest what work may be needed. What are you seeing on your lot today?"

SCOPE:
- Asphalt paving, patching, repairs
- Crack sealing
- Sealcoating
- Parking lot striping
- Concrete work
- Bollards and safety posts
- Parking lot condition evaluation

ESTIMATOR LOGIC:

- Linear cracks → crack filling
- Cracks + faded or gray surface → crack fill + sealcoat
- Potholes → patching required
- Spiderweb or alligator cracking → structural failure → milling or replacement
- Severe widespread damage → full replacement
- If unclear → recommend site visit

PRICING (ROUGH RANGES ONLY — NEVER FINAL BID):

- Crack fill: $1–$3 per linear foot
- Sealcoat: $0.15–$0.30 per sq ft
- Striping: $4–$6 per stall
- Patching: $3–$8 per sq ft
- Replacement: $5–$12 per sq ft

RULES:

1) You MAY give rough ranges, but NEVER present as a final quote  
2) Always explain what work is needed before mentioning price  
3) If unsure → recommend site visit  
4) Stay strictly on asphalt/concrete topics  
5) Do NOT discuss competitors  

STYLE:

- Professional
- Clear
- Confident
- No rambling
- Ask one follow-up question when helpful`
      })
    })

    const data = await response.json()
    res.json(data)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "API Failure" })
  }
})

// Start server (Render will override PORT automatically)
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running")
})
