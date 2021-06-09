import React, { Component } from 'react';
import { Card, Row, Col, CardTitle } from 'reactstrap';
import DeliveryDetailsForm from '../containers/deliverydetails/deliverydetailsform';
import Steps from '../containers/common/steps';
import { PageNavigation } from '../containers/common/page_navigation';
import { connect } from 'react-redux';
import '../styles/_deliveryform.scss';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../styles/_font.scss';
import { InnovelTabNavigation } from '../containers/common/innovel_tab_navigation';
import SelfSchedulerHeader from '../containers/common/self_scheduler_header.js';
import { getTransactionDetails, getMessageToShow } from '../actions/index';
import { bindActionCreators } from 'redux';
import { TrackingSpinner } from '../containers/common/tracking_spinner';
import LogoffLayer from './logoffLayer';
import { getTransactionRef } from '../containers/common/innovel_util';

class DeliveryDetails extends Component {
  constructor(props) {
    super(props);
    const transID = getTransactionRef();
    this.detailsScrollView = React.createRef();
    this.state = {
      transactionID: transID,
      schedulingOrder: false,
      startSpinner: true
    };
  }

  componentDidMount() {
    this.detailsScrollView.current.scrollIntoView();
    if (
      this.state.transactionID !== '' &&
      this.state.transactionID !== undefined &&
      this.state.transactionID !== null
    ) {
      this.props
        .getTransactionDetails(this.state.transactionID, 2)
        .then(result => {
          if (result.payload.status !== 200) {
            this.setState({ errorFlag: true });
            var messageObj = {
              alertType: 'error',
              message:
                'Unable to fetch the delivery details. Try to refresh the page or come back later.'
            };
            this.props.getMessageToShow(messageObj);
          } else if (result.payload.status === 200) {
            //set client name and phone for customer support message
            this.setState({clientCode: result.payload.data.serviceResponse.trackingOrder[0].clientCode});
            this.setState({mscPhone: result.payload.data.serviceResponse.trackingOrder[0].msc_phone_number});

            if (
              result.payload.data &&
              result.payload.data.serviceResponse &&
              result.payload.data.serviceResponse.orderDeliveryDetails &&
              result.payload.data.serviceResponse.orderDeliveryDetails
                .subOrderDeliveryDetailsList
            ) {
              this.setState({
                startSpinner: false
              });
            } else {
              this.setState({ errorFlag: true });
              const messageObj = {
                alertType: 'error',
                message:
                  'Unable to fetch the delivery details. Try to refresh the page or come back later.'
              };
              this.props.getMessageToShow(messageObj);
            }
          }
        });
    } else {
      this.props.history.push('/');
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    if (
      nextProps.transactionDetails !== undefined &&
      nextProps.transactionDetails.resultFound === false
    ) {
      var messageObj = {
        alertType: 'error',
        message:
          'Unable to fetch the details. Try to refresh the page or come back later.'
      };
      this.props.getMessageToShow(messageObj);
    } else if (
      nextProps.transactionDetails !== undefined &&
      nextProps.transactionDetails.trackingOrder.length !== 0
      //&& nextProps.transactionDetails.allowToSchedule)
    ) {
      this.setState({
        schedulerOrdType:
          nextProps.transactionDetails.scheduleTransactionDetail !==
            undefined ||
          nextProps.transactionDetails.scheduleTransactionDetail !== null
            ? nextProps.transactionDetails.scheduleTransactionDetail
                .scheduleOrderType
            : 0
      });
      if (
        nextProps.transactionDetails.scheduleTransactionDetail
          .scheduleOrderType === 5
      ) {
        //Amazon orders
        this.setState({
          stepNum: 1,
          custService: nextProps.transactionDetails.custService,
          schedulerOrdType: 5
        });
      } else if (
        nextProps.transactionDetails.scheduleTransactionDetail
          .scheduleOrderType === 4
      ) {
        //Normal orders
        this.setState({ stepNum: 2, schedulerOrdType: 4 });
      } else {
        if (nextProps.transactionDetails.custService === undefined) {
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
              nextProps.transactionDetails.custService +
              ' to validate the status of your delivery.'
          };
          this.props.getMessageToShow(messageObj);
        }
      }
    }
  }

  acceptMethods = storeDeliveryDetails => {
    // Parent stores the method that the child passed
    this.storeDeliveryDetails = storeDeliveryDetails;
  };

  next = e => {
    return this.storeDeliveryDetails().then(result => {
      return result.data.serviceResponse;
    });
  };

  render() {
    return (
      <div style={{ minHeight: '100vh' }} ref={this.detailsScrollView}>
        <LogoffLayer />
        <br />
        <br />
        <br />
        <br />
        <br />

        <Row>
          <Col sm="2" />
          <Col sm="8">
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
            !this.state.startSpinner && (
              <Steps
                step={this.state.stepNum}
                schedulerOrdType={
                  this.props.transactionDetails.scheduleTransactionDetail
                    .scheduleOrderType
                }
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
              <div>{this.state.startSpinner && <TrackingSpinner />}</div>
              {!this.state.startSpinner && (
                <DeliveryDetailsForm
                  shareMethods={this.acceptMethods}
                  history={this.props.history}
                  transactionRef={this.state.transactionID}
                  //transactionDetails={data.serviceResponse}
                  transactionDetails={this.props.transactionDetails}
                />
              )}
              <br />
              <PageNavigation
                nextPage={this.next}
                prevPage={this.previous}
                currentPageValue={this.props.location.pathname.replace('/', '')}
                transactionRef={this.state.transactionID}
                history={this.props.history}
                scheduleCall={this.next}
                disableScheduleButton={this.state.schedulingOrder}
                transactionDetails={this.props.transactionDetails}
              />
            </Card>

            <br />
            <br />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selfScheduleResponse: state.selfScheduleResponse,
    transactionDetails: state.transactionDetails
  };
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ getTransactionDetails, getMessageToShow }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryDetails);
