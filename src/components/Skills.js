import { Col, Container, Row } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colorSharp from "../assets/img/color-sharp.png";
import "../css/App.css";
import "../css/skills.css";
import ProgressBar from "./progressBar/ProgressBar";

export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // Array of skill items
  const skills = [
    "Web Development",
    "JavaScript",
    "React",
    "MUI",
    "NodeJs",
    "MongoDB",
    "Git",
    "REST APIs",
    "Docker",
    "AWS Certified Cloud Practitioner",
    "Bootstrap5",
    "MySQL",
    "JSON",
    "TypeScript",
    "HTML DOM",
    "Tailwind",
    "Sass",
    "CSS"
  ];

  return (
    <section className="skill" id="skills">
      <Container>
        <Row>
          <Col>
            <div className="skill-bx">
              <h2>Skills</h2>
              <p>
                This is my current skillset, but it's always evolving. While I may be new to the industry, I'm driven to excel and become a top-tier full stack developer.
              </p>
              <Carousel
                responsive={responsive}
                infinite={true}
                className="skill-slider-Skills"
              >
                {/* Mapping over skills array and rendering ProgressBar */}
                {skills.map((skill, index) => (
                  <div key={index} className="skill-card">
                   
                      <ProgressBar />
                     
                    
                    <h5 >{skill}</h5>
                  </div>
                ))}
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="blob-left"></div>
      <img className="background-image-left" src={colorSharp} alt="img" />
    </section>
  );
};
