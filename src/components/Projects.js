import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import bgImg1 from  "../assets/img/banner-bg1.jpg";
import { Col, Container, Row, Nav, Tab } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import "animate.css";
import TrackVisibility from "react-on-screen";

export const Projects = () => {
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
  return (
    <section className="project" id="project">
      <Container >
      
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

                  <Tab.Container id="projects-tabs" defaultActiveKey="first">
                    <Nav
                      variant="pills"
                      className="nav-pills mb-5 justify-center align-items-center"
                      id="pills-tab"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="first">WEB DEV</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="second">AWS</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="third">Tab three</Nav.Link>
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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Cumque quam, quod neque provident velit, rem explicabo
                        excepturi id illo molestiae blanditiis, eligendi dicta
                        officiis asperiores delectus quasi inventore debitis
                        quo.
                      </Tab.Pane>
                      <Tab.Pane eventKey="third">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Cumque quam, quod neque provident velit, rem explicabo
                        excepturi id illo molestiae blanditiis, eligendi dicta
                        officiis asperiores delectus quasi inventore debitis
                        quo.
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
