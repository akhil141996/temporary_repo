import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import { connect } from 'react-redux';
import styles from '../../styles.css.js';
import '../../styles/self_scheduler/_startPage.scss';

class InnovelServiceAlert extends Component {
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
    if (this.state.alertType === 'Maintenance') {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return (
      <div style={styles.onlyFontstyleElement}>
        <div className="centerAlign"
          style={
            this.state.alertType === 'Maintenance' &&
            this.state.displayMessage !== '' &&
            this.state.displayResults ? (
              {}
            ) : (
              { display: 'none' }
            )
          }
        >
         {this.state.displayMessage &&  <Alert color="success">{this.state.displayMessage}</Alert>}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messageObj: state.maintenanceAlertMessage
  };
}

export default connect(mapStateToProps, null)(InnovelServiceAlert);
