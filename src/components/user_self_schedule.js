import React, { Component } from 'react';
import { Button, Form } from 'reactstrap';
import SelfSchedulerHeader from '../containers/common/self_scheduler_header.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMessageToShow,getOrderServiceMaintenanceAlert } from '../actions/index';
class UserSelfSchedule extends Component {
  constructor(props) {
    super(props);
    this.timeOutMessage = React.createRef();
    this.trackInput = React.createRef();
    this.state = {
      trackingNumber: 0,
      validNumber: false,
      disableSubmission: false
    };
  }

  componentDidMount() {
    let timeOutValue = new URLSearchParams(this.props.location.search).get('timeout');
    this.props
      .getOrderServiceMaintenanceAlert()
      .then(result => {
         let maintenanceActionDisable = (result && result.payload && result.payload.data && result.payload.data.serviceResponse && result.payload.data.serviceResponse.alertMessageResponse  ) ? result.payload.data.serviceResponse.alertMessageResponse.disable : false;
        if(maintenanceActionDisable){
       this.setState({disableSubmission:true});
        }
      });

    if(timeOutValue === "True")
    {
      let messageObj = {
        alertType: 'success',
        message: 'You have been brought to the start of the scheduling process due to inactivity.'
      };
      this.props.getMessageToShow(messageObj);
    }
    else
    {
      let messageObj = {
        alertType: 'reset',
        message: ''
      };
      this.props.getMessageToShow(messageObj);
    }
    
    this.timeOutMessage.current.scrollIntoView();
    this.trackInput.current.focus();
    
  }

  handleInputChange = e => {
    let messageObj = {
      alertType: 'reset',
      message: ''
    };
    this.props.getMessageToShow(messageObj);
    if (e.target.value !== '') {
      if (e.target.value.match(/^([a-zA-Z0-9]+)$/)) {
        this.setState({ trackingNumber: e.target.value, validNumber: true });
      } else {
        this.setState({ validNumber: false });
        let messageObj = {
          alertType: 'error',
          message: 'Please enter a valid tracking number'
        };
        this.props.getMessageToShow(messageObj);
      }
    } else {
      this.setState({ validNumber: false });
    }
  };

  getStarted = () => {
    if (this.state.validNumber) {
      this.setState({ spinTheSpinner: true, loading: true });

      var selfscheduleURL = '/selfschedule?order=' + this.state.trackingNumber;
      this.props.history.push(selfscheduleURL);
    }
  };

  render() {
    return (
      <div style={{ minHeight: '100vh' }} ref={this.timeOutMessage}>
        <br />
        <br />
        <br />
        <br />
        <SelfSchedulerHeader landingPage={true} />

        <div>
          <Form onSubmit={this.getStarted}>
            <div className="centerAlign row justify-content-center">
              <div className="col-lg-2 col-md-2 col-sm-2 text-center">
                <label>Tracking Number : </label>
              </div>
              <div className="col-lg-2 col-md-2 col-sm-2 text-center">
                <input disabled={this.state.disableSubmission} type="text" ref={this.trackInput} onChange={this.handleInputChange} />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="centerAlign col">
                <Button color="primary" size="lg" active type="submit" disabled={this.state.disableSubmission}>
                  Start
                </Button>
              </div>
            </div>
            <br />

            <hr className="centerAlign style113" />
            <br />
          </Form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ getMessageToShow,getOrderServiceMaintenanceAlert }, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(UserSelfSchedule);
