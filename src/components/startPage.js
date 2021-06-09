import React, { Component } from 'react';
import { Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  validateTrackNbrForScheduling,
  getStarter,
  getMessageToShow,
  getOrderServiceMaintenanceAlert
} from '../actions/index';
import _ from 'lodash';
import logoCalendar from '../images/cal1.jpg';
import logoTape from '../images/tape2.jpg';
import logoCheckList from '../images/task12.jpg';
import '../styles/self_scheduler/_startPage.scss';
import SelfSchedulerHeader from '../containers/common/self_scheduler_header.js';
import { TrackingSpinner } from '../containers/common/tracking_spinner';
import {
  clearSessionStorage,
  setSessionStorage
} from '../containers/common/innovel_util';

class StartPage extends Component {
  constructor(props) {
    super(props);
    this.topReference = React.createRef();
    this.state = {
      loading: false,
      orderValid: null,
      trackNumMissing: false,
      transactionDetails: null,
      schedulerOrdType: 0,
      trackingNumber: this.getUrlParameter('order'),
      spinTheSpinner: false,
      getStarted: false,
      multipleOrders: false,
      restart: false,
      selectAllChecked: true,
      clientCode: '',
      mscPhone: '',
      allowToSchedule: '',
      disableSubmission: false,
      trackingHeader:  false
    };
  }

