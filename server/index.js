import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/index.js";
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the required package


dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();

// Set up CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Google AI Integration (for chatbot)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are Cerebro Sync. Avoid providing detailed information about companies or brands. Guide users through the website's features in a clear, supportive, and professional tone.",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Chat history to maintain conversation context
let chatHistory = [
  {
    role: "user",
    parts: [{ text: "Hii" }],
  },
  {
    role: "model",
    parts: [
      {
        text: "Hey there! 👋 Welcome! It looks like you're ready to take control of your time and get things done.  \n\nI'm Cerebro Sync, your friendly AI guide for productivity and habit building. What are you hoping to achieve today?  \n\nAre you interested in:\n\n* **Organizing your to-do list?** \n* **Boosting focus with the Pomodoro Timer?** \n* **Tracking your progress with a habit tracker?** \n\nLet me know, and I'll show you how to get started! 💪 \n",
      },
    ],
  },
];

// Function to process user messages
async function runChat(userInput) {
  const chat = model.startChat({
    generationConfig,
    history: chatHistory,
  });

  chatHistory.push({
    role: "user",
    parts: [{ text: userInput }],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response.text();

  chatHistory.push({
    role: "model",
    parts: [{ text: response }],
  });

  return response;
}

// API Routes
app.use("/api", routes);

// New chatbot route
app.post("/chat", async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('Incoming chat message:', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Sorry, something went wrong. Please try again later.' });
  }
});

// Fallback routes for handling errors
app.use(routeNotFound);
app.use(errorHandler);


// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
