import React from "react";
import ChatMessage from "./ChatMessage";
import ChatNotification from "./ChatNotification";

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-container border border-black rounded p-2 mt-2 mb-2">
      <div className="messages-container">
        {messages.map((msg, index) =>
          msg.type === "CHAT" ? (
            <ChatMessage key={index} msg={msg} />
          ) : (
            <ChatNotification key={index} msg={msg} />
          ),
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
