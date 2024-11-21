import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/img/header-img.svg";
import girl from "../assets/img/girl_stars.png"
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import "../css/App.css";
import TrackVisibility from 'react-on-screen';

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = [ "Web Developer", "Full Stack Developer", "Front End Developer" ];
  const period = 2000;
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text])


  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 3);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(80);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
          <span className="tagline">Welcome to my Portfolio</span>
           <h1 className="aligh-items-center" >{`Hi! I'm Elena`} </h1>
            <TrackVisibility  >
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
      
              
                <div className="title-container"> 
               <h1>
                <span className="txt-rotate " dataperiod="1000" data-rotate='[ "Web Developer", "Web Designer", "UI/UX Designer" ]'><span className="wrap">{text}</span></span></h1></div>
         <div className="banner__p">
                <p
                className={`clamped-text ${isExpanded ? 'expanded' : ''}`}
                >I'm a passionate web developer with a unique background in VFX compositing, which gives me a keen eye for detail and a love for the visual aspects of web development. Over the past year, I've immersed myself in Full Stack Development, continuously expanding my skills in JavaScript, AWS, and web development. I thrive on creating websites that are not only visually stunning but also functionally smooth. For me, coding isn't just a job; it's a joy and a constant learning journey.</p>
                               {/* Button to toggle the expansion */}
                               <button className="banner__read-btn" onClick={() => setIsExpanded(!isExpanded)}>
                               {isExpanded ? "Show Less " : "Read More"} <ArrowRightCircle size={25} />
                             </button>
                             </div>
                           </div>}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5} className="image-container">
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  <img src={girl}   alt="Home Page Img"/>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}



