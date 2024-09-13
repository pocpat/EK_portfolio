import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PdfViewer from '../PdfViewer' // Assuming this is the correct import for PdfViewer

const PdfModal = ({ show, onHide, file }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>PDF Viewer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PdfViewer
          document={{
            url: file,
          }}
          scale={1.5} // Adjust the scale as needed
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PdfModal;