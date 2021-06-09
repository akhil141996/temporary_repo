import React, { Component } from 'react';
import { Card, Row, Col, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScheduleForm from '../containers/schedule/scheduleForm';
import { PageNavigation } from '../containers/common/page_navigation';
import { getTransactionRef } from '../containers/common/innovel_util';
import SelfSchedulerHeader from '../containers/common/self_scheduler_header';
import { getTransactionDetails, getMessageToShow } from '../actions/index';
import { InnovelTabNavigation } from '../containers/common/innovel_tab_navigation';
import LogoffLayer from './logoffLayer';
import Steps from '../containers/common/steps';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.topScroll = React.createRef();
    const transID = getTransactionRef();
    this.state = {
      isManualSchedule: false,
      transactionID: transID
    };
  }

  acceptMethods = updateScheduleDate => {
    // Parent stores the method that the child passed
    this.updateScheduleDate = updateScheduleDate;
  };

  componentDidMount() {
    this.topScroll.current.scrollIntoView();
    if (
      this.state.transactionID !== '' &&
      this.state.transactionID !== undefined &&
      this.state.transactionID !== null
    ) {
      this.setState({ startSpinner: true });
      this.props
        .getTransactionDetails(this.state.transactionID, 1)
        .then(result => {
          if (result.payload.status !== 200) {
            this.setState({ errorFlag: true });
            var messageObj = {
              alertType: 'error',
              message:
                'Unable to fetch the schedule details. Try to refresh the page or come back later.'
            };
            this.props.getMessageToShow(messageObj);
          } else if (result.payload.status === 200) {
            let transactionDetails = result.payload.data.serviceResponse;
            if (
              transactionDetails !== undefined &&
              transactionDetails.resultFound === false
            ) {
              let messageObj = {
                alertType: 'error',
                message:
                  'Unable to fetch the details. Try to refresh the page or come back later.'
              };
              this.props.getMessageToShow(messageObj);
            } else if (
              transactionDetails !== undefined &&
              transactionDetails.trackingOrder.length !== 0
            ) {
              //set client name and phone for customer support message
              this.setState({clientCode: transactionDetails.trackingOrder[0].clientCode});
              this.setState({mscPhone: transactionDetails.trackingOrder[0].msc_phone_number});

              this.setState({
                schedulerOrdType:
                  transactionDetails.scheduleTransactionDetail !== undefined ||
                  transactionDetails.scheduleTransactionDetail !== null
                    ? transactionDetails.scheduleTransactionDetail
                        .scheduleOrderType
                    : 0
              });

              if (
                transactionDetails.scheduleTransactionDetail
                  .scheduleOrderType === 4
              ) {
                //Normal orders
                this.setState({ stepNum: 1 });
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
            }
          }
          this.setState({ startSpinner: false });
        });
    } else {
      this.props.history.push('/');
    }
  }

  next = e => {
    return this.updateScheduleDate().then(result => {
      if (result.payload && result.payload.status === 200) {
        return result.payload.data.serviceResponse;
      } else if (result.error === true) {
        var messageObj = {
          alertType: 'error',
          message: 'Technical issues please retry later'
        };
        this.props.getMessageToShow(messageObj);
      }
    });
  };

  disableButton = flag => {
    this.setState({
      isManualSchedule: flag
    });
  };

  render() {
    return (
      <div style={{ minHeight: '100vh' }} ref={this.topScroll}>
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
              clientCode={this.state.clientCode}
              mscPhone={this.state.mscPhone}
            />
          </Col>
          <Col sm="2" />
        </Row>

        <br />

        <Row style={{ marginBottom: '20px' }}>
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
              <br />
              {!this.state.errorFlag && (
                <div>
                  <ScheduleForm
                    disableButton={this.disableButton}
                    shareMethods={this.acceptMethods}
                    history={this.props.history}
                  />
                  <PageNavigation
                    nextPage={this.next}
                    prevPage={this.previous}
                    currentPageValue={this.props.location.pathname.replace(
                      '/',
                      ''
                    )}
                    transactionRef={this.state.transactionID}
                    history={this.props.history}
                    isManualSchedule={this.state.isManualSchedule}
                    transactionDetails={this.props.transactionDetails}
                  />
                </div>
              )}
              <br />
              <div className="centerAlign">
                <label
                  style={{
                    fontFamily: 'Alegreya Sans',
                    fontWeight: 'bold',
                    textAlign: 'left'
                  }}
                >
                  <p className="paraStyle">
                    On the evening prior to delivery you will receive an
                    automated call with a two hour delivery window.
                  </p>
                </label>
              </div>
            </Card>
          </Col>
          <Col sm="2" />
        </Row>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ getTransactionDetails, getMessageToShow }, dispatch)
  };
};

function mapStateToProps(state) {
  return {
    transactionDetails: state.transactionDetails
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
