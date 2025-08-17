"use client";
import { TbMessageChatbot } from "react-icons/tb";
import { useState } from "react";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import TypingIndicator from "./TypingIndicator";

export const ChatBot = () => {
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMsg = { from: "user", text: newMessage };
    setMessages((prev: any) => [...prev, userMsg]);
    setNewMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newMessage }),
      });

      if (!res.ok) throw new Error("Failed to fetch AI response");
      const data = await res.json();
      console.log("AI response:", data.choices[0].message.content);

      const botMsg = {
        from: "bot",
        text: data.choices[0].message.content || "No answer generated",
      };

      setMessages((prev: any) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Error fetching AI response:", err);
      setMessages((prev: any) => [
        ...prev,
        { from: "bot", text: "Error fetching data. Please try again!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="fixed right-12 bottom-6 z-50">
        <TbMessageChatbot
          size={64}
          onClick={() => setShowChat(!showChat)}
          className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors duration-200 cursor-pointer shadow-lg hover:shadow-xl"
        />
      </div>

      {showChat && (
        <div className="fixed bottom-24 right-12 w-[500px] h-[600px] bg-gray-900 rounded-2xl shadow-2xl border border-indigo-500/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-indigo-500/20 bg-gray-800/80 rounded-t-2xl backdrop-blur-sm">
            <h2 className="font-bold text-xl text-white flex items-center gap-2">
              <TbMessageChatbot className="text-indigo-400" /> AI Travel Planner
            </h2>
            <p className="text-indigo-300 text-sm mt-1">
              Let's plan your next adventure!
            </p>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <span className="text-6xl animate-bounce">✈️</span>
                <p className="text-gray-400 text-center text-lg">
                  Start the conversation to plan your next trip!
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg: any, index: number) =>
                  msg.from === "user" ? (
                    <UserMessage key={index} newMessage={msg.text} />
                  ) : (
                    <BotMessage key={index} botMessage={msg.text} />
                  )
                )}
                {isTyping && <TypingIndicator />}
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-indigo-500/20 bg-gray-800/80 rounded-b-2xl backdrop-blur-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex flex-row space-x-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 py-2.5 px-4 bg-gray-700/90 text-white rounded-lg border border-indigo-500/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-gray-400 transition-all duration-200"
                placeholder="Type your destination..."
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="py-2.5 px-6 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
