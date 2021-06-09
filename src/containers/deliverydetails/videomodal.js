import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';

class VideoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showDecline: true
    };
  }

  closeVideo = () => {
    this.props.closeVideo();
  };

  render() {
    return (
      <Modal size="lg" isOpen={this.props.isOpen}>
        <ModalBody>
          <div>
            <Link
              to="/tracking_measure"
              onClick={this.closeVideo}
              className="float-right"
            >
              {' '}
              [X]{' '}
            </Link>
          </div>
          <div>
            <iframe
              title="Video"
              width="760"
              height="450"
              src="https://www.youtube.com/embed/w9G5Z6R5TSA?autoplay=1"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen="true" 
              webkitallowfullscreen="true"
              alt="Video is not avaialable"
            />
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
export default VideoModal;
