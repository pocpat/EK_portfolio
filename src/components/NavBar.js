import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useState, useEffect } from "react";
import logo from "../assets/img/Asset 1.png";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/github.svg";
import PdfModal from "./pdfModal/PdfModal";
import { Col, Button } from "react-bootstrap";
import "../css/App.css";
export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(!1);
  const [showModal, setShowModal] = useState(!1);
  const [isExpanded, setIsExpanded] = useState(!1);
  const handleOpenPdfModal = () => {
    setShowModal(!0);
  };
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(!0);
      } else {
        setScrolled(!1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };
  const hardcodedCV = "/EKResume102024.pdf";
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <Navbar
      expand="md"
      className={scrolled ? "scrolled" : ""}
      expanded={isExpanded}
      onToggle={handleToggle}
    >
      <Container>
        <Navbar.Brand href="/">
          <img className="my-logo" src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon">
            <div></div>
          </span>
        </Navbar.Toggle>
       
        <Navbar.Collapse id="basic-navbar-nav">
{/* ******     ****** */}
          <Nav  className={
            isExpanded
              ? "ms-auto d-flex align-items-flex-start"
              : "navbar-text d-flex justify-content-flex-end"
          }>
          
            <Nav.Link
              href="#home"
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link "
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
           
            <div className="flex flex-row justify-center  ">
              <div
                className={`social-icon ${isExpanded ? "hidden " : "visible "}`}
              >
                <a
                  href="https://www.linkedin.com/in/elenakroupkin/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={navIcon1} alt="LinkedIn" />
                </a>
                <a
                  href="https://github.com/pocpat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={navIcon2} alt="Github" />
                </a>
              </div>
              <Button
                className={`myresume-btn ${isExpanded ? "hidden" : "visible"} text-base max-lg:text-sm`}
                onClick={handleOpenPdfModal}
              >
                <span>MY RESUME</span>
              </Button>
             
              <div
                className={`social-icon-toggle-opened ${
                  isExpanded ? "visible" : "hidden"
                }`}
              >
                <a
                  className="active navbar-link nav-link"
                  href="https://www.linkedin.com/in/elenakroupkin/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="active navbar-link nav-link"
                  href="https://github.com/pocpat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
                <button
                className="active navbar-link nav-link hover:cursor-pointer"
                style={{
                  transition: "color 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.target.style.color = "rgba(82, 240, 225, 1)")}
                onMouseLeave={(e) => (e.target.style.color = "")}
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  handleOpenPdfModal();
                }}
              >
                Resume
              </button>     
               </div>
            </div>
          </Nav>
          {showModal && (
            <PdfModal
              show={showModal}
              onHide={() => setShowModal(false)}
              file={hardcodedCV}
            />
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
