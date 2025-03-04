import React from "react";
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
      <section className=" d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>

        <div className="text-dark">
          <a href="https://naveedsportfolio.netlify.app" className="me-4 text-reset">
            <MDBIcon fa icon="globe" />
          </a>
          <a href="https://www.instagram.com/naveed.qadir/" className="me-4 text-reset">
            <MDBIcon fab icon="instagram" />
          </a>
          <a href="https://www.linkedin.com/in/naveedqadir/" className="me-4 text-reset">
            <MDBIcon fab icon="linkedin" />
          </a>
          <a href="https://github.com/naveedqadir" className="me-4 text-reset">
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section>

      <section className="text-dark">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                Random
              </h6>
              <p>
                "It is an online platform that facilitates the buying and
                selling of second-hand items. It provides a user-friendly
                interface for individuals to list their used goods and connect
                with potential buyers. Users can browse through various
                categories, including electronics, vehicles, furniture,
                clothing, and more."
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">About Us</h6>
              <p>
                <a href="#!" className="text-reset">
                  About Random Group
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
                Jaypee Kosmos, Noida
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                naveedqadir0@gmail.com
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
        © 2021 Copyright:
        <a className="fw-bold text-white" href="https://randomolx.vercel.app/">
          Random.com
        </a>
      </div>
    </MDBFooter>
  );
}
