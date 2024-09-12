import projImg1 from "../assets/img/cookitup.jpg";
import projImg2 from "../assets/img/metroje.jpg";
import projImg3 from "../assets/img/sunsip.PNG";
import ghicon from "../assets/img/ghref.png";
import buttons45 from "../assets/img/45buttons.png";
import projref from "../assets/img/projref.png";
import girlref from "../assets/img/girlref.png";
import bgImg1 from "../assets/img/banner-bg1.jpg";
import { Col, Container, Row, Nav, Tab } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import "animate.css";
import "../css/App.css";
import TrackVisibility from "react-on-screen";
import React, { useState } from "react";
import PdfViewer from "./PdfViewer";
import "../css/projects-styles.css";
export const Projects = ({ title, description }) => {



  const projects = [
    {
      title: "Cook It Up",
      description:
        "React-based food managing app using state management, hooks, API integration, and local storage. Built to practice core React concepts.",
      imgUrl: projImg1,
    },
    {
      title: "MetroGE",
      description:
        "A home rent app that lets users filter properties by location, price, and type, built with a MongoDB database and modern web tools.",
      imgUrl: projImg2,
    },
    {
      title: "SunSip",
      description: "WIP",
      imgUrl: projImg3,
    },
  ];

  const refs = [
    {
      title: "GitHub icon",
      description: "Source of the Icon",
      imgUrl: ghicon,
    },
    {
      title: "Buttons",
      description: "This is a description of project 2",
      imgUrl: buttons45,
    },
    {
      title: "Project structure",
      description: "This is a description of project 3",
      imgUrl: projref,
    },
    {
      title: "Text-to-img Generation",
      description: "This is a description of project 4",
      imgUrl: girlref,
    },
  ];

  const [activeTab, setActiveTab] = useState("first");
  const [selectedPdf, setSelectedPdf] = useState(
    "/AmazonQuickSightProject.pdf"
  );

  const pdfFiles = [
    { name: "Amazon QuickSight Project", file: "/AmazonQuickSightProject.pdf" },
    { name: "Amazon ChatBot Part 1", file: "/AmazonLexChatbotPart1.pdf" },
    { name: "Amazon ChatBot Part 2", file: "/AmazonLexChatbotPart2.pdf" },
    { name: "Amazon IAM", file: "/awsIam.pdf" },
    { name: "metroge", file: "/metroge_DOC.pdf" },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <h2>Projects</h2>
                
                
                  <p>Here’s a snapshot of my journey:</p>
                  <div className="projects-container">
                  <div className="about-tab">
                    <h4>Web Dev</h4>
                    <p>Static sites with APIs to dynamic Docker apps.</p>
                  </div>
                  
                  <div className="about-tab">
                    <h4>AWS</h4>
                    <p>Exploring AWS and cloud projects.</p>
                  </div>
                  
                  <div className="about-tab">
                    <h4>Credits</h4>
                    <p>Thanks to all the tools and resources that’ve helped me!</p>
                  </div>
                  </div>
                  <Tab.Container id="projects-tabs" activeKey={activeTab}>
                    <Nav
                      variant="pills"
                      className="nav-pills mb-5 justify-center align-items-center"
                      id="pills-tab"
                      onSelect={(selectedKey) => setActiveTab(selectedKey)}
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="first">WEB DEV</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="second">AWS</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="third">Appreciation</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content
                      id="slideInUp"
                      className={
                        isVisible ? "animate__animated animate__slideInUp" : ""
                      }
                    >
                      {/* ======  1st tab ======  */}
                      <Tab.Pane eventKey="first">
                        <Row>
                          {projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                               
                              />
                            );
                          })}
                        </Row>
                      </Tab.Pane>
                      {/* ======  2nd tab ======  */}
                      <Tab.Pane eventKey="second">
                        <div className="pdf-container">
                          <div className="border-container">
                            <div className="pdf-buttons-container">
                              {pdfFiles.map((pdf, index) => (
                                <a
                                  key={index}
                                  href="#_"
                                  className="pdf-button relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group"
                                  onClick={() => setSelectedPdf(pdf.file)}
                                >
                                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
                                    <svg
                                      className="w-6 h-6"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                      ></path>
                                    </svg>
                                  </span>
                                  <span className="absolute flex items-center justify-center w-full h-full  transition-all duration-300 transform group-hover:translate-x-full ease">
                                    {pdf.name}
                                  </span>
                                  <span className="relative invisible">
                                    Button
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                          <PdfViewer file={selectedPdf} />
                        </div>
                      </Tab.Pane>
                      {/* ======  3rd tab ======  */}
                      <Tab.Pane eventKey="third">
                        <Row>
                          <p>
                            projects I used as a reference to build my projects
                          </p>
                          <br />
                          <br />
                          <Row>
                            {refs.map((ref, index) => {
                              return <ProjectCard key={index} {...ref} />;
                            })}
                          </Row>
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <div className="blob-right"></div>
      <div className="blob-right-bottom"></div>
      <img className="project-background-image" src={bgImg1} alt="img" />
    
    </section>
  );
};
