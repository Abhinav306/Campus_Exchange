import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function GoogleSignIn() {
  const responseMessage = (response) => {
    // console.log(response);
    axios
      .post("http://localhost:5000/google-auth", {
        credential: response.credential,
      })
      .then((response) => {
        // Handle the response from the server
        //  console.log(response.data.token);
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("authemail", response.data.email);
        localStorage.setItem("authname", response.data.name);
        localStorage.setItem("authphone", response.data.phone);
        localStorage.setItem(
          "authpicture",
          response.data.picture ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        );
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <div>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
}
export default GoogleSignIn;
