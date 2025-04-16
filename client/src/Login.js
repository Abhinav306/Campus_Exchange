import React, { useState } from "react";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { Alert, Badge } from "react-bootstrap";
import axios from "axios";
import GoogleSignIn from "./GoogleSignIn";
import { useToast } from "@chakra-ui/react";

function Login() {
  const [err, setErr] = useState();
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [registered, setRegistered] = useState(false);
  const toast = useToast();

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  const register = async (event) => {
    event.preventDefault();
    const email = event.target.reemail.value;
    const password = event.target.repassword.value;
    const rpassword = event.target.rpassword.value;
    const name = event.target.name.value;

    if (password !== rpassword) {
      document.getElementById("alert").textContent = "Passwords Don't Match";
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        email,
        password,
        name,
      });
      console.log(response.data);
      setRegistered(true);
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      setErr(error.response?.status);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log(response.data);
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
    } catch (error) {
      console.log(error.response?.status);
      setErr(error.response?.status);
    }
  };

  return (
    <MDBContainer className="p-3 mt-1 mb-1 my-5 d-flex flex-column">
      <MDBTabs
        pills
        justify
        className="mb-3 d-flex flex-row justify-content-between"
      >
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab1")}
            active={justifyActive === "tab1"}
          >
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab2")}
            active={justifyActive === "tab2"}
          >
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={justifyActive === "tab1"}>
          <div className="text-center mb-3">
            <p>Sign in with:</p>
            <div>
              <GoogleSignIn />
            </div>
            <p className="text-center mt-3">or:</p>
          </div>

          <form onSubmit={login}>
            <div className="mb-4">
              <MDBInput label="Your Email" id="email" type="email" required />
            </div>
            <div className="mb-4">
              <MDBInput
                label="Password"
                id="password"
                type="password"
                required
              />
            </div>
            <div className="d-flex justify-content-between mx-4 mb-4">
              <MDBCheckbox
                name="flexCheck"
                id="loginCheckbox"
                label="Remember me"
              />
              <a href="#!" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
            <MDBBtn className="mb-4 w-100" type="submit">
              Sign in
            </MDBBtn>
          </form>

          {err === 404 && <Alert variant="danger">Incorrect Email</Alert>}
          {err === 400 && <Alert variant="danger">Incorrect Password</Alert>}

          <p className="text-center">
            Not a member?{" "}
            <button
              className="btn btn-link p-0"
              onClick={() => handleJustifyClick("tab2")}
              style={{ textDecoration: "none" }}
            >
              Register
            </button>
          </p>
        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === "tab2"}>
          <div className="text-center mb-3">
            <p>Sign up with:</p>
            <div>
              <GoogleSignIn />
            </div>
            <p className="text-center mt-3">or:</p>
          </div>

          {!registered && (
            <form onSubmit={register}>
              <MDBInput
                wrapperClass="mb-4"
                label="Name"
                id="name"
                type="text"
                required
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Email"
                id="reemail"
                type="email"
                required
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="repassword"
                type="password"
                required
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Repeat your password"
                id="rpassword"
                type="password"
                required
              />

              <Badge id="alert" className="mb-1" bg="danger"></Badge>

              <div className="d-flex justify-content-center mb-4">
                <MDBCheckbox
                  name="flexCheck"
                  id="registerCheckbox"
                  label="I have read and agree to the terms"
                  required
                />
              </div>

              {err === 409 && (
                <Alert variant="danger">
                  User Already Exists, Please Login
                </Alert>
              )}
              <MDBBtn className="mb-4 w-100" type="submit">
                Sign up
              </MDBBtn>
            </form>
          )}

          {registered && (
            <Alert variant="success">Registered successfully</Alert>
          )}
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}

export default Login;
