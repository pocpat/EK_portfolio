import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import logo from "../assets/img/Asset 1.png";
import Navbar from "react-bootstrap/Navbar";
import "../css/App.css";
import "../css/footer.css";
import ContactModal from "./contactModal/ContactModal";
import CreditsModal from "./creditsModal/CreditsModal";

export const Footer = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const handleOpenContactModal = () => {
    setShowContactModal(true);
  };
  const handleOpenCreditsModal = () => {
    setShowCreditsModal(true);
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
            <button className="vvd" onClick={handleOpenContactModal}>
              <span><h3>Get In Touch </h3></span>
            </button>
            <button
              className="credits-btn"
              onClick={handleOpenCreditsModal}
              style={{
                marginTop: "10px",
                fontSize: "0.8rem",
                padding: "4px 12px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "20px",
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
              }}
            >
              Credits
            </button>
            {showContactModal && (
              <ContactModal
                show={showContactModal}
                onHide={() => setShowContactModal(false)}
              />
            )}
            {showCreditsModal && (
              <CreditsModal
                show={showCreditsModal}
                onHide={() => setShowCreditsModal(false)}
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