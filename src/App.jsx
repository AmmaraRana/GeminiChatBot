import React, { useState } from 'react';
import axios from 'axios';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const API_Key = "AIzaSyC4oQPUGKosweUIgn-W-4X50H_vNpOOi_8";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, How can I help you?",
      sender: "ChatGPT",
      direction: "outgoing"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "incoming"
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setTyping(true);

    try {
      await processMessageToAPI(newMessages);
    } catch (error) {
      console.error("Error fetching data from API:", error);
      alert("Error fetching data from the API. Please try again later.");
    }
  };

  async function processMessageToAPI(chatMessages) {
    const apiMessage = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      contents: [{ "parts": [{ "text": apiMessage.map(msg => msg.content).join(" ") }] }]
    };

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_Key}`,
        method: "POST",
        data: apiRequestBody
      });

      const answerText = response.data.candidates[0].content.parts[0].text;

      setMessages([...chatMessages, { message: answerText, sender: "ChatGPT", direction: "outgoing" }]);
      setTyping(false);
    } catch (error) {
      console.error("Error processing response from API:", error);
      alert(`Error processing response from API: ${error.message}`);
      setTyping(false);
    }
  }

 return (
    <div className="App">
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <MainContainer className="MainContainer">
          <ChatContainer className="ChatContainer">
            <MessageList className="MessageList" typingIndicator={typing ? <TypingIndicator content="Response is getting ready" /> : null}>
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput className="MessageInput" placeholder="Type Message Here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
