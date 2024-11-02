import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MyAvatar from "../assets/Logo.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const chatLogRef = useRef(null);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSend = async () => {
    if (prompt.trim()) {
      const userMessage = { sender: "user", text: prompt };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setPrompt("");

      try {
        const result = await axios.post(
          "YOUR_API_ENDPOINT",
          { prompt }
        );

        const responseBody = result.data.body
          ? JSON.parse(result.data.body)
          : result.data;
        const usefulText = responseBody.usefulText || "No useful text found.";

        const aiMessage = { sender: "gpt", text: usefulText };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
          sender: "gpt",
          text: "Error occurred while getting response.",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <section className="w-[55%] max-w-full flex flex-col bg-white border border-black shadow-md rounded-lg">
        <div
          className="flex-1 overflow-y-auto p-4 h-[60vh] max-h-[60vh]"
          ref={chatLogRef}
          style={{
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "#888 #f1f1f1", // For Firefox
            WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
          }}
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet.</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message mb-2 ${
                  msg.sender === "gpt" ? "text-left" : "text-right"
                }`}
              >
                <div
                  className={`chat-message-center flex items-center ${
                    msg.sender === "gpt" ? "justify-start" : "justify-end"
                  }`}
                >
                  {msg.sender === "gpt" && (
                    <div className="avatar mr-2">
                      <img
                        src={MyAvatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  )}
                  <div
                    className={`message p-2 border rounded-md ${
                      msg.sender === "gpt"
                        ? "bg-white border-black"
                        : "bg-black text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex p-4 border-t border-gray-300">
          <textarea
            rows="1"
            className="flex-1 p-2 border border-black rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-black"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Type your message here..."
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #f1f1f1",
              WebkitScrollbar: {
                width: "8px",
              },
              WebkitScrollbarTrack: {
                background: "#f1f1f1",
              },
              WebkitScrollbarThumb: {
                background: "#888",
                borderRadius: "10px",
              },
            }}
          />
          <button
            className="ml-2 bg-black text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 transition"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
};

export default Chatbot;