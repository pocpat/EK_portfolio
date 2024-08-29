import React , {useEffect} from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { MailChimpForm } from "./MailChimpForm";
import logo from "../assets/img/logo.svg";
import "../css/App.css";

export const Footer = () => {
  useEffect(() => {
    const yearElement = document.querySelector('#currentYear');
    if (yearElement) {
      yearElement.innerHTML = new Date().getFullYear();
    }
  }, []);

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

            <p> CopyRight : <span id='currentYear'></span> ©</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};