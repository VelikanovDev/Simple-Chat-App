import React from "react";

const ChatNotification = ({ msg }) => {
  return (
    <div className="text-center">
      <strong className="text-secondary">
        {msg.sender} {msg.type === "JOIN" ? "joined the chat" : "left the chat"}
      </strong>
    </div>
  );
};

export default ChatNotification;
