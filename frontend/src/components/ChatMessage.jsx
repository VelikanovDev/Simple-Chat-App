import React from "react";

const ChatMessage = ({ msg }) => {
  return (
    <div>
      <span className="message-initial rounded-circle bg-primary mb-1">
        {msg.sender[0]}
      </span>
      <strong className="text-primary">{msg.sender}: </strong>
      {msg.content}
    </div>
  );
};

export default ChatMessage;
