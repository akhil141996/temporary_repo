import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/self_scheduler/_schedulerPage.scss';
import {
  updateScheduleDetails,
  createScheduleDetails
} from '../../actions/index';
import { TrackingSpinner } from '../common/tracking_spinner';
import { setPromise, getTransactionRef } from '../common/innovel_util';

var greenDates = [];
var redDates = [];
export class ScheduleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startSpinner: true,
      deliveryMsg: false,
      alertErrorMsg: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.props.shareMethods(this.updateScheduleDate.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.transactionDetails.availableDates !==
      this.props.transactionDetails.availableDates
    ) {
      var values = this.props.transactionDetails.availableDates;

      var arr = _.values(values);
      for (var i = 0; i < this.props.transactionDetails.stockThreshold; i++) {
        greenDates[i] = moment(arr[i], 'YYYY-MM-DD');
      }
      // for (
      //   var j = this.props.transactionDetails.stockThreshold;
      //   j < arr.length;
      //   j++
      // ) {
      //   redDates[j - this.props.transactionDetails.stockThreshold] = moment(
      //     arr[j],
      //     'YYYY-MM-DD'
      //   );
      // }
      if (
        !(
          this.props.transactionDetails.scheduleDate === null ||
          this.props.transactionDetails.scheduleDate === undefined
        )
      ) {
        this.setState({
          availableDates: this.props.transactionDetails.availableDates,
          scheduledDate: moment(
            this.props.transactionDetails.scheduleDate,
            'YYYY-MM-DD'
          ),
          highlightDates: greenDates,
          showFlag: true,
          startSpinner: false,
          deliveryMsg: true,
          schDate: this.props.transactionDetails.scheduleDate,
          redHighlightedDate: redDates,
          reschedule: true,
          custService: this.props.transactionDetails.custService,
          sDate: this.props.transactionDetails.scheduleDate,
          stockThreshold: this.props.transactionDetails.stockThreshold
        });
      } else {
        this.setState({
          availableDates: this.props.transactionDetails.availableDates,
          scheduledDate: greenDates[0],
          highlightDates: greenDates,
          showFlag: true,
          startSpinner: false,
          redHighlightedDate: redDates,
          reschedule: false,
          custService: this.props.transactionDetails.custService,
          sDate: this.props.transactionDetails.scheduleDate,
          stockThreshold: this.props.transactionDetails.stockThreshold
        });
      }
    }
  }

  handleChange(date) {
    var datesflag = false;
    var warnflag = false;
    for (var i = 0; i < greenDates.length; i++) {
      var tempDate = greenDates[i];
      if (tempDate.isSame(date)) {
        datesflag = true;
        break;
      }
    }
    if (datesflag) {
      this.props.disableButton(warnflag);
      let messageObj = { alertType: 'reset', message: '' };
      this.setState({ alertErrorMsg: messageObj.message });
      this.setState({
        scheduledDate: date,
        showFlag: true,
        warnflag: false
      });
    } else {
      for (let i = 0; i < redDates.length; i++) {
        let tempDate = redDates[i];
        if (tempDate.isSame(date)) {
          warnflag = true;
          break;
        }
      }
      if (warnflag) {
        this.props.disableButton(warnflag);
        if (
          this.state.custService === undefined ||
          this.state.custService === null
        ) {
          let messageObj = {
            alertType: 'error',
            message:
              'Unable to fetch the contact number details. Try to refresh the page or come back later.'
          };
          this.setState({ alertErrorMsg: messageObj.message });
        } else {
          this.setState({
            warnflag: true,
            scheduledDate: null
          });
          let messageObj = {
            alertType: 'error',
            message:
              'Please call customer service ' +
              this.state.custService +
              'to schedule a date marked red.'
          };
          this.setState({ alertErrorMsg: messageObj.message });
        }
      } else {
        let messageObj = {
          alertType: 'error',
          message: 'Please choose an available date in GREEN.'
        };
        this.setState({ alertErrorMsg: messageObj.message });
        this.setState({
          showFlag: false,
          scheduledDate: date
        });
      }
    }
  }

  handleSubmit(e) {
    //  e.preventDefault();
    //  let main = this.state.startDate
    console.log('habdlSubmit call');
  }

  isDatePresentInList(selectedDate) {
    var flag = false;
    for (var i = 0; i < greenDates.length; i++) {
      if (moment(greenDates[i]).format('YYYY-MM-DD') === selectedDate) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  updateScheduleDate = () => {
    const trans = getTransactionRef();
    if (trans === '' || trans === undefined || trans === null) {
      this.props.history.push('/');
    } else {
      var submitValues;
      submitValues = {
        ...submitValues,
        scheduleDate: moment(this.state.scheduledDate).format('YYYY-MM-DD')
      };
      submitValues = {
        ...submitValues,
        transactionRef: getTransactionRef()
      };
      submitValues = {
        ...submitValues,
        firstAvailableDate: moment(this.state.highlightDates[0]).format(
          'YYYY-MM-DD'
        )
      };
      if (this.state.reschedule) {
        if (
          !this.isDatePresentInList(
            moment(this.state.scheduledDate).format('YYYY-MM-DD')
          )
        ) {
          var messageObj = {
            alertType: 'error',
            message: 'Please choose an available date in GREEN.'
          };
          this.setState({ alertErrorMsg: messageObj.message });
          return setPromise(false);
        } else {
          return this.props
            .updateScheduleDetails(submitValues)
            .then(response => {
              return response;
            })
            .catch(Error => {
              var messageObj = {
                alertType: 'error',
                message:
                  'Error in updating schedule entry details. Please try again.'
              };
              this.setState({ alertErrorMsg: messageObj.message });
            });
        }
      } else {
        if (
          !this.isDatePresentInList(
            moment(this.state.scheduledDate).format('YYYY-MM-DD')
          )
        ) {
          const messageObj = {
            alertType: 'error',
            message: 'Please choose an available date in GREEN.'
          };
          this.setState({ alertErrorMsg: messageObj.message });
          return setPromise(false);
        } else {
          return this.props
            .createScheduleDetails(submitValues)
            .then(response => {
              return response;
            })
            .catch(Error => {
              var messageObj = {
                alertType: 'error',
                message:
                  'Error in creating schedule entry details. Please try again.'
              };
              this.setState({ alertErrorMsg: messageObj.message });
            });
        }
      }
    }
  };

  render() {
    const highlightWithRanges = [
      {
        'react-datepicker__day--highlighted-custom-1': this.state.highlightDates
      },
      {
        'react-datepicker__day--highlighted-custom-2': this.state
          .redHighlightedDate
      }
    ];
    return (
      <div className="container" style={{ minHeight: '30vh' }}>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <div>{this.state.startSpinner && <TrackingSpinner />}</div>
            <div style={{ minHeight: '20vh' }}>
              {this.state.alertErrorMsg && (
                <p className="alert alert-danger fade show">{this.state.alertErrorMsg}</p>
              )}
              {!this.state.startSpinner &&
                this.state.deliveryMsg && (
                  <div>
                    Your Delivery is scheduled on {this.state.schDate}
                    <br />
                    <br />
                    <DatePicker
                      placeholderText="Click to select a date"
                      selected={this.state.scheduledDate}
                      inline
                      onChange={this.handleChange}
                      monthsShown={2}
                      highlightDates={highlightWithRanges}
                      dateFormat="MM/DD/YYYY"
                    />
                  </div>
                )}
              {!this.state.startSpinner &&
                !this.state.deliveryMsg && (
                  <div>
                    Your Current Selected Date is{' '}
                    {moment(this.state.scheduledDate).format('YYYY-MM-DD')}
                    <br />
                    <br />
                    <DatePicker
                      placeholderText="Click to select a date"
                      selected={this.state.scheduledDate}
                      inline
                      onChange={this.handleChange}
                      monthsShown={2}
                      highlightDates={highlightWithRanges}
                      dateFormat="MM/DD/YYYY"
                    />
                  </div>
                )}
            </div>
            <div>
              <b>Click on GREEN highlighted dates.</b>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    transactionDetails: state.transactionDetails
  };
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      { updateScheduleDetails, createScheduleDetails },
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleForm);
