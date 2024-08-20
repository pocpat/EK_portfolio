import React from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { MailChimpForm } from "./MailChimpForm";
import logo from "../assets/img/logo.svg";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/nav-icon2.svg";
import navIcon3 from "../assets/img/nav-icon3.svg";

export const Footer = () => {
  return (
    <footer className="footer">
    <div className="blob-left"></div>
    
      <Container>
        <Row className="align-item-center">
          <MailChimpForm />
          <Col sm={6}>
            <img src={logo} alt="Logo" />
          </Col>
          <Col sm={6} className="text-center text-sm-end">
            <div className="social-icon">
             {/* <a href="">*/}
                <img src={navIcon1} alt="Nav Icon 1" />
             {/*  </a>*/}
             {/* <a href="">*/}
                <img src={navIcon2} alt="Nav Icon 2" />
             {/* </a>*/}
             {/* <a href="">*/}
                <img src={navIcon3} alt="Nav Icon 3" />
             {/* </a>*/}
            </div>
            <p> CopyRight 2024. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};