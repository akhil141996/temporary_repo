import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../styles/_font.scss';
import '../styles/_landing.scss';
import TruckLogo from '../images/truck_costco_scheduler.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getOrderServiceMaintenanceAlert } from '../actions/index';
import InnovelServiceAlert from '../containers/common/innovel_service_alert.js';
import $ from 'jquery';

class Home extends Component {
  componentDidMount() {
    this.props
      .getOrderServiceMaintenanceAlert()
      .then(result => {
         let maintenanceActionDisable = (result && result.payload && result.payload.data && result.payload.data.serviceResponse && result.payload.data.serviceResponse.alertMessageResponse  ) ? result.payload.data.serviceResponse.alertMessageResponse.disable : false;
        if(maintenanceActionDisable){
       this.setState({disableSubmission:true});
        }
      });
      this.scrollToDiv();
    }  

  scrollToDiv() {
    var divId = window.location.hash;
    if (
      divId !== '' &&
      divId !== undefined &&
      $(divId).offset() !== undefined
    ) {
      $('html, body').animate(
        {
          scrollTop: $(divId).offset().top - 100
        },
        2000
      );
    }
  }

  render() {
    this.scrollToDiv();
    return (
      <div className="Home" style={{ paddingTop: '130px', minHeight: '90vh' }}>
        <div className="centerAlign truckImg">
          <img src={TruckLogo} className="img-fluid" alt="Deliver Truck" />
        </div>
        <InnovelServiceAlert name='tracking'/>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      { getOrderServiceMaintenanceAlert },
      dispatch
    )
  };
};

export default connect(null, mapDispatchToProps)(Home);
