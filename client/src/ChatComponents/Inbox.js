import axios from "axios";
import { MDBCard, MDBCardBody, MDBTypography } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import Loading from "../resources/Loading";
import { Heading } from "@chakra-ui/react";

export default function Inbox() {
  const [newChats, setNewChats] = useState([]);
  const authToken = localStorage.getItem("authToken");
  const authemail = localStorage.getItem("authemail");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewChats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/newchats", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = response.data; // Use response.data, no need for await
        setNewChats(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch new messages every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchNewChats, 1000);

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [authToken, newChats]);

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

  if (isLoading) {
    return <Loading />;
  }

  if (newChats.length === 0) {
    return <Heading>No Chats Yet</Heading>;
  }

  return (
    <>
      <h5 className="font-weight-bold mb-3 text-center text-lg-start">Inbox</h5>
      {newChats.map((chat, index) => (
        <MDBCard key={index}>
          <MDBCardBody>
            <MDBTypography listUnStyled className="mb-0">
              <li
                className="p-2 border-bottom"
                style={{ backgroundColor: "#eee" }}
              >
                <a
                  href={
                    chat.to === authemail
                      ? `/chat/${chat.product_id}/${chat.from}`
                      : `/chat/${chat.product_id}/${chat.to}`
                  }
                  className="d-flex justify-content-between"
                >
                  <div className="d-flex flex-row">
                    <img
                      src={chat.user.picture}
                      alt="avatar"
                      className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                      width="60"
                    />
                    <div className="pt-1">
                      <p className="fw-bold mb-0">{chat.user.name}</p>
                      <p className="small text-muted">
                        {chat.message.length > 8
                          ? chat.message.substring(0, 8) + "..."
                          : chat.message}
                      </p>
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="small text-muted mb-1">
                      {formatTime(chat.createdAt)}
                    </p>
                    {/* <span className="badge bg-danger float-end"> New</span> */}
                  </div>
                </a>
              </li>
            </MDBTypography>
          </MDBCardBody>
        </MDBCard>
      ))}
    </>
  );
}
