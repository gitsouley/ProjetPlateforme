import React, { useState } from "react";
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Bonjour ! Comment puis-je vous aider ?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
  
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
  
    try {
      const response = await fetch("http://localhost:5001/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
  
      const data = await response.json();
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response || "Pas de réponse.", sender: "bot" },
      ]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Erreur de connexion au serveur.", sender: "bot" },
      ]);
    }
  };
  

  return (
    <div className="relative w-full mt-6">
      {isOpen ? (
        <div className="bg-white shadow-lg rounded-lg w-full p-4 border border-gray-200">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h3 className="text-lg font-semibold">Chatbot</h3>
            <XMarkIcon className="h-6 w-6 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => setIsOpen(false)} />
          </div>
          <div className="h-60 overflow-y-auto space-y-2 p-2 border rounded-md">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-md text-white ${msg.sender === "user" ? "bg-blue-500 self-end text-right" : "bg-gray-400"}`}>
                {msg.text}
              </div>
            ))}
            {loading && <p className="text-gray-500">Réflexion en cours...</p>}
          </div>
          <div className="flex mt-2 border-t pt-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              placeholder="Écrivez un message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={loading}
            />
            <button className="ml-2 p-2 bg-blue-500 text-white rounded-md" onClick={handleSendMessage} disabled={loading}>
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <button className="bg-blue-600 text-white p-3 rounded-md shadow-lg w-full" onClick={() => setIsOpen(true)}>
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          <span className="ml-2">Ouvrir le Chat</span>
        </button>
      )}
    </div>
  );
}

export default Chatbot;
