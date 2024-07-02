import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Alert, Button, Form, FormGroup } from "react-bootstrap";

const ChatPage = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const initializedRef = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initializedRef.current) {
      const client = new Client({
        brokerURL: "ws://localhost:8080/ws",
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          if (!initializedRef.current) {
            initializedRef.current = true;

            subscriptionRef.current = client.subscribe(
              "/topic/public",
              (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [
                  ...prevMessages,
                  receivedMessage,
                ]);
              },
            );

            client.publish({
              destination: "/app/chat.addUser",
              body: JSON.stringify({ sender: username, type: "JOIN" }),
            });

            stompClientRef.current = client;
          }
        },
        onStompError: (frame) => {
          console.error(`Broker reported error: ${frame.headers["message"]}`);
          console.error(`Additional details: ${frame.body}`);
        },
      });

      client.activate();

      return () => {
        if (initializedRef.current) {
          console.log("Cleaning up WebSocket connection");
          if (stompClientRef.current) {
            stompClientRef.current.deactivate();
          }
          if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
          }
          stompClientRef.current = null;
          subscriptionRef.current = null;
          initializedRef.current = false;
        }
      };
    }
  }, [username]);

  const sendMessage = () => {
    if (
      message.trim() &&
      stompClientRef.current &&
      stompClientRef.current.connected
    ) {
      const chatMessage = {
        sender: username,
        content: message,
        type: "CHAT",
      };

      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage),
      });
      setMessage("");
      setError("");
    } else if (message.trim() === "") {
      setError("Message cannot be empty");
    } else {
      console.error("STOMP client is not connected");
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center
          rounded border border-light-subtle bg-light shadow-lg p-5"
    >
      <h1 className="text-primary">Spring WebSocket Chat App</h1>
      <div className="w-100">
        {error && (
          <Alert
            severity="error"
            className="text-black bg-danger border border-danger rounded mt-1 mb-1 h-25"
          >
            {error}
          </Alert>
        )}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <FormGroup className="d-flex flex-row">
            <Form.Control
              placeholder="Type a message"
              aria-label="Message"
              aria-describedby="basic-addon2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              variant="primary"
              id="button-addon2"
              onClick={sendMessage}
            >
              Send
            </Button>
          </FormGroup>
        </Form>
        <div>
          {messages.map((msg, index) =>
            msg.type === "JOIN" ? (
              <div key={index}>
                <strong>{msg.sender} joined the chat</strong>
              </div>
            ) : (
              <div key={index}>
                <strong>{msg.sender}: </strong>
                {msg.content}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
