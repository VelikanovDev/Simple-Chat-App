import React, { useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import ChatPage from "./ChatPage";

const UsernamePage = () => {
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (username.trim() !== "") {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return <ChatPage username={username} />;
  }
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center
          rounded border border-light-subtle bg-light shadow-lg p-5"
    >
      <h1 className="text-primary">Type your username to enter the Chatroom</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="w-100"
      >
        <FormGroup className="mb-3 d-flex flex-row">
          <Form.Control
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon2"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            type="submit"
            variant="primary"
            id="button-addon2"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </FormGroup>
      </Form>
    </div>
  );
};

export default UsernamePage;
