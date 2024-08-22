import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/img/header-img.svg";
import girl from "../assets/img/girl_stars.png"
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = [ "Web Developer", "Full Stack Developer", "Front End Developer" ];
  const period = 2000;

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
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <span className="tagline">Welcome to my Portfolio</span>
                <h1>{`Hi! I'm Elena`} <br></br><span className="txt-rotate" dataPeriod="1000" data-rotate='[ "Web Developer", "Web Designer", "UI/UX Designer" ]'><span className="wrap">{text}</span></span></h1>
                  <p>I'm a passionate web developer with a unique background in VFX compositing, which gives me a keen eye for detail and a love for the visual aspects of web development. Over the past year, I've immersed myself in Full Stack Development, continuously expanding my skills in JavaScript, AWS, and web development. I thrive on creating websites that are not only visually stunning but also functionally smooth. For me, coding isn't just a job; it's a joy and a constant learning journey.</p>
                  <button onClick={() => console.log('connect')}>Let’s Connect <ArrowRightCircle size={25} /></button>
              </div>}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  <img src={girl}   alt="Header Img"/>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}



// import { useState, useEffect } from "react";
// import Container from "react-bootstrap/esm/Container";
// import { Row, Col } from "react-bootstrap";
// import { ArrowRightCircle } from "react-bootstrap-icons";
// import headerImg from "../assets/img/header-img.svg";
// import "animate.css";
// import TrackVisibility from "react-on-screen";
// import { isVisible } from "@testing-library/user-event/dist/utils";

// export const Banner = () => {
//   const [loopNum, setLoopNum] = useState(0);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [text, setText] = useState("");
//   const [delta, setDelta] = useState(300 - Math.random() * 100);
//   const [index, setIndex] = useState(1);
//   const toRotate = ["Web Developer", "Web Designer", "UI/UX Designer"];
//   const period = 2000;

//   useEffect(() => {
//     let ticker = setInterval(() => {
//       tick();
//     }, delta);

//     return () => {
//       clearInterval(ticker);
//     };
//   }, [text]);

//   const tick = () => {
//     let i = loopNum % toRotate.length;
//     let fullText = toRotate[i];
//     let updatedText = isDeleting
//       ? fullText.substring(0, text.length - 1)
//       : fullText.substring(0, text.length + 1);

//       // -----------------------------------------
//       setText(updatedText);

//       if (isDeleting) {
//         setDelta((prevDelta) => prevDelta / 2);
//       }
      
//       if (!isDeleting && updatedText === fullText) {
//         setIsDeleting(true);
//         setIndex((prevIndex) => prevIndex - 1);
//         setDelta(period);
//       } else if (isDeleting && updatedText === "") {
//         setIsDeleting(false);
//         setLoopNum(loopNum + 1);
//         setIndex(1);
//         setDelta(500);
//       } else {
//         setIndex((prevIndex) => prevIndex + 1);
//       }
      
//       return (
//         <section className="banner" id="home">
//           <Container>
//             <Row className="align-items-center">
//               <Col xs={12} md={6} xl={7}>
//                 {/*  to track the OBJ visibility */}
//                 <TrackVisibility>
//                   {({ isVisible }) => (
//                     <div
//                       className={
//                         isVisible ? "animated__animated animate__fadeIn" : ""
//                       }
//                     >
//                       <span className="tagline">Welcome to my Portfolio</span>
//                       <h1>
//                         {`Hi I'm webdecoded `}
//                         <span
//                           className="txt-rotate"
//                           dataPeriod="1000"
//                           data-rotate='[ "Web Developer", "Web Designer", "UI/UX Designer" ]'
//                         ></span>
//                         <span className="wrap">{text}</span>
//                       </h1>
//                       <p>
//                         About miself something . Lorem Ipsum is simply dummy text of
//                         the printing and typesetting industry. Lorem Ipsum has been
//                         the industry's standard dummy text ever since the 1500s, when
//                         an unknown printer took a galley of type and scrambled it to
//                         make a type specimen book. It has survived not only five
//                         centuries, but also the leap into electronic typesetting,
//                         remaining essentially unchanged. It was popularised in the
//                         1960s with the release of Letraset sheets containing Lorem
//                         Ipsum passages, and more recently with desktop publishing
//                         software like Aldus PageMaker including versions of Lorem
//                         Ipsum.
//                       </p>
//                       <button onClick={() => console.log("connect")}>
//                         Let's Connect <ArrowRightCircle size={25} />
//                       </button>
//                     </div>
//                   )}
//                 </TrackVisibility>
//             {/*  ======================================================================== */}
//           </Col>
//           <Col xs={12} md={6} xl={5}>
//             <img src={headerImg} alt="Header Img" />
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };
