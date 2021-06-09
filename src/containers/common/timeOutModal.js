import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const TimeOutModal = ({
  showModal,
  handleClose,
  handleLogout,
  minutes,
  seconds
}) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Scheduling Reminder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your scheduling session will time out in {minutes}:{seconds}. Do you
        wish to continue scheduling?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Stay
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
