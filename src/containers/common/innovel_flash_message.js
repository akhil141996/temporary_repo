import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import { connect } from 'react-redux';
import styles from '../../styles.css.js';

class InnovelFlashMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayResults: false,
      displayMessage: ''
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      displayResults: true,
      displayMessage: nextProps.messageObj.message,
      alertType: nextProps.messageObj.alertType
    });
  }

  componentDidUpdate() {
    if (this.state.alertType === 'error') {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return (
      <div style={styles.onlyFontstyleElement}>
        <div
          style={
            this.state.alertType === 'reset' &&
            this.state.displayMessage === '' &&
            this.state.displayResults ? (
              { visibility: 'hidden', display: 'none' }
            ) : (
              { display: 'none' }
            )
          }
        >
          <Alert color="success">{'Placeholder'}</Alert>
        </div>
        <div
          style={
            this.state.alertType === 'success' &&
            this.state.displayMessage !== '' &&
            this.state.displayResults ? (
              {}
            ) : (
              { display: 'none' }
            )
          }
        >
          <Alert color="success">{this.state.displayMessage}</Alert>
        </div>
        <div
          style={
            this.state.alertType === 'error' &&
            this.state.displayMessage !== '' &&
            this.state.displayResults ? (
              {}
            ) : (
              { display: 'none' }
            )
          }
        >
          <Alert color="danger">{this.state.displayMessage}</Alert>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messageObj: state.flashMessage
  };
}

export default connect(mapStateToProps, null)(InnovelFlashMessage);
