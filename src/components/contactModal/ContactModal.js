import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ContactForm } from '../ContactForm';

const ContactModal = ({ show, onHide, file }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Contact Viewer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       <ContactForm />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactModal;