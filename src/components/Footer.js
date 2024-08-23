import React from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { MailChimpForm } from "./MailChimpForm";
import logo from "../assets/img/logo.svg";

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

            <p> CopyRight 2024. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};