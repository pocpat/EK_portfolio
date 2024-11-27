import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
// import headerImg from "../assets/img/header-img.svg";
import girl from "../assets/img/girl_stars.png";
import { ArrowRightCircle } from "react-bootstrap-icons";
import "animate.css";
import "../css/App.css";
import "../css/skills.css";

import TrackVisibility from "react-on-screen";

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = [
    "Web Developer",
    "Full Stack Developer",
    "Front End Developer",
  ];
  const period = 2000;
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 3);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(80);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <span className="tagline">Welcome to my Portfolio</span>
            <h1 className="aligh-items-center">{`Hi! I'm Elena`} </h1>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <div className="title-container">
                    <h1>
                      <span className="txt-rotate " dataperiod="1000">
                        <span className="wrap">{text}</span>
                      </span>
                    </h1>
                  </div>
                  <div className="banner__p">
                    <div
                      className={`clamped-text ${isExpanded ? "expanded" : ""}`}
                    >
                      <p>
                        I am a passionate web developer with a unique background
                        in VFX compositing, giving me a keen eye for detail and
                        a deep appreciation for the visual aspects of web
                        development.
                        <br /> <br />
                        Over the last two years, I have been honing my skills in
                        Full Stack Development, diving into JavaScript, AWS, and
                        various web technologies to bring creative ideas to
                        life.
                        <br /> <br />
                        I have a "get-things-done" attitude, and I never give
                        up—something that is especially valuable when you are
                        just starting out.
                        <br /> <br />
                        For me, coding is like planting a tree — every commit
                        strengthens my foundation, expands my knowledge, and
                        helps me reach new heights.
                      </p>
                    </div>
                    {/* Button to toggle the expansion */}
                    <button
                      className="banner__read-btn button"
                      onClick={toggleExpand}
                    >
                      <span>
                        {isExpanded ? "Show Less" : "Read More"}
                        <ArrowRightCircle size={25} />
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5} className="image-container">
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                >
                  <img src={girl} alt="Home Page Img" />
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
