import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// A more refined function to check if the input is task-related
const isTaskRelated = (input) => {
  const taskKeywords = ['task', 'to-do', 'list', 'pomodoro', 'reminder', 'goal', 'schedule', 'productivity', 'habit', 'focus'];
  const taskPatterns = [
    /to\s?do\s?list/i,  // to do list
    /pomodoro/i,        // pomodoro timer
    /task\s?(management|planner)?/i, // task management
    /reminder/i,        // reminder
    /goal\s?(setting|tracker)?/i,   // goal tracking
    /habit\s?tracking/i, // habit tracking
    /focus/i             // focus-related
  ];

  // Check if the input contains task-related keywords or matches the task patterns
  return taskKeywords.some(keyword => input.toLowerCase().includes(keyword)) || taskPatterns.some(pattern => pattern.test(input));
};

// Format the response by removing markdown symbols like asterisks
const formatResponse = (responseText) => {
  let formattedText = responseText;

  // Replace markdown bold (**) with simple text
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "$1");

  // Replace markdown italic (*) with simple text
  formattedText = formattedText.replace(/\*(.*?)\*/g, "$1");

  return formattedText;
};

async function runChat(userInput) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You are Cerebro Sync. Avoid providing detailed info on companies, focus on productivity guidance.",
  });

  const chat = model.startChat({ generationConfig, history: chatHistory });

  chatHistory.push({ role: "user", parts: [{ text: userInput }] });
  const result = await chat.sendMessage(userInput);
  const response = result.response.text();

  chatHistory.push({ role: "model", parts: [{ text: response }] });

  // Format the response before sending it back
  const formattedResponse = formatResponse(response);
  return formattedResponse;
}

export const getChatResponse = async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    if (!userInput) return res.status(400).json({ error: "Invalid request body" });

    // Check if the user's input is task-related
    if (!isTaskRelated(userInput)) {
      return res.json({
        response:
          "I'm currently only able to assist with task management-related queries. Please ask about tasks, to-do lists, or Pomodoro technique.",
      });
    }

    // Proceed with AI-generated response if task-related
    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Something went wrong. Try again later." });
  }
};
