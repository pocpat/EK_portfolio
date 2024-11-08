import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useState, useEffect } from "react";
import logo from "../assets/img/Asset 1.png";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/github.svg";
import PdfModal from "./pdfModal/PdfModal";
import { Col, Button } from "react-bootstrap";
import "../css/NavBar.css";
import "../css/App.css";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleOpenPdfModal = () => {
    setShowModal(true);
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
  // ========= CV =========
  const hardcodedCV = "/EKResume102024.pdf";
  return (
    <Navbar expand="lg" className={scrolled ? "scrolled" : ""}>
      <Container>
      <Navbar.Brand href="/">
      <img className="my-logo" src={logo} alt="Logo"  />
    </Navbar.Brand>

        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="me-auto">
            <Nav.Link
              href="#home"
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("home")}
            >
              Home
            </Nav.Link>
            <Nav.Link
              href="#skills"
              className={
                activeLink === "skills" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("skills")}
            >
              Skills
            </Nav.Link>
            <Nav.Link
              href="#projects"
              className={
                activeLink === "projects" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("projects")}
            >
              Projects
            </Nav.Link>
            
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a
                href="https://www.linkedin.com/in/elenakroupkin/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={navIcon1} alt="Yelp" />
              </a>{" "}
              <a
                href="https://github.com/pocpat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={navIcon2} alt="Yelp" />
              </a>
            </div>
            <button className="vvd" onClick={handleOpenPdfModal}>
           
          
              <span>My RESUME</span>
            </button>
            {showModal && (
              <PdfModal
                show={showModal}
                onHide={() => setShowModal(false)}
                file={hardcodedCV}
              />
            )}
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};