  getUrlParameter = name => {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(window.location.search);
    return results === null
      ? null
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  componentDidMount() {
    this.setState({ restart: false });
    var messageObj = {
      alertType: 'reset',
      message: ''
    };
    this.props.getMessageToShow(messageObj);

    if (
      this.state.trackingNumber === undefined ||
      this.state.trackingNumber === null ||
      this.state.trackingNumber === ''
    ) {
      let messageObj = {
        alertType: 'error',
        message: 'Order cannot be scheduled On-Line. Tracking Number missing.'
      };
      this.props.getMessageToShow(messageObj);

      this.setState({ orderValid: false, trackNumMissing: true });
    } else {
      clearSessionStorage();
      this.setState({
        loading: true,
        orderValid: null,
        trackNumMissing: false
      });
      this.props
      .getOrderServiceMaintenanceAlert()
      .then(result => {
        const response = result && result.payload && result.payload.data && result.payload.data.serviceResponse;
        let maintenanceActionDisable = (response && response.alertMessageResponse  ) ? response.alertMessageResponse.disable : false;
      if(maintenanceActionDisable){
        this.setState({disableSubmission:true});
      }

      this.props
        .validateTrackNbrForScheduling(this.state.trackingNumber)
        .then(result => {
          const serviceResponse = result && result.payload && result.payload.data && result.payload.data.serviceResponse;
          const trackingOrder = serviceResponse && Array.isArray(serviceResponse.trackingOrder) ? serviceResponse.trackingOrder : [];
          const firstTrackingOrder = trackingOrder[0] || {};
          const noSchCodes =  trackingOrder.map(order => order.noSchCode) || [];
          if (noSchCodes.length === 1 && firstTrackingOrder.noSchCode) {
            this.setState({schedulerOrdType: 0 })
            this.props.getMessageToShow({
              alertType: 'error',
              message: firstTrackingOrder.complexErrorMessage
            });
          }

          //Case where response comes back with orders
          if (trackingOrder.length > 0 && !(noSchCodes.length === 1 && noSchCodes[0] !== null)) {
            //set client name and client phone for customer support message
            this.setState({ clientCode: firstTrackingOrder.clientCode });
            this.setState({ mscPhone: firstTrackingOrder.msc_phone_number});

            //Case where there is only one order
            if (trackingOrder.length === 1) {
              //Checking for error flags
              if (
               firstTrackingOrder.allowToSchedule &&
                !firstTrackingOrder.isDuplicate
              ) {
                let messageObj = {
                  alertType: 'reset',
                  message: ''
                };
                this.props.getMessageToShow(messageObj);
                this.setState({
                  loading: false,
                  selectedOrders: [
                    {
                      trackingNumber: firstTrackingOrder.trackingNumber,
                      primary: firstTrackingOrder.primary,
                      selected: true
                    }
                  ],
                  multipleOrders: false,
                  orderValid: true
                });
              } else {
                //Case where error flags have been hit and custService is not available
                if (
                  firstTrackingOrder.custService === undefined ||
                  firstTrackingOrder.custService === null
                ) {
                  let messageObj = {
                    alertType: 'error',
                    message: 'Order cannot be scheduled On-Line.'
                  };
                  this.props.getMessageToShow(messageObj);
                  // Case where error flags have been hit and custService is available
                } else {
                  let messageObj = {
                    alertType: 'error',
                    message:
                      'Order cannot be scheduled On-Line. Please contact us at ' +
                      firstTrackingOrder.custService +
                      ' to validate the status of your delivery.'
                  };
                  this.props.getMessageToShow(messageObj);
                }
              }
              //Case with multiple valid orders
            } else {
              let messageObj = {
                alertType: 'reset',
                message: ''
              };
              this.props.getMessageToShow(messageObj);
                const selectedOrders = [];
                this.props.transactionDetails.forEach(detail => {
                  if (detail.allowToSchedule && !detail.isDuplicate) {
                    if (
                      this.getUrlParameter('order') === detail.trackingNumber
                    ) {
                      selectedOrders.push({
                        trackingNumber: detail.trackingNumber,
                        primary: true,
                        selected: true
                      });
                    } else {
                      selectedOrders.push({
                        trackingNumber: detail.trackingNumber,
                        primary: false,
                        selected: true
                      });
                    }
                  }
                })
                if (selectedOrders.length) {
                  this.setState({
                    multipleOrders: true,
                    orderValid: true,
                    loading: false,
                    selectedOrders: selectedOrders
                });
                  } else {
                  //Case where error flags have been hit and custService is not available
                  if (
                    firstTrackingOrder.custService === undefined ||
                    firstTrackingOrder.custService === null
                  ) {
                    let messageObj = {
                      alertType: 'error',
                      message: 'Order cannot be scheduled On-Line.'
                    };
                    this.props.getMessageToShow(messageObj);
                    // Case where error flags have been hit and custService is available
                  } else {
                    let messageObj = {
                      alertType: 'error',
                      message:
                        'Order cannot be scheduled On-Line. Please contact us at ' +
                        response.trackingOrder[0].custService +
                        ' to validate the status of your delivery.'
                    };
                    this.props.getMessageToShow(messageObj);
                  }
                }
            }
            //Case where service cannot find any details or the list of orders comes as empty array
          } else if (!trackingOrder.length) {
            let messageObj = {
              alertType: 'error',
              message:
                'Order cannot be scheduled On-Line. Unable to fetch tracking details. Please try again later.'
            };

            this.setState(
              { orderValid: false,
                trackNumMissing: true,
                loading: false,
                schedulerOrdType: false },
              () => this.props.getMessageToShow(messageObj)
            );
          }
        })
        .catch(Error => {
          console.log(Error);
          let messageObj = {
            alertType: 'error',
            message:
              'We are experiencing some technical issues. Please try again later.'
          };

          this.setState(
            { orderValid: false,
              trackNumMissing: true,
              loading: false,
              schedulerOrdType: false },
            () => this.props.getMessageToShow(messageObj)
          );
        });
        this.setState({loading: false});   
     });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedOrders && prevState.selectedOrders !== this.state.selectedOrders) {
      const noOfCheckedOrders = this.state.selectedOrders.filter(
        order => order.selected === true
      );

      if (noOfCheckedOrders.length < 1 && this.state.getStarted) {
        this.setState({ getStarted: false });
      }
      if (noOfCheckedOrders.length > 0 && !this.state.getStarted) {
        this.setState({ getStarted: true });
      }
    }
    let currentScheduleOrderType = Array.isArray(this.props.transactionDetails)
      && this.props.transactionDetails[0]
      && this.props.transactionDetails[0].scheduleTransactionDetail
      && this.props.transactionDetails[0].scheduleTransactionDetail.scheduleOrderType;

      if (currentScheduleOrderType && this.state.schedulerOrdType !== currentScheduleOrderType) {
        this.setState({
          schedulerOrdType: currentScheduleOrderType
        });
        if (!this.props.transactionDetails[0].custService) {
          let messageObj = {
            alertType: 'error',
            message: 'Order cannot be scheduled On-Line.'
          };
          this.props.getMessageToShow(messageObj);
        }
      }
    }

  getStarted = () => {
    this.setState({ spinTheSpinner: true, loading: true });
    this.props
      .getStarter(this.state.selectedOrders)
      .then(result => {
        if (result.payload.status === 200) {
          if (!result.payload.data.serviceResponse.trackingOrder) {
            this.props.getMessageToShow({
              alertType: 'error',
              message:
                'Order cannot be scheduled On-Line. Unable to fetch tracking details. Please try again later.'
            });
            return;
          }
          this.setState({ spinTheSpinner: false, loading: false });
          const obj =
            result.payload.data.serviceResponse.scheduleTransactionDetail
              .pageNavigation;
          setSessionStorage(
            result.payload.data.serviceResponse.transactionRef,
            this.state.trackingNumber
          );
          const navigation = _.entries(obj);
          let pageToPush = this.findPageName(navigation, 0);
          this.props.history.push('/' + pageToPush);
        } else {
          this.setState({
            orderValid: true,
            spinTheSpinner: false,
            loading: false,
            restart: true,
            schedulerOrdType: false
          });
        }
      })
      .catch(Error => {
        this.props.history.push('/');
      });
  };

  findPageName = (myArray, value) => {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i][1] === value) {
        return myArray[i][0];
      }
    }
  };
  handleSelection = selectedIndex => {
    let messageObj = {
      alertType: 'reset',
      message: ''
    };
    this.props.getMessageToShow(messageObj);
    let SelectedOrders = this.state.selectedOrders.map((order, index) => {
      if (index === selectedIndex) {
        if (order.selected === false) {
          order.selected = true;
        } else {
          order.selected = false;
        }
      }
      return order;
    });

    let selectAllChecked =
      SelectedOrders.filter(
        order => order.selected === false || order.selected === 'false'
      ).length > 0
        ? false
        : true;

    this.setState({
      selectedOrders: SelectedOrders,
      selectAllChecked: selectAllChecked
    });
  };

  handleSelectAll = () => {
    let messageObj = {
      alertType: 'reset',
      message: ''
    };
    this.props.getMessageToShow(messageObj);
    let selectedOrders;
    let selectAllChecked;
    const noOfUncheckedOrders = this.state.selectedOrders.filter(
      order => order.selected === false || order.selected === 'false'
    );
    if (noOfUncheckedOrders.length > 0) {
      selectAllChecked = true;
      selectedOrders = this.state.selectedOrders.map(order => {
        return { ...order, selected: true };
      });
    } else {
      selectAllChecked = false;
      selectedOrders = this.state.selectedOrders.map(order => {
        return { ...order, selected: false };
      });
    }

    console.log(
      this.state.selectedOrders.filter(
        order => order.selected === false || order.selected === 'false'
      ).length
    );

    this.setState({
      selectedOrders: selectedOrders,
      selectAllChecked: selectAllChecked
    });
  };

  handleCheckboxClick = e => {
    e.preventDefault();
  };

  render() {
    let getStarted = <div />;
    if (
      this.state.loading === false &&
      this.state.orderValid === true &&
      this.state.getStarted === true
    ) {
      getStarted = (
        <Button color="primary" size="lg" disabled={this.state.disableSubmission}  onClick={this.getStarted}>
          Get Started
        </Button>
      );
    } else if (
      this.state.loading === false &&
      this.state.orderValid === true &&
      this.state.getStarted === false
    ) {
      getStarted = (
        <Button
          color="primary"
          size="lg"
          active
          onClick={() =>
            this.props.getMessageToShow({
              alertType: 'error',
              message:
                'A minimum of one order must be selected to start scheduling'
            })}
        >
          Get Started
        </Button>
      );
    } else if (
      this.state.loading === false &&
      this.state.orderValid === false
    ) {
      getStarted = (
        <Button color="primary" size="lg" disabled>
          Get Started
        </Button>
      );
    }

    const step1 = {};
    const step2 = {};
    const step3 = {};
    if (this.state.clientCode && this.state.schedulerOrdType === 5) {
      //Amazon orders
      step1.text = 'Provide information to prepare for your delivery';
      step1.smallText = 'Provide delivery information';
      step1.logo = logoTape;
      step2.text = 'Please confirm that your delivery address is correct';
      step2.smallText = 'Confirm your delivery address';
      step2.logo = logoCheckList;
    } else if (this.state.clientCode && this.state.schedulerOrdType === 4) {
      //Normal orders
      step1.text =
        'Please select your delivery date. The calendar will be displayed with available dates highlighted in GREEN.';
      step1.smallText =
        'Select your delivery date.';
      step1.logo = logoCalendar;
      step2.text =
        'Please answer a few questions to ensure you’re prepared for delivery. Based on the item service level you purchased, the delivery team will review the final location and determine the best path to get there.';
      step2.smallText =
        'Answer a few questions';
      step2.logo = logoTape;
      step3.text =
        'Please validate that your delivery address is correct. Click the schedule button to complete.';
      step3.smallText =
        'Validate your delivery address';
      step3.logo = logoCheckList;
    }
    if (this.state.loading && this.state.trackingHeader) {
      return (
        <div style={{ minHeight: '100vh', marginTop: '50vh'}} ref={this.topReference}>
          <div className="centerAlign" style={{flexDirection: 'column'}}>
            <TrackingSpinner />
          </div>
        </div>
      )
    } else if (!this.state.trackingHeader) {
    return (
      <div style={{ minHeight: '100vh' }} ref={this.topReference}>
        <br />
        <br />
        <br />
        <br />
        <br />
        <SelfSchedulerHeader
          landingPage={true}
          schedulerOrdType={this.state.schedulerOrdType}
          clientCode={this.state.clientCode}
          mscPhone={this.state.mscPhone}
        />

        <div className="container-fluid">
          <div className="centerAlign">
            {step1.text && step1.logo && (
              <Col sm="4">
                <h3 className="centerAlign h2Style">Step 1</h3>
                <div>
                  <p className="paraStyle fullText">{step1.text}</p>
                  <p className="paraStyle smallText">{step1.smallText}</p>
                </div>
                <div>
                  <img src={step1.logo} className="img-fluid img-thumbnail" alt="Step 1" />
                </div>
              </Col>
            )}

            {step2.text && step2.logo && (
              <Col sm="4">
                <h3 className="centerAlign h2Style">Step 2</h3>
                <div>
                  <p className="paraStyle fullText">{step2.text}</p>
                  <p className="paraStyle smallText">{step2.smallText}</p>
                </div>
                <div>
                  <img src={step2.logo} className="img-fluid img-thumbnail" alt="Step 2" />
                </div>
              </Col>
            )}

            {step3.text && step3.logo && (
              <Col sm="4">
                <h3 className="centerAlign h2Style">Step 3</h3>
                <div>
                  <p className="paraStyle fullText">{step3.text}</p>
                  <p className="paraStyle smallText">{step3.smallText}</p>
                </div>
                <div>
                  <img src={step3.logo} className="img-fluid img-thumbnail" alt="Step 3" />
                </div>
              </Col>
            )}
          </div>
          <br />
          <br />
          {this.props.transactionDetails &&
          this.state.multipleOrders &&
          this.state.orderValid && (
            <div>
              <hr className="centerAlign style113" />
              <br />
              <div className="container">
                <h3 className="centerAlign">
                  <em>
                    Based on your information, the following orders were found.
                    Select the orders you want to schedule to get started. All
                    orders are selected by default.
                  </em>
                </h3>
              </div>
              <br />
              <div className="selectAllOrdersContainer"> </div>

              <br />
              <div className="container selectOrdersContainer">
                <table>
                  <thead>
                    <tr style={{backgroundColor: "#0360bd", color: "#f1f1f1"}}>
                      <td>
                        {this.state.selectAllChecked && (
                          <input
                            type="checkbox"
                            defaultChecked
                            className="largeCheckbox"
                            onClick={() => this.handleSelectAll()}
                          />
                        )}
                        {!this.state.selectAllChecked && (
                          <input
                            type="checkbox"
                            className="largeCheckbox"
                            onClick={() => this.handleSelectAll()}
                          />
                        )}
                      </td>
                      <td>Tracking Numbers</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.selectedOrders.map((order, index) => {
                      if (order.selected) {
                        return (
                          <tr
                            onClick={() => this.handleSelection(index)}
                            key={index}
                            className="orderBody"
                          >
                            <td>
                              <input
                                className="largeCheckbox"
                                key={index}
                                type="checkbox"
                                defaultChecked
                                onClick={this.handleCheckboxClick}
                              />
                            </td>
                            <td>
                              <span>{order.trackingNumber}</span>
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr
                            onClick={() => this.handleSelection(index)}
                            key={index}
                            className="orderBody"
                          >
                            <td>
                              <input
                                className="largeCheckbox"
                                key={index + 1}
                                type="checkbox"
                                onClick={this.handleCheckboxClick}
                              />
                            </td>
                            <td>
                              <span>{order.trackingNumber}</span>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <br />
          <div className="centerAlign">
            {!this.state.restart && !this.state.trackNumMissing && getStarted}
            {(this.state.restart || this.state.trackNumMissing) && (
              <Button
                className="selectButton"
                onClick={() => this.props.history.push('/userselfschedule')}
              >
                Click Here To Try Again
              </Button>
            )}
          </div>
          <br />
          <hr className="centerAlign style113" />
          <br />
        </div>
      </div>
    );
  }
  }
}

function mapStateToProps(state) {
  return {
    transactionDetails: state.transactionDetails.trackingOrder
  };
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      { validateTrackNbrForScheduling, getStarter, getMessageToShow,getOrderServiceMaintenanceAlert },
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
