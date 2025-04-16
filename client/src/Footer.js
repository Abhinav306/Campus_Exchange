import React from "react";
import ChatBot from "./ProductCards/ChatBot";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function Footer() {
  return (
    <MDBFooter
      className="text-center text-lg-start text-muted"
      style={{ backgroundColor: "rgba(235, 238, 239, 1)" }}
    >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>

        <div className="text-dark">
          <a
            href="https://naveedsportfolio.netlify.app"
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon icon="globe" />
          </a>
          <a
            href="https://www.instagram.com/abhinavsinghal791/"
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon className="fab fa-instagram" />
          </a>
          <a
            href="https://www.linkedin.com/in/abhinav791/"
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon className="fab fa-linkedin" />
          </a>
          <a
            href="https://github.com/Abhinav306"
            className="me-4 text-reset"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MDBIcon className="fab fa-github" />
          </a>
        </div>
      </section>

      <section className="text-dark">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                About
              </h6>
              <p>
                "Campus Exchange is a second-hand goods platform tailored for
                college students, connecting juniors with seniors to access
                affordable pre-used academic materials, gadgets, and resources.
                Designed with two interfaces, it empowers admins to list
                products for sale and users to browse, filter, and purchase
                items seamlessly. Key features include advanced search filters
                to quickly find desired products.
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">About Us</h6>
              <p>
                <a href="#!" className="text-reset">
                  About Campus Group
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Careers
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Contact Us
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  RandomPeople
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Waah Jobs
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Random</h6>
              <p>
                <a href="#!" className="text-reset">
                  Help
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Sitemap
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Legal &amp; Privacy information
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Blog
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Random Autos Sell Car
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Vulnerability Disclosure Program
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                KNIT , Sultanpur
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                abhinav.21604@knit.ac.in
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> + 91 6005871152
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div
        className="text-center text-white p-4"
        style={{ backgroundColor: "rgba(0, 47, 52, 1)" }}
      >
        © {new Date().getFullYear()} Copyright:{" "}
        <a
          className="fw-bold text-white"
          // href="https://randomolx.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Campus Exchange
        </a>
      </div>
      <ChatBot />
    </MDBFooter>
  );
}
