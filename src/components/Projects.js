import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import bgImg1 from "../assets/img/banner-bg1.jpg";
import { Col, Container, Row, Nav, Tab } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import "animate.css";
import TrackVisibility from "react-on-screen";
import React, { useState } from "react";
import PdfViewer from "./PdfViewer";
import "../projects-styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export const Projects = () => {
  const pdfUrls = [
    "/AmazonQuickSightProject.pdf",
    0,

    // ... more PDF URLs
  ];
  const projects = [
    {
      title: "Project 1",
      description: "This is a description of project 1",
      imgUrl: projImg1,
    },
    {
      title: "Project 2",
      description: "This is a description of project 2",
      imgUrl: projImg2,
    },
    {
      title: "Project 3",
      description: "This is a description of project 3",
      imgUrl: projImg3,
    },
    {
      title: "Project 4",
      description: "This is a description of project 4",
      imgUrl: projImg1,
    },
    {
      title: "Project 5",
      description: "This is a description of project 5",
      imgUrl: projImg1,
    },
    {
      title: "Project 6",
      description: "This is a description of project 6",
      imgUrl: projImg1,
    },
  ];
  const awsDocs = [
    {
      title: "Project 1",
      description: "This is a description of project 1",
      imgUrl: projImg1,
    },
    {
      title: "Project 2",
      description: "This is a description of project 2",
      imgUrl: projImg2,
    },
    {
      title: "Project 3",
      description: "This is a description of project 3",
      imgUrl: projImg3,
    },
    {
      title: "Project 4",
      description: "This is a description of project 4",
      imgUrl: projImg1,
    },
    {
      title: "Project 5",
      description: "This is a description of project 5",
      imgUrl: projImg1,
    },
    {
      title: "Project 6",
      description: "This is a description of project 6",
      imgUrl: projImg1,
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
  ];

  return (
    <section className="project" id="project">
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

                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                  </p>

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
                        <Nav.Link eventKey="second">Tab Two</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="third">AWS</Nav.Link>
                      </Nav.Item>
                    </Nav>

                    <Tab.Content
                      id="slideInUp"
                      className={
                        isVisible ? "animate__animated animate__slideInUp" : ""
                      }
                    >
                      <Tab.Pane eventKey="first">
                        <Row>
                          {projects.map((project, index) => {
                            return <ProjectCard key={index} {...project} />;
                          })}
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="second">
                        <Row>
                          awsDocs Lorem ipsum dolor sit amet consectetur
                          adipisicing elit. Cumque quam, quod neque provident
                          velit, rem explicabo excepturi id illo molestiae
                          blanditiis, eligendi dicta officiis asperiores
                          delectus quasi inventore debitis quo.
                          {awsDocs.map((project, index) => {
                            return <ProjectCard key={index} {...project} />;
                          })}
                        </Row>
                      </Tab.Pane>

<Tab.Pane eventKey="third">
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
            <span className="relative invisible">Button</span>
          </a>
        ))}
      </div>
    </div>
    <PdfViewer file={selectedPdf} />
  </div>
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
