import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.static('public'))

app.post('/session', async (req,res)=>{

  try{

    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method:"POST",
        headers:{
          "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({

          model:"gpt-4o-realtime-preview-2024-12-17",

          voice:"alloy",

          modalities:["audio","text"],

          turn_detection:{
            type:"server_vad",
            silence_duration_ms:900,
            prefix_padding_ms:300,
            create_response:true
          },

instructions:

`You are an AI team member for A1 Professional Asphalt and Sealing serving the St. Louis area.

IMPORTANT:
Wait until the user finishes speaking before responding.

START OF SESSION (say once):
"Hello, welcome to A1 Professional Asphalt and Sealing. I'm an AI team member here to answer your questions. How can I help you today?"

SCOPE:
- asphalt paving
- asphalt repairs
- crack sealing
- sealcoating
- parking lot striping
- asphalt maintenance
- parking lot maintenance
- driveway maintenance

RULES:
1 Keep responses short.
2 Do not give pricing.
3 If asked about price say exactly:

"For pricing or an estimate, one of our team members would be happy to help you. Please call (618) 929-3301."

4 Do not mention pricing unless asked.
5 Stay focused on asphalt and sealing services.
6 Friendly calm professional tone.`

        })
      })

    const data = await response.json()

    res.json(data)

  }catch(error){

    res.status(500).json({error:"API Failure"})
  }

})

app.listen(process.env.PORT || 3000)
