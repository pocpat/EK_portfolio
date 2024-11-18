import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MailChimpForm } from "./MailChimpForm";
import logo from "../assets/img/Asset 1.png";
import Navbar from "react-bootstrap/Navbar";
import { ContactForm } from "./ContactForm";
import "../css/App.css";
import "../css/footer.css";
import ContactModal from "./contactModal/ContactModal"; // Corrected import

export const Footer = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [showContactModal, setShowContactModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const handleOpenContactModal = () => {
    setShowContactModal(true);
  };
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };
  useEffect(() => {
    const yearElement = document.querySelector("#currentYear");
    if (yearElement) {
      yearElement.innerHTML = new Date().getFullYear();
    }
  }, []);

  return (
    <footer className="footer">
      <div className="blob-left"></div>

      <Container>
        <Row className="f-row">
          <Col width={4} className="f-col">
            <Navbar.Brand href="/">
              <img className="f-my-logo" src={logo} alt="Logo" />
            </Navbar.Brand>

         
            </Col>

            <Col width={4}>
           {/*  <button className="pdf-button" onClick={() => window.scrollTo(0, 0)}>UP △</button> */}
            <button className="vvd" onClick={handleOpenContactModal}>
              <span><h3>Get In Touch </h3></span>
            </button>
            {showContactModal && (
              <ContactModal
                show={showContactModal}
                onHide={() => setShowContactModal(false)}
              />
            )}
            </Col>
            <Col width={4}>
            <p> © 2024 | Elena Kroupkin</p>
            <p> Made with 💖 </p>
            </Col>
        </Row>
      </Container>
    </footer>
  );
};