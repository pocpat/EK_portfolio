import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/img/Asset 1.png";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/github.svg";
import PdfModal from "./pdfModal/PdfModal";
import { Button } from "react-bootstrap";
import "../css/App.css";
import { supabase } from '../supabaseClient';

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hardcodedCV, setHardcodedCV] = useState("/EKResume102024.pdf");
  
  // Ref to track the navbar container
  const navbarRef = useRef(null);

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

    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Handle clicks outside the navbar to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only handle outside clicks when menu is expanded and on mobile
      if (isExpanded && isMobile && navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    // Add event listener when menu is expanded
    if (isExpanded && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isExpanded, isMobile]);

  // Fetch resume PDF from Supabase
  useEffect(() => {
    const fetchResumeCV = async () => {
      try {
        const { data, error } = await supabase
          .from('pdfs')
          .select('file_url')
          .eq('category', 'Resume')
          .order('title', { ascending: false })
          .limit(1);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setHardcodedCV(data[0].file_url);
        }
      } catch (error) {
        console.error('Error fetching resume CV:', error);
        // Keep the fallback value already set in state
      }
    };

    fetchResumeCV();
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Close menu when nav link is clicked (mobile)
  const handleNavLinkClick = (value) => {
    onUpdateActiveLink(value);
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {isMobile ? (
        /* Mobile Navbar */
        <Navbar
          ref={navbarRef}
          expand="md"
          className={`mobile-navbar ${scrolled ? "scrolled" : ""}`}
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
            <Navbar.Collapse
              id="basic-navbar-nav"
              className={isExpanded ? "expanded" : ""}
            >
              <Nav className="me-auto">
                <Nav.Link
                  href="#home"
                  className={
                    activeLink === "home" ? "active navbar-link" : "navbar-link"
                  }
                  onClick={() => handleNavLinkClick("home")}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  href="#skills"
                  className={
                    activeLink === "skills"
                      ? "active navbar-link"
                      : "navbar-link"
                  }
                  onClick={() => handleNavLinkClick("skills")}
                >
                  Skills
                </Nav.Link>
                <Nav.Link
                  href="#projects"
                  className={
                    activeLink === "projects"
                      ? "active navbar-link"
                      : "navbar-link"
                  }
                  onClick={() => handleNavLinkClick("projects")}
                >
                  Projects
                </Nav.Link>
                <a
                  className="active navbar-link nav-link"
                  href="https://www.linkedin.com/in/elenakroupkin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsExpanded(false)}
                >
                  LinkedIn
                </a>
                <a
                  className="active navbar-link nav-link"
                  href="https://github.com/pocpat"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsExpanded(false)}
                >
                  Github
                </a>
                <button
                  className=" active navbar-link nav-link hover:cursor-pointer"
                  style={{
                    transition: "color 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = "rgba(82, 240, 225, 1)")
                  }
                  onMouseLeave={(e) => (e.target.style.color = "")}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    handleOpenPdfModal();
                    setIsExpanded(false); // Close menu when resume is clicked
                  }}
                >
                  Resume
                </button>
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
      ) : (
        /* Desktop Navbar */
        <Navbar
          expand="md"
          className={`desktop-navbar ${scrolled ? "scrolled" : ""}`}
          expanded={isExpanded}
          onToggle={handleToggle}
        >
          <Container>
            <Navbar.Brand href="/">
              <img className="my-logo" src={logo} alt="Logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
                    activeLink === "skills"
                      ? "active navbar-link"
                      : "navbar-link"
                  }
                  onClick={() => onUpdateActiveLink("skills")}
                >
                  Skills
                </Nav.Link>
                <Nav.Link
                  href="#projects"
                  className={
                    activeLink === "projects"
                      ? "active navbar-link"
                      : "navbar-link"
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
                  className={`myresume-btn  ${
                    isExpanded ? "hidden" : "visible"
                  } text-base max-lg:text-sm`}
                  onClick={handleOpenPdfModal}
                >
                  <span>MY RESUME</span>
                </Button>
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
      )}
    </>
  );
};