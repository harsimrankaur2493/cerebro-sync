import React, { useState } from 'react';
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Display user input in the chat
    setMessages([...messages, { role: 'user', text: userInput }]);

    try {
      // Make API request to the chatbot backend
      const response = await fetch('http://localhost:8800/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      setMessages([
        ...messages,
        { role: 'user', text: userInput },
        { role: 'bot', text: data.response },
      ]);
      setUserInput('');
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
    }
  };

  // Predefined bot messages with better formatting
  const predefinedBotReplies = [
    "Hey there! 👋 It's great to hear from you! What can I help you with today?",
    "\nHere are some options to get started:",
    "\n1. Get organized with a to-do list 📋",
    "2. Sharpen your focus with the Pomodoro Technique ⏲️",
    "3. Track your progress towards your goals 📈",
    "\nLet me know, and I'll guide you through the features! 😊"
  ];

  const isPredefinedBotMessage = (messageText) => {
    return predefinedBotReplies.includes(messageText);
  };

  return (
    <div className="chatbot">
      <div className="chat-history">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.text} {/* Display text as plain text */}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage} disabled={!userInput.trim()}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;
