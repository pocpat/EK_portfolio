import projImg1 from "../assets/img/cookitup.jpg";
import projImg2 from "../assets/img/metroje.jpg";
import projImg3 from "../assets/img/sunsip2.png";
import projImg4 from "../assets/img/similarCars.png";
import projImg5 from "../assets/img/summize.png";
import ghicon from "../assets/img/ghref.png";
import buttons45 from "../assets/img/45buttons.png";
import projref from "../assets/img/projref.png";
import girlref from "../assets/img/girlref.png";
import bgImg1 from "../assets/img/banner-bg1.jpg";
import { Col, Button, Container, Row, Nav, Tab } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import "animate.css";
import "../css/App.css";
import TrackVisibility from "react-on-screen";
import React, { useState } from "react";
import PdfViewer from "./PdfViewer";
import "../css/projects-styles.css";
// import Icon from 'react-bootstrap-icons/react/icon';
import { HandIndexThumb, GearFill } from 'react-bootstrap-icons';


export const Projects = ({ title, description }) => {
  const [activeTab, setActiveTab] = useState("first");
  const [selectedPdf, setSelectedPdf] = useState(
  "/ekawstechdoc.pdf"
  );
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
title: "Similar Car Finder",
description: "AI-Powered Vehicle Recommendations. Effortlessly Find and Recommend Similar Vehicles to Users.",
imgUrl: projImg4,
    },
    {
      title: "EK-Summize",
      description:
        "React-based portfolio . An open-source article summarization tool powered by GPT-4.",
      imgUrl: projImg5,
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
      description: "Interactive button elements",
      imgUrl: buttons45,
    },
    {
      title: "Project structure",
      description: "Used a foundational project structure.",
      imgUrl: projref,
    },
    {
      title: "Text-to-img Generation",
      description: "AI-generated main image.",
      imgUrl: girlref,
    },
   
    
  ];

  const pdfFiles = [
    { name: "Migration", file: "/ekawstechdoc.pdf" },
    { name: " QuickSight", file: "/AmazonQuickSightProject.pdf" },
    { name: "ChatBot Part 1", file: "/AmazonLexChatbotPart1.pdf" },
    { name: "ChatBot Part 2", file: "/AmazonLexChatbotPart2.pdf" },
    { name: "Amazon IAM", file: "/awsIam.pdf" },
   
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
                    <div className="about-tab d-none d-md-block">
                      <h4>APP</h4>
                      <p>
                        Explore my collection of static and dynamic web apps,
                        featuring API integrations and AI projects, with some
                        still in progress.
                      </p>
                    </div>

                    <div className="about-tab d-none d-md-block">
                      <h4>AWS</h4>
                      <p>
                        Discover my AWS projects and delve into the world of
                        cloud computing.
                      </p>
                    </div>

                    <div className="about-tab d-none d-md-block">
                      <h4>Credits</h4>
                      <p>
                        Thanks to all the tools and resources that’ve helped me!
                      </p>
                    </div>
                  </div>
                  <Tab.Container id="projects-tabs"  activeKey={activeTab}>
                
                    <Nav
                      variant="pills"
                      className="nav-pills mb-5  justify-center align-items-center 
                       "
                      id="pills-tab"
                      onSelect={(selectedKey) => setActiveTab(selectedKey)}
                    >
                      <Nav.Item className="flex-1 text-sm md:text-base xs:text-xs ">
                        <Nav.Link eventKey="first">APP</Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="flex-1 text-sm md:text-base xs:text-xs ">
                        <Nav.Link eventKey="second">AWS</Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="flex-1 text-sm md:text-base xs:text-xs">
                        <Nav.Link eventKey="third">CREDITS</Nav.Link>
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
                        {/*  hover icon  */} 
                        <div className="rotate-180">
                       
                      </div>
                          {projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                selectedPdf={selectedPdf}
                                onPdfSelect={(pdfUrl) => setSelectedPdf(pdfUrl)}
                              />
                            );
                          })}
                        </Row>
                      </Tab.Pane>
                      {/* ======  2nd tab ======  */}
                      <Tab.Pane eventKey="second">
                        <div className="pdf-container flex-container">
                          <div className="border-container ">
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

                          <div className="pdf-viewer-container">
                            <PdfViewer file={selectedPdf} />
                          </div>
                        </div>
                      </Tab.Pane>
                      {/* ======  3rd tab ======  */}
                      <Tab.Pane eventKey="third">
                        <Row>
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
