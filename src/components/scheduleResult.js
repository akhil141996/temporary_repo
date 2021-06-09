import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelfSchedulerHeader from '../containers/common/self_scheduler_header';
import { getTransactionDetails, getMessageToShow } from '../actions/index';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/self_scheduler/_scheduleResult.scss';
import { apiRepo } from '../repository/apiRepo';
import { Line } from 'rc-progress';
import { TrackingSpinner } from '../containers/common/tracking_spinner';
import {
  clearSessionStorage,
  getTransactionRef
} from '../containers/common/innovel_util';

class ScheduleResult extends Component {
  constructor(props) {
    super(props);
    this.topReference = React.createRef();
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
  }

  componentDidMount() {
    this.topReference.current.scrollIntoView();
    if (
      this.state.transactionID === '' ||
      this.state.transactionID === undefined ||
      this.state.transactionID === null
    ) {
      var messageObj = {
        alertType: 'error',
        message:
          'Unable to fetch the details. Try to refresh the page or come back later. Redirecting to homepage!'
      };
      this.props.getMessageToShow(messageObj);
      setInterval(() => this.props.history.push('/'), 4000);
    } else {
      //Get the support number before submitting the schedule request
      this.getSupportNumber();

      this.setState({
        percent: 1,
        orderComplete: false,
        progressText: ''
      });
      this.timer1 = setInterval(() => this.getItems(), 1000);      
      this.timer2 = setInterval(() => this.setLimit(), 35000);
    }
  }

  getItems = () => {
    if (this.state.orderComplete !== true) {
      apiRepo
        .serviceCall(
          'get',
          `/v2/schedule/getStatus/${this.state.transactionID}`
        )
        .then(result => {
          let percent;
          let text;
          let orderComplete = false;
          if (result.status === 200) {
            
            if (result.data.serviceResponse.statusId === 7) {
              if (this.state.percent < 20) {
                percent = this.state.percent + 15;
                text = 'Started Scheduling...';
              }

              if (20 < this.state.percent < 80) {
                const completedOrders = result.data.serviceResponse.submitOrderResult.filter(
                  order => order.statusId === 9 || order.statusId === 11
                );
                if (completedOrders.length > 0) {
                  let noOfOrders =
                    result.data.serviceResponse.submitOrderResult.length;
                  let noOfCompletedOrders = completedOrders.length;
                  let percentIncrease = 50 / noOfOrders * noOfCompletedOrders;
                  percent = this.state.percent + percentIncrease;
                  text =
                    'Submitting Orders... ' +
                    noOfCompletedOrders +
                    '/' +
                    noOfOrders +
                    ' Completed.';
                } else if (
                  completedOrders.length === 0 &&
                  this.state.percent < 70
                ) {
                  percent = this.state.percent + 5;
                  text = 'Submitting Orders... ';
                }
              }
            } else if (
              result.data.serviceResponse.statusId === 9 ||
              result.data.serviceResponse.statusId === 11
            ) {
              let message = result.data.serviceResponse.description;
              // if (result.data.serviceResponse.statusId === 9) {
              //   const successfulOrders = result.data.serviceResponse.submitOrderResult.filter(
              //     order => order.statusId === 9 || order.statusId === 11
              //   );
              //   if (
              //     successfulOrders.length ===
              //     result.data.serviceResponse.submitOrderResult.length
              //   ) {
              //     message =
              //       'You have successfully scheduled your delivery! You will shortly receive a confirmation Email confirming your transaction!';
              //   } else {
              //     message =
              //       'You have partially scheduled your delivery! You will shortly receive a confirmation Email confirming your transaction.Please try again for unscheduled orders.';
              //   }
              // } else if (result.data.serviceResponse.statusId === 11) {
              //   message =
              //     'There was an error in scheduling your order.Please try again later.';
              // }
              let messageObj = {
                alertType:
                  result.data.serviceResponse.statusId === 9
                    ? 'success'
                    : 'error',
                message: message
              };
              this.props.getMessageToShow(messageObj);
              percent = 100;
              text =
                'Completed Scheduling. ' +
                result.data.serviceResponse.submitOrderResult.length +
                ' Order/s Processed. Check Status Below.';
              orderComplete = true;
              clearSessionStorage();
            }
            if (percent) {
              this.setState({
                orderComplete: orderComplete,
                percent: percent,
                progressText: text,
                orders: result.data.serviceResponse.submitOrderResult
              });
            }
          }
        });
    }
  };

  getSupportNumber = () => {
    if(!this.state.orderComplete)
    {
      this.props.getTransactionDetails(this.state.transactionID, 5)
      .then(result =>{
        if(result.payload.status === 200)
        {
          let scheduleResult = result.payload.data.serviceResponse;
          this.setState({clientCode: scheduleResult.trackingOrder[0].clientCode})
          this.setState({mscPhone: scheduleResult.trackingOrder[0].msc_phone_number})
        }
      });
    }
  }

  setLimit = () => {
    if (!this.state.orderComplete) {
      this.setState({
        orderComplete: true,
        percent: 100,
        progressText: 'Technical Error! Please retry later'
      });
      let messageObj = {
        alertType: 'error',
        message: 'Something went wrong! Please try again at a later time!'
      };
      this.props.getMessageToShow(messageObj);
    }
  };

  componentDidUpdate(prevState, prevProps) {
    if (prevState.orderComplete !== true && this.state.orderComplete === true) {
      clearInterval(this.timer1);
      clearInterval(this.timer2);
      this.timer = null;
    }
  }

  handleCheckbox = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="scheduleResultMainContainer" ref={this.topReference}>
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="self_scheduler_header">
          <SelfSchedulerHeader 
          landingPage={false} 
          schedulerOrdType={4} 
          clientCode={this.state.clientCode}
          mscPhone ={this.state.mscPhone}
          />
        </div>
        <div className="container reportMainContainer">
          <div className="row">
            <div className="col">
              <div className="mainProgressContainer">
                <Line
                  percent={this.state.percent}
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeColor="#2db7f5"
                />
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col">
              <div className="mainTextContainer">{this.state.progressText}</div>
            </div>
          </div>
          <br />
          <br />

          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="table-responsive">
              {this.state.orders && (
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Tracking Number</th>
                      <th scope="col">Order Status</th>
                      <th scope="col">Confirmation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.orders.map((order, index) => {
                      let orderStatus;
                      let orderConfirmation;
                      let spinner;
                      if (order.statusId === 7) {
                        orderStatus = 'Scheduling In Process';
                        orderConfirmation = ' - ';
                        spinner = <TrackingSpinner />;
                      } else if (order.statusId === 9) {
                        orderConfirmation = order.description.match(
                          / # is ([A-Z0-9]+)/
                        )[1];
                        orderStatus = 'Successfully Scheduled';
                        spinner = (
                          <input
                            type="checkbox"
                            defaultChecked
                            onClick={this.handleCheckbox}
                          />
                        );
                      } else if (order.statusId === 11) {
                        orderStatus =
                          'Scheduling Failed! Try this order again later';
                        orderConfirmation = 'No confirmation number available';
                        spinner = (
                          <input
                            onClick={() => this.handleCheckbox()}
                            type="checkbox"
                          />
                        );
                      }
                      return (
                        <tr key={index} style={{fontSize: "0.8em"}}>
                          <th scope="row" key={index} align="center">
                            {spinner}
                          </th>
                          <td key={index + 1}>{order.trackingNbr}</td>
                          <td key={index + 2}>{orderStatus}</td>
                          <td key={index + 3}>{orderConfirmation}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
        </div>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ScheduleResult)
);
