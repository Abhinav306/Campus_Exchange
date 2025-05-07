import { Box } from "@chakra-ui/react";
import axios from "axios";
import { MDBCard, MDBCardBody, MDBCardHeader, MDBIcon } from "mdb-react-ui-kit";
import React, { useEffect, useRef, useState } from "react";
import Loading from "../resources/Loading";

export default function FetchChat({ id, toData, to }) {
  const authPicture = localStorage.getItem("authpicture");
  const authName = localStorage.getItem("authname");
  const authemail = localStorage.getItem("authemail");
  const authToken = localStorage.getItem("authToken");
  const [newMessages, setNewMessages] = useState([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const messageContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (id) {
      const fetchNewMessages = async () => {
        const currentMessageLength = newMessages.length;
        try {
          const response = await axios.get(
            "https://campus-backend-sdry.onrender.com/api/new-messages",
            {
              params: { id, to }, // Pass data as query parameters
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          const data = response.data; // Use response.data, no need for await
          setNewMessages(data);
          setIsLoading(false);

          if (currentMessageLength !== data.length) {
            setHasNewMessages(true);
          } else {
            setHasNewMessages(false);
          }
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      };

      // Fetch new messages every 5 seconds (adjust the interval as needed)
      const intervalId = setInterval(fetchNewMessages, 1000);

      return () => {
        clearInterval(intervalId); // Clear the interval when the component unmounts
      };
    }
  }, [id, authToken, newMessages]);

  useEffect(() => {
    if (hasNewMessages) {
      scrollToBottom();
      setHasNewMessages(false);
    }
  }, [hasNewMessages]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box
      className="message-container"
      maxH="400px" // Adjust the maximum height as needed
      overflowY="auto"
      ref={messageContainerRef}
    >
      {newMessages.map((message, index) => (
        <div key={index}>
          {message.from === authemail ? (
            <li className="d-flex justify-content-between mb-4">
              <MDBCard className="w-100">
                <MDBCardHeader className="d-flex justify-content-between p-3">
                  <p className="fw-bold mb-0">{authName}</p>
                  <p className="text-muted small mb-0">
                    <MDBIcon far icon="clock" /> {formatTime(message.createdAt)}
                  </p>
                </MDBCardHeader>
                <MDBCardBody>
                  <p className="mb-0">{message.message}</p>
                </MDBCardBody>
              </MDBCard>
              <img
                src={authPicture}
                alt="avatar"
                className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                width="60"
              />
            </li>
          ) : (
            <li className="d-flex justify-content-between mb-4">
              <img
                src={toData.picture}
                alt="avatar"
                className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                width="60"
              />
              <MDBCard className="w-100">
                <MDBCardHeader className="d-flex justify-content-between p-3">
                  <p className="fw-bold mb-0">{toData.name}</p>
                  <p className="text-muted small mb-0">
                    <MDBIcon far icon="clock" /> {formatTime(message.createdAt)}
                  </p>
                </MDBCardHeader>
                <MDBCardBody>
                  <p className="mb-0">{message.message}</p>
                </MDBCardBody>
              </MDBCard>
            </li>
          )}
        </div>
      ))}
    </Box>
  );
}
