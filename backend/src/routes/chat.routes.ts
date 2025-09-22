import express, { Request, Response } from "express";
import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "User prompt is required" });
    }
    
    const now = new Date();
    const localDate = now.toLocaleDateString("en-CA");
    const localTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an Event Management Assistant.  
          Today's local date is ${localDate} and the current local time is ${localTime}.  
          When the user asks you to plan or create an event, extract the following details and respond ONLY in valid JSON format:

          {
            "title": "Event title (short, based on context)",
            "description": "Brief description of the event",
            "date": "YYYY-MM-DD format",
            "time": "HH:MM format (24-hour)"
          }

          Rules:  
          - Always return the JSON object only, without extra text.  
          - If any detail is missing, leave it as an empty string "".  
          - Make sure the JSON matches exactly the above keys.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.6,
      max_tokens: 1024,
      top_p: 0.95,
      stream: false,
      response_format: { type: "json_object" }
    });

    const eventData = chatCompletion.choices[0].message?.content;
    res.json(JSON.parse(eventData || "{}"));
  } catch (error: any) {
    console.error("Error in the route:", error);
    res.status(500).json({ error: "Failed to generate event" });
  }
});

export default router;
