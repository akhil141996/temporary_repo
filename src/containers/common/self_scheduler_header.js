import React, { Component } from 'react';
import { TrackingSpinner } from './tracking_spinner';
import TruckLogo from '../../images/truck_costco_scheduler.jpg';
import InnovelHeaderLogo from '../../images/costcoLogistics_small.png';
import '../../styles/self_scheduler/_startPage.scss';
import InnovelFlashMessage from './innovel_flash_message';
import InnovelServiceAlert from './innovel_service_alert';

export class SelfSchedulerHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landingPage: props.landingPage,
      isPageLoading: props.isPageLoading,
      displayMsg: '',
      selfSchedulerHeading: '',
      selfSchedulerTagLine: ''
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ displayMsg: '' });

    if (nextProps.landingPage !== undefined && nextProps.landingPage !== null) {
      this.setState(
        {
          landingPage: nextProps.landingPage
        },
        () => {}
      );
    }
    if (
      nextProps.isPageLoading !== undefined &&
      nextProps.isPageLoading !== null
    ) {
      this.setState(
        {
          isPageLoading: nextProps.isPageLoading
        },
        () => {}
      );
    }

    if (
      nextProps.schedulerOrdType !== undefined &&
      nextProps.schedulerOrdType !== null
    ) {
      if (nextProps.clientCode && nextProps.schedulerOrdType === 5) {
        //Amazon orders
        this.setState({
          selfSchedulerHeading: 'Home Delivery Checklist',
          selfSchedulerTagLine:
            'Ensure your delivery meets expectations in 2 easy steps'
        });
      } else if (nextProps.clientCode && nextProps.schedulerOrdType === 4) {
        //Normal orders
        this.setState({
          selfSchedulerHeading: 'Home Delivery Scheduler',
          selfSchedulerTagLine:
            'Costco Logistics makes it easy for you to schedule your delivery in 3 easy steps'
        });
      } else {
        this.setState({
          selfSchedulerHeading: '',
          selfSchedulerTagLine: ''
        });
      }
    }

    //look for the client code to determine if the message will display
    if (nextProps.clientCode !== undefined && nextProps.clientCode !== null) {
      if (nextProps.clientCode === '000014' && nextProps.schedulerOrdType) {
        this.setState({
          selfSchedulerText: 'If you need assistance, please visit '
        });
      }
    }

    if (
      nextProps.custService !== undefined &&
      nextProps.custService !== null &&
      nextProps.schedulerOrdType === 5
    ) {
      this.setState({ custService: nextProps.custService });
    }
  }

  render() {
    var customerStyle = {
      color: '#f25e23',
      fontFamily: 'CenturyGothicStd',
      fontSize: '24px',
      fontWeight: 'bold'
    };
    return (
      <div className="container-fluid">
        <div className="row">
          <div id="banner" className="col-md-6 mt-3">
            <h1 align="left" className="color-navyblue">
              Delivery Scheduler
             </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <hr className="col-md-12 delimiter" />
          </div>
        </div>
        {this.state.custService && (
          <div style={customerStyle} className="centerAlign">
            Customer Service: {this.state.custService}
          </div>
        )}
        {this.state.landingPage && (
          <div className="centerAlign truckImg">
            <img src={TruckLogo}  className="img-fluid" alt="Deliver Truck" />
          </div>
        )}
        {this.state.landingPage === false && (
          <div className="centerAlign">
            <img src={InnovelHeaderLogo} className="img-fluid" alt="Deliver Truck" />
          </div>
        )}
        <br />
        <InnovelServiceAlert name='scheduler'/>
        <div className="centerAlign">
          <InnovelFlashMessage />
        </div>

        <div className="row justify-content-center" style={{ minHeight: '5vh' }}>
          {this.state.selfSchedulerHeading && (
            <div className="col-lg-8 col-md-12 col-sm-12">
              <h1 className="style39 centerAlign">                
                <span className="h1Span">{this.state.selfSchedulerHeading}</span>
              </h1>              
            </div>
          )}
        </div>
        <div className="row justify-content-center">
          {this.state.selfSchedulerTagLine && (
            <div className="col-lg-8 col-md-12 col-sm-12">
              <h3 className="centerAlign text-justify">
                <em style={{fontSize: "0.75em"}}>{this.state.selfSchedulerTagLine}</em>
              </h3>              
            </div>
          )}
        </div>
        <div className="row justify-content-center">
          {this.state.selfSchedulerText && (
            <div className="col-lg-8 col-md-12 col-sm-12">
              <h4 className="centerAlign">
              <em style={{fontSize: "0.7em"}}>{this.state.selfSchedulerText}
                <a className='customLink' target='_blank' rel='noopener noreferrer' href='https://customerservice.costco.com/'>Costco Customer Service.</a>
              </em>
              </h4>
            </div>
          )}
        </div>
        <br />
        <hr className="centerAlign style113" />
        {this.state.isPageLoading && (
          <TrackingSpinner displayMsg={this.state.displayMsg} />
        )}
      </div>
    );
  }
}

export default SelfSchedulerHeader;
