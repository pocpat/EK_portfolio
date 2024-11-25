import { Col, Container, Row } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colorSharp from "../assets/img/color-sharp.png";
import "../css/App.css";
import "../css/skills.css";
import ProgressBar from "./progressBar/ProgressBar";
import { useState } from "react";
import { ArrowRightCircle } from 'react-bootstrap-icons';


export const Skills = (progressBarRef) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    "CSS",
  ];

  return (
    <section className="skill" id="skills">
      <Container>
        <Row>
          <Col>
            <div 
            className="skill-bx"
           
            >
            <h2 className="mt-10">Skills</h2>
              <div  className={`skill-bx clamped-text ${isExpanded ? 'expanded' : ''}`}>
              <h2 >Skills</h2>
              <p 
             
              >
                This is my current skillset, but it's always evolving. While I
                may be new to the industry, I'm driven to excel and become a
                top-tier full stack developer.</p>
                
               <p> Oh, and just a heads-up—the
                percentages you see on those progress bars? They're completely
                random! Think of them as a fun way to illustrate my enthusiasm
                and potential rather than precise measurements. After all, who
                doesn’t love a bit of flair with their data? 
              </p>
              </div>
                {/* Button to toggle the expansion */}
                <button className="banner__read-btn button" onClick={() => setIsExpanded(!isExpanded)}>
                <span>{isExpanded ? 'Show Less  ' : 'Read More  '}<ArrowRightCircle size={25} /></span>
               </button>
              <Carousel
                responsive={responsive}
                infinite={true}
                className="skill-slider-Skills"
              >
                {/* Mapping over skills array and rendering ProgressBar */}
                {skills.map((skill, index) => (
                  <div key={index} className="skill-card">
                    <ProgressBar ref={progressBarRef} />
                    {/* Pass the ref to ProgressBar */}
                    <h5>{skill}</h5>
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
