import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { MDBBtn, MDBTextArea } from "mdb-react-ui-kit";
import React, { useState } from "react";
import { Form } from "react-bootstrap";

export default function SendChat({ id, to }) {
  const [message, setMessage] = useState("");
  const authToken = localStorage.getItem("authToken");
  const toast = useToast();
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message) {
      const response = await axios.post(
        "https://campus-backend-sdry.onrender.com/sendMessage",
        { message, id, to },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage("");
      }
      if (response.status === 201) {
        setMessage("You cannot send Message");
        toast({
          title: "You cannot send Message",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <Form onSubmit={sendMessage}>
      <li className="bg-white mb-3">
        <MDBTextArea
          label="Message"
          value={message}
          onChange={handleMessageChange}
          id="textArea"
          rows={4}
        />
      </li>
      {message.length > 0 && (
        <MDBBtn type="submit" color="info" rounded className="float-end">
          Send
        </MDBBtn>
      )}
    </Form>
  );
}
