import React, { Component } from 'react';
import { Button } from 'reactstrap';
import '../styles/_tracking.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/_font.scss';
import '../styles/_progress-tracker.scss';
import spinnerimg from '../images/spinner.gif';
import TruckLogo from '../images/truck_costco_scheduler.jpg';
import { getTrackingDetails,getTrackingServiceMaintenanceAlert } from '../actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import truckLogo from '../images/truck.png';
import InnovelServiceAlert from '../containers/common/innovel_service_alert.js'
import { MOBILE_WIDTH } from '../constants.js';

class newTracking extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      tabledata: '',
      ordNo: '',
      address: '',
      deliveryStatus: '',
      inputValue: '',
      trackingNumb: '',
      showSteps: false,
      showTrackingResult: false,
      showClickButton: false,
      showNoRecordsMessage: false,
      schedulerLink: '',
      del: false,
      mdr: false,
      xds: false,
      xdu: false,
      reg: false,
      disableSubmission: false,
      isMobileDevice: window.innerWidth <= MOBILE_WIDTH
    };
  }

  componentDidMount() {
    let url = document.URL;
    let urlUppercase = url.toUpperCase();
    let trackingIndex = urlUppercase.indexOf('ID=');

    this.props
      .getTrackingServiceMaintenanceAlert()
      .then(result => {
        let maintenanceActionDisable = (result && result.payload && result.payload.data && result.payload.data.serviceResponse && result.payload.data.serviceResponse.alertMessageResponse ) ? result.payload.data.serviceResponse.alertMessageResponse.disable : false;
       if(maintenanceActionDisable){
      this.setState({disableSubmission:true});
      }
      });

    if (trackingIndex !== -1) {
      let trackNumIndex = trackingIndex + 3;
      let trackNum = urlUppercase.substr(trackNumIndex, 50);
      this.setState(
        {
          loading: true,
          trackingNumb: trackNum,
          inputValue: trackNum,
          showSteps: false,
          showTrackingResult: false,
          showClickButton: false,
          showNoRecordsMessage: false,
          tabledata: '',
          ordNo: '',
          address: '',
          deliveryStatus: '',
          schedulerLink: '',
          del: false,
          mdr: false,
          xds: false,
          xdu: false,
          reg: false
        },
        this.CheckStatus
      );
    }
    window.addEventListener('resize', this.updateMobileDevice);
  }

  updateMobileDevice = () => {
    this.setState({ isMobileDevice: window.innerWidth <= MOBILE_WIDTH });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateMobileDevice);
  }

  handleSubmitButtonClick = () => {
    this.setState(
      {
        loading: true,
        trackingNumb: this.state.inputValue,
        showNoRecordsMessage: false,
        showSteps: false,
        showTrackingResult: false,
        showClickButton: false,
        tabledata: '',
        ordNo: '',
        address: '',
        deliveryStatus: '',
        schedulerLink: '',
        del: false,
        mdr: false,
        xds: false,
        xdu: false,
        reg: false
      },
      this.CheckStatus
    );
  };

  handleTrackingInputChange = event => {
    this.setState({
      inputValue: event.target.value
    });
  };

  CheckStatus = () => {
    this.setState({ loading: true });
    this.props.getTrackingDetails(this.state.trackingNumb).then(result => {
      if (result.payload.status === 200) {
        var response = result.payload.data;
        if (
          response != null &&
          response.serviceResponse != null &&
          response.serviceResponse.orderDetailList != null
        ) {

          let clientCode = response.serviceResponse.client_code;
          if (clientCode !== undefined && clientCode != null)
          {
            if (clientCode === '000014')
            {
              this.setState({ 
                assistanceText: 'If you need assistance, please visit '
              });
            }
            else
            {
              this.setState({
                assistanceText: ''
              });
            }
          }

          let statCode = response.serviceResponse.statCode;
          switch (statCode) {
            case 'REG':
              this.setState({ reg: true });
              break;
            case 'XDU':
              this.setState({ reg: true, xdu: true });
              break;
            case 'XDS':
              this.setState({ reg: true, xdu: true, xds: true });
              break;
            case 'MDR':
              this.setState({ reg: true, xdu: true, xds: true, mdr: true });
              break;
            case 'DEL':
              this.setState({
                reg: true,
                xdu: true,
                xds: true,
                mdr: true,
                del: true
              });
              break;
            default:
              console.log('Ideally should never come here');
          }

          let orderlist = response.serviceResponse.orderDetailList;

          let jsonRes = JSON.stringify(
            orderlist,
            ['date', 'time', 'location', 'status'],
            5
          );
          let str = jsonRes
            .replace(/"date":/g, '"Date":')
            .replace(/"time":/g, '"Time":')
            .replace(/"location":/g, '"Location":')
            .replace(/"status":/g, '"Status":');

          let orderlistTable = JSON.parse(str);
          this.setState({
            ordNo: response.serviceResponse.orderNumber,
            address: response.serviceResponse.address,
            deliveryStatus: response.serviceResponse.deliveryStatus,
            tabledata: orderlistTable
          });

          if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
          ) {
            this.setState({ showSteps: false });
          } else {
            this.setState({ showSteps: true });
          }

          this.setState({ showTrackingResult: true });
          if (response.serviceResponse.showLink === true) {
            let scheduler = '';
            let env = process.env.REACT_APP_RFT_ENV || 'local';
            if (env === 'prod') {
              scheduler = 'https://www.innovelsolutions.com/selfschedule';
            } else if (env === 'nonprod') {
              scheduler =
                'https://innovelsolutions.nonprod.mt.oh.transformco.com/selfschedule';
            } else {
              scheduler = 'http://localhost:3000/selfschedule';
            }
            scheduler =
              scheduler + '?order=' + response.serviceResponse.trackingNumber;

            this.setState({
              schedulerLink: scheduler,
              showClickButton: true
            });
          } else {
            this.setState({ showClickButton: false });
          }
        } else {
          this.setState({
            showNoRecordsMessage: true
          });
        }
      } else {
        this.setState({
          showNoRecordsMessage: true
        });
      }
      this.setState({ loading: false });
    });
  };

  renderSteps = () => {
    if (this.state.showSteps) {
      const delCssClass = this.state.del ? 'progtrckr-done' : 'progtrckr-todo';
      const mdrCssClass = this.state.mdr ? 'progtrckr-done' : 'progtrckr-todo';
      const xdsCssClass = this.state.xds ? 'progtrckr-done' : 'progtrckr-todo';
      const xduCssClass = this.state.xdu ? 'progtrckr-done' : 'progtrckr-todo';
      const regCssClass = this.state.reg ? 'progtrckr-done' : 'progtrckr-todo';
      let orderProcessed = 'Order Processed'
      let crossDockReceived = 'CrossDock Received';
      let crossDockShipped = ' CrossDock Shipped';
      let deliveryDepotReceived = 'DeliveryDepot Received';

      if (this.state.isMobileDevice) {
        orderProcessed = 'Order Rcvd'
        crossDockReceived = 'Dock Rcvd';
        crossDockShipped = ' Dock Shipped';
        deliveryDepotReceived = 'Depot Rcvd';
      }

      return (
        <ol id="steps" className="progtrckr" data-progtrckr-steps="5">
          <li>
            {orderProcessed}
            <div className={'prgs ' + regCssClass} id="REG" />
          </li>

          <li>
            {crossDockReceived}
            <div className={'prgs ' + xduCssClass} id="XDU" />
          </li>

          <li>
            {crossDockShipped}
            <div className={'prgs ' + xdsCssClass} id="XDS" />
          </li>

          <li>
            {deliveryDepotReceived}
            <div className={'prgs ' + mdrCssClass} id="MDR" />
          </li>

          <li>
            Shipment Delivered
            <div className={'prgs ' + delCssClass} id="DEL" />
          </li>
        </ol>
      )
    }
  }

  renderTable = () => {
    if (this.state.showTrackingResult) {
      if (this.state.isMobileDevice) {
        const tabledata = this.state.tabledata && this.state.tabledata[this.state.tabledata.length - 1];
        return (
          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <tbody>
                    <tr>
                      <td><b>Date</b></td>
                      <td style={{ fontSize: '16px' }}>{tabledata.Date}</td>
                    </tr>
                    <tr>
                      <td><b>Time</b></td>
                      <td style={{ fontSize: '16px' }}>{tabledata.Time}</td>
                    </tr>
                    <tr>
                      <td><b>Location</b></td>
                      <td style={{ fontSize: '16px' }}>{tabledata.Location}</td>
                    </tr>
                    <tr>
                      <td><b>Status</b></td>
                      <td style={{ fontSize: '16px' }}>{tabledata.Status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Time</th>
                      <th scope="col">Location</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.tabledata &&
                      this.state.tabledata.map((value, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ fontSize: '16px' }}>{value.Date}</td>
                            <td style={{ fontSize: '16px' }}>{value.Time}</td>
                            <td style={{ fontSize: '16px' }}>{value.Location}</td>
                            <td style={{ fontSize: '16px' }}>{value.Status}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  render() {
    return (
      <div className="container-fluid" style={{minHeight: '90vh'}}>
        <div id="divTrackOrders">
          <br />
          <div className="row">
            <div className="shadowhr col-md-12">
              <hr />
            </div>
          </div>
          <section>
            <header>
              <br />
            </header>
          </section>

          <div id="search" className="row">
            <div className="col-md-12">
              <div align="left" className="mobile-hidden">
                <div className="row">
                  <div id="banner" className="col-md-6 mt-3">
                    <h1 align="left" className="color-navyblue">
                      Delivery Tracking
                    </h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <hr className="col-md-12 delimiter" />
                  </div>
                </div>
                <div className="centerAlign truckImg">
                  <img src={TruckLogo}  className="img-fluid" alt="Deliver Truck" />
                </div>
                <span className="text-title">
                  Costco Logistics makes it easy for you to track orders and ensure
                  client satisfaction. Simply enter your tracking information to
                  check the status of your shipments.
                </span>
                <br /> <br />
              </div>
              <InnovelServiceAlert name='tracking'/>
              <span className="text-big color-orange t1">
                Tracking Number:
              </span>{' '}
              <br /> <br />
              <input
                disabled={this.state.disableSubmission}
                value={this.state.inputValue}
                onChange={this.handleTrackingInputChange}
                style={{
                  border: '0px',
                  borderBottomColor: 'blue',
                  font_size: '20px',
                  borderBottomWidth: '2px',
                  borderStyle: 'solid'
                }}
                type="text"
                className="mw-50 col-md-12 inputtype"
                placeholder="Enter Tracking"
              />
              <br /> <br />
              <div align="left">
                <Button
                  disabled={this.state.disableSubmission}
                  onClick={this.handleSubmitButtonClick}
                  className="btn-submit text-white"
                >
                  Check Status
                </Button>
                {this.state.loading && (
                  <img
                    src={spinnerimg}
                    alt="Loading Spinner"
                    style={{ paddingLeft: '10px' }}
                  />
                )}
                <br /> <br /> <br />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div id="results">
              <br />

              {/* Conditionally showing tracking result header */}

              {this.state.showTrackingResult && (
                <p
                  align="center"
                  id="trackingresult"
                  className="color-orange text-med"
                >
                  Tracking Results For{' '}
                </p>
              )}
              <div>
                {this.state.showTrackingResult && (
                  <div>
                    <div align="center" className="text-small">
                      {this.state.ordNo}
                    </div>
                    <div align="center" className="text-small">
                      {this.state.address}
                    </div>
                    <div align="center" className="text-status">
                      {this.state.deliveryStatus}
                    </div>
                    <div align="center" className="text-small">
                      {this.state.assistanceText}
                      <a className='customLink' target='_blank' rel='noopener noreferrer' href='https://customerservice.costco.com/'>Costco Customer Service.</a>
                    </div>
                    <br />
                  </div>
                )}

                {/*Conditionally showing Scheduling link if allowed to be scheduled */}
                {this.state.showClickButton && (
                  <div id="clickbutton" align="center">
                    <a
                      id="scheduleLinkImg"
                      className="navbar-brand"
                      href={this.state.schedulerLink}
                    >
                      <img src={truckLogo} alt="Delivery Truck" />
                    </a>
                    <br />
                    <a
                      id="scheduleLink"
                      className="text-status"
                      href={this.state.schedulerLink}
                    >
                      Click HERE to schedule
                    </a>
                  </div>
                )}

                {/* Conditionally showing No records avaialble message if tracking number doesn't exist*/}
                {this.state.showNoRecordsMessage && (
                  <div id="norecords">
                    <p align="center" className="color-orange text-big">
                      No Results were found for tracking Number:{this.state.trackingNumb}
                    </p>
                  </div>
                )}
              </div>

              {/* Conditionally showing progress tracker if results are back*/}
              {this.renderSteps()}
            </div>
          </div>
        </div>

        {/* Conditionally render table based on results status*/}
        {this.renderTable()}
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    validatedOrder: state.validatedOrder
  };
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ getTrackingDetails,getTrackingServiceMaintenanceAlert }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(newTracking);
