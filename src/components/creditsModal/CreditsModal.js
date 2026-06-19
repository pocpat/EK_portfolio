import React from 'react';
import { Modal, Button, Row } from 'react-bootstrap';
import { ProjectCard } from '../ProjectCard';

// Credit/refs data — moved from Projects.js Credits tab
import ghicon from "../../assets/img/ghref.png";
import buttons45 from "../../assets/img/45buttons.png";
import projref from "../../assets/img/projref.png";
import girlref from "../../assets/img/girlref.png";
import jsmastery from "../../assets/img/jsMastery.png";
import bolt from "../../assets/img/boltIMG.jpg";

const refs = [
  {
    title: "GitHub icon",
    description: "Source of the Icon",
    imgUrl: ghicon,
  },
  {
    title: "Buttons",
    description: "Interactive button elements",
    imgUrl: buttons45,
  },
  {
    title: "Project structure",
    description: "Used a foundational project structure.",
    imgUrl: projref,
  },
  {
    title: "Text-to-img Generation",
    description: "AI-generated main image.",
    imgUrl: girlref,
  },
  {
    title: "Next.js aps structure",
    description: "Master Modern Web Development With a Project Based Approach.",
    imgUrl: jsmastery,
  },
  {
    title: "Built with Bolt",
    description: "The portfolio was tested and updated with Bolt",
    imgUrl: bolt,
  }
];

const CreditsModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Credits</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Thanks to all the tools and resources that've helped me!</p>
        <Row>
          {refs.map((ref, index) => {
            return <ProjectCard key={index} {...ref} />;
          })}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreditsModal;