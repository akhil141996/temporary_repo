import React, { Component } from 'react';
import { Container, Button } from 'reactstrap';
import { TRACKING_ROOT } from '../config/api-config';
class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  navigateToLogin = () => {
    window.location.href = TRACKING_ROOT;
  };

  render() {
    return (
      <Container style={{ paddingTop: '200px' }}>
        <div align="center">
          <h2 align="center">Sorry, we couldn't find that Page</h2>
        </div>
        <div align="center">
          <Button
            onClick={this.navigateToLogin}
            color="link"
            style={{ paddingBottom: '300px' }}
          >
            Click here to go home
          </Button>
        </div>
      </Container>
    );
  }
}

export default NotFound;
