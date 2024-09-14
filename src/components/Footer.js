import React , {useEffect} from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { MailChimpForm } from "./MailChimpForm";
import logo from "../assets/img/logo3.png";
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
     
        
    

            <p> CopyRight : <span id='currentYear'></span> ©</p>
      
      
      </Container>
    </footer>
  );
};