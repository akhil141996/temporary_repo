import React, { Component } from 'react';
import { Card, CardTitle, Row, Col, Alert, Button } from 'reactstrap';
import { connect } from 'react-redux';
import ConfirmationForm from '../containers/confirmation/confirmation_form';
import SelfSchedulerHeader from '../containers/common/self_scheduler_header.js';
import InfoIncorrectModal from '../containers/confirmation/info_incorrect_modal.js';
import { PageNavigation } from '../containers/common/page_navigation';
import Steps from '../containers/common/steps';
import { InnovelTabNavigation } from '../containers/common/innovel_tab_navigation';
import {
  getTransactionDetails,
  getMessageToShow,
  submitForSelfScheduling,
  notifyCustomerService
} from '../actions/index';
import { bindActionCreators } from 'redux';
import { TrackingSpinner } from '../containers/common/tracking_spinner';
import {
  clearSessionStorage,
  getTransactionRef
} from '../containers/common/innovel_util';
import LogoffLayer from './logoffLayer';

class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.confScrollView = React.createRef();
    this.state = {
      openModal: false,
      alternatePhone: null,
      loading: false,
      orderValid: null,
      deliveryDetailsCorrect: false,
      schedulingOrder: false,
      scrollToInnovelFlashMsg: false
    };
    const transID = getTransactionRef();
    if (transID === null) {
      this.state = {
        transactionID: ''
      };
    } else {
      this.state = {
        transactionID: transID
      };
    }

    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) this.InfoIncorrectCancel();
    });
  }

  componentDidMount() {
    //Close the modal on Esc button press
    this.confScrollView.current.scrollIntoView();

    if (
      this.state.transactionID === '' ||
      this.state.transactionID === undefined ||
      this.state.transactionID === null
    ) {
      this.props.history.push('/');
    } else {
      this.setState({ loading: true, orderValid: null });
      this.props
        .getTransactionDetails(this.state.transactionID, 3)
        .then(result => {
          if (result.payload.status === 200) {
            let transactionDetails = result.payload.data.serviceResponse;

            //set client name and phone for customer support message
            this.setState({clientCode: transactionDetails.trackingOrder[0].clientCode});
            this.setState({mscPhone: transactionDetails.trackingOrder[0].msc_phone_number});

            if (
              transactionDetails !== undefined &&
              transactionDetails.resultFound === false
            ) {
              this.setState({ orderValid: false });
              var messageObj = {
                alertType: 'error',
                message:
                  'Unable to fetch the details. Try to refresh the page or come back later.'
              };
              this.props.getMessageToShow(messageObj);
            } else if (
              transactionDetails !== undefined &&
              transactionDetails.trackingOrder.length !== 0
            ) {
              this.setState({
                loading: false,
                orderValid: true,
                schedulerOrdType:
                  transactionDetails.scheduleTransactionDetail !== undefined ||
                  transactionDetails.scheduleTransactionDetail !== null
                    ? transactionDetails.scheduleTransactionDetail
                        .scheduleOrderType
                    : 0
              });
              transactionDetails.trackingOrder.map(order => {
                if (order.primary === true) {
                  this.setState({
                    phoneNumber: order.custService,
                    clientName: order.clientName,
                    addressType: order.wrngAddrMsgType
                  });
                }
              });
              if (
                transactionDetails.scheduleTransactionDetail
                  .scheduleOrderType === 5
              ) {
                //Amazon orders
                this.setState({
                  stepNum: 2,
                  custService: transactionDetails.trackingOrder[0].custService
                });
              } else if (
                transactionDetails.trackingOrder[0].scheduleTransactionDetail
                  .scheduleOrderType === 4
              ) {
                //Normal orders
                this.setState({
                  stepNum: 3,
                  custService: transactionDetails.trackingOrder[0].custService
                });
              } else {
                if (
                  transactionDetails.trackingOrder[0].custService === undefined
                ) {
                  let messageObj = {
                    alertType: 'error',
                    message: 'Order cannot be scheduled On-Line.'
                  };
                  this.props.getMessageToShow(messageObj);
                } else {
                  let messageObj = {
                    alertType: 'error',
                    message:
                      'Order cannot be scheduled On-Line. Please contact us at ' +
                      transactionDetails.trackingOrder[0].custService +
                      ' to validate the status of your delivery.'
                  };
                  this.props.getMessageToShow(messageObj);
                }
              }
            } else {
              this.setState({ loading: false, orderValid: false });
            }
          } else {
            let messageObj = {
              alertType: 'error',
              message:
                'Unable to fetch the details. Try to refresh the page or come back later.'
            };
            this.props.getMessageToShow(messageObj);
          }
        });
    }
  }

  acceptMethods = storeConfirmationDetails => {
    // Parent stores the method that the child passed
    this.storeConfirmationDetails = storeConfirmationDetails;
  };

  next = e => {
    this.setState({
      schedulingOrder: true,
      scrollToInnovelFlashMsg: false
    });
    return (
      this.storeConfirmationDetails()
        .catch(Error => {
          this.setState({
            schedulingOrder: false,
            deliveryDetailsCorrect: false
          });
        })
    );
  };

  setDeliveryDetailsCorrectFlag = () => {
    const messageObj = { message: '', alertType: 'reset' };
    this.props.getMessageToShow(messageObj);
    this.setState({
      deliveryDetailsCorrect: true,
      scrollToInnovelFlashMsg: false
    });
  };

  toggleDeliveryDetailsCorrectFlag = () => {
    const messageObj = { message: '', alertType: 'reset' };
    this.props.getMessageToShow(messageObj);
    this.setState({
      deliveryDetailsCorrect: !this.state.deliveryDetailsCorrect,
      scrollToInnovelFlashMsg: false
    });
  };

  openIncorrectInfoModal = () => {
    this.setState({ openModal: true });
  };

  InfoIncorrectCancel = () => {
    this.setState({ openModal: false });
  };

  InfoIncorrectOk = () => {
    if (
      this.state.transactionID === '' ||
      this.state.transactionID === undefined ||
      this.state.transactionID === null
    ) {
      this.props.history.push('/');
    }

    this.setState({ openModal: false }, () => {
      const transRef = {
        transactionRef: this.state.transactionID
      };
      this.props.notifyCustomerService(transRef).then(result => {
        clearSessionStorage();
        this.props.history.push('/');
      });
    });
  };

  enableButton = flag => {
    this.setState({
      isButtonEnabled: flag
    });
  };

  scrollToBottom = () => {
    if (this.messagesEnd !== undefined && this.messagesEnd !== null) {
      this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <div style={{ minHeight: '100vh' }} ref={this.confScrollView}>
        <LogoffLayer />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Row>
          <Col sm="2" />
          <Col sm="8">
            {this.state.scrollToInnovelFlashMsg && (
              <div
                style={{ float: 'left', clear: 'both' }}
                ref={el => {
                  this.messagesEnd = el;
                }}
              />
            )}
            <SelfSchedulerHeader
              landingPage={false}
              schedulerOrdType={this.state.schedulerOrdType}
              custService={this.state.custService}
              clientCode={this.state.clientCode}
              mscPhone={this.state.mscPhone}
            />
          </Col>
          <Col sm="2" />
        </Row>

        <br />

        <Row>
          <Col sm="2" />
          <Col sm="3">
            {this.props.transactionDetails &&
            this.props.transactionDetails.scheduleTransactionDetail &&
            !this.state.loading && (
              <Steps
                step={this.state.stepNum}
                schedulerOrdType={
                  this.props.transactionDetails.scheduleTransactionDetail
                    .scheduleOrderType
                }
                custService={this.state.custService}
              />
            )}
          </Col>
          <Col sm="5">
            <Card body>
              <CardTitle>
                <InnovelTabNavigation
                  transactionStatus={
                    this.props.transactionDetails.scheduleTransactionDetail
                  }
                />
              </CardTitle>
              {this.state.orderValid && (
                <div>
                  <Alert color="success">
                    If you would like to make changes to or provide a
                    mobile/alternate number, please enter it in the
                    mobile/alternate field below.
                  </Alert>

                  <ConfirmationForm
                    enableButton={this.enableButton}
                    responseValues={this.props.transactionDetails}
                    history={this.props.history}
                    shareMethods={this.acceptMethods.bind(this)}
                    deliveryDetailsCorrect={this.state.deliveryDetailsCorrect}
                  />

                  <br />
                  <br />
                  <div className="centerAlign">
                    <span>
                      <Button
                        color="primary"
                        size="lg"
                        active
                        onClick={this.setDeliveryDetailsCorrectFlag}
                        disabled={
                          this.state.schedulingOrder ||
                          this.state.isButtonEnabled === false
                        }
                      >
                        I agree delivery details are correct
                      </Button>
                      <span> </span>
                      <input
                        type="checkbox"
                        onChange={this.toggleDeliveryDetailsCorrectFlag}
                        checked={this.state.deliveryDetailsCorrect}
                        disabled={
                          this.state.schedulingOrder ||
                          this.state.isButtonEnabled === false
                        }
                      />
                    </span>
                  </div>
                  <br />

                  <div className="centerAlign">
                    <Button
                      color="primary"
                      size="lg"
                      active
                      onClick={this.openIncorrectInfoModal}
                      disabled={
                        this.state.deliveryDetailsCorrect ||
                        this.state.schedulingOrder ||
                        this.state.isButtonEnabled === false
                      }
                    >
                      My delivery information is incorrect
                    </Button>
                  </div>
                  <br />

                  <InfoIncorrectModal
                    open={this.state.openModal}
                    InfoIncorrectCancel={this.InfoIncorrectCancel}
                    InfoIncorrectOk={this.InfoIncorrectOk}
                    phoneNumber={this.state.phoneNumber}
                    clientName={this.state.clientName}
                    addressType={this.state.addressType}
                  />
                </div>
              )}
              {this.state.loading && <TrackingSpinner />}
              <PageNavigation
                nextPage={this.next}
                prevPage={this.previous}
                currentPageValue={this.props.location.pathname.replace('/', '')}
                transactionRef={this.state.transactionID}
                history={this.props.history}
                disableNextButton={!this.state.deliveryDetailsCorrect}
                scheduleCall={this.next}
                disableScheduleButton={!this.state.deliveryDetailsCorrect}
                disableFinish={this.state.schedulingOrder}
                transactionDetails={this.props.transactionDetails}
              />
            </Card>
            <br />
            <br />
          </Col>
          <Col sm="2" />
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    transactionDetails: state.transactionDetails,
    selfScheduleResponse: state.selfScheduleResponse,
    scheduleIncorrectInfoResponse: state.scheduleIncorrectInfoResponse
  };
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      {
        getTransactionDetails,
        getMessageToShow,
        submitForSelfScheduling,
        notifyCustomerService
      },
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Confirmation);
