import React, { Component } from 'react';
import { Button } from 'reactstrap';
import _ from 'lodash';
import { TrackingSpinner } from './tracking_spinner';
import styles from '../../styles.css.js';
import { getTrackingNumber } from './innovel_util';

export class PageNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerRef: '',
      orderComplete: false,
      spinTheSpinner: false,
      displayMsg: '',
      buttonName: ''
    };
  }

  setUpNavigation = serviceResponse => {
    const navigation = _.entries(serviceResponse.pageNavigation);
    let currentPostion = this.findPagePosition(
      navigation,
      this.props.currentPageValue
    );
    let nextPage = this.findPageName(navigation, currentPostion + 1);
    let prevPage = this.findPageName(navigation, currentPostion - 1);
    let finalPage = this.isFinalPage(navigation, currentPostion);
    let firstPage = this.isFirstPage(navigation, currentPostion);
    let complete = this.isOrderComplete(serviceResponse.transactionStatus);
    if (!this.isNextPageReady(nextPage, serviceResponse)) {
      nextPage = 'not available';
    }

    this.setState({
      nextPageValue: nextPage,
      prevPageValue: prevPage,
      currentPostion: currentPostion,
      customerRef: this.props.transactionRef,
      isFinalPage: finalPage,
      isFirstPage: firstPage,
      orderComplete: complete
    });
  };
  findPagePosition = (myArray, value) => {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i][0] === value) {
        return myArray[i][1];
      }
    }
  };
  findPageName = (myArray, value) => {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i][1] === value) {
        return myArray[i][0];
      }
    }
  };
  isFinalPage = (myArray, value) => {
    if (myArray.length === value + 1) return true;
    return false;
  };
  isFirstPage = (myArray, value) => {
    if (value === 0) return true;
    return false;
  };

  isNextPageReady = (pageName, transactionDetails) => {
    //Need to refactor based on the order type
    if (transactionDetails.scheduleOrderType === 4) {
      this.setState({ buttonName: 'Schedule' });
      if (pageName === 'tracking_measure') {
        if (transactionDetails.schedule) {
          return true;
        }
      } else if (pageName === 'tracking_confirmation') {
        if (transactionDetails.deliveryDetail && transactionDetails.schedule) {
          return true;
        }
      }
    } else if (transactionDetails.scheduleOrderType === 5) {
      this.setState({ buttonName: 'Submit' });
      if (pageName === 'tracking_confirmation') {
        if (transactionDetails.deliveryDetail) {
          return true;
        }
      }
    }
    return false;
  };

  isOrderComplete = status => {
    if (status === 2 || status === 7) {
      return false;
    }
    return true;
  };

  componentDidMount() {
    //Remove the below mentioned api call and use the api call in schedule.js to inject serviceResponse as props to this component
    //if (this.props.transactionDetails) {
    // apiRepo
    //   .serviceCall(
    //     'get',
    //     '/v1/schedule/gettransdetails/transactionref/' +
    //       this.props.transactionRef
    //   )
    //   .then(json => {
    //     this.setState({
    //       transactionDetails: json.data.serviceResponse
    //     });
    //     this.setUpNavigation(json.data.serviceResponse);
    //   });
    // this.setUpNavigation(
    //   this.props.transactionDetails.scheduleTransactionDetail
    // );
    //} else {
    // let serviceResponse = {
    //   schedule: false,
    //   deliveryDetail: false,
    //   confirmation: false
    // };
    // this.setState({
    //   transactionDetails: serviceResponse
    // });
    // this.setUpNavigation(serviceResponse);
    //}
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isManualSchedule !== this.props.isManualSchedule)
      this.setState({
        isManualSchedule: this.props.isManualSchedule
      });
    if (prevProps.disableNextButton !== this.props.disableNextButton) {
      this.setState({
        disableNextButton: this.props.disableNextButton
      });
    }
    if (
      this.props.transactionDetails &&
      prevProps.transactionDetails.scheduleTransactionDetail !==
        this.props.transactionDetails.scheduleTransactionDetail
    ) {
      try {
        this.setUpNavigation(
          this.props.transactionDetails.scheduleTransactionDetail
        );
        this.setState({
          transactionDetails: this.props.transactionDetails
            .scheduleTransactionDetail
        });
      } catch (Error) {
        console.log(Error);
        this.props.history.push('/');
      }
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if(this.props.transactionRef){
  //   apiRepo.serviceCall('get','/v1/order/transaction/detail/'+this.props.transactionRef)
  //   .then((json) => {
  //     this.setState({
  //       transactionDetails :json.data.serviceResponse,
  //       });
  //       this.setUpNavigation(json.data.serviceResponse);
  //     });
  //   }
  //   else {
  //
  //       let serviceResponse={
  //                 companyId:null,
  //                 customer:false,
  //                 customerId:null,
  //                 deliveryDetail:false,
  //                 order:false,
  //                 orderNumber:null,
  //                 orderType:0,
  //                 pageNavigation:null,
  //                 schedule:false,
  //                 transactionStatus:null,
  //       };
  //       this.setState({
  //         transactionDetails :serviceResponse,
  //         });
  //         this.setUpNavigation(serviceResponse);
  //     }
  // }

  next = e => {
    this.setState({ spinTheSpinner: true });
    if (this.props.transactionRef) {
      this.props
        .nextPage(this.state.nextPageValue)
        .then(result => {
          if (result) {
            this.setUpNavigation(result.scheduleTransactionDetail);
            this.setState({
              spinTheSpinner: false
            });
            this.props.history.push(this.state.nextPageValue);
          } else {
            this.setState({
              spinTheSpinner: false
            });
          }
        })
        .catch(Error => {
          this.setState({
            spinTheSpinner: false
          });
        });
    }
  };

  previous = e => {
    this.setState({ spinTheSpinner: true });
    if (this.state.isFirstPage) {
      this.props.history.push('selfschedule?order=' + getTrackingNumber());
    } else {
      this.setUpNavigation(
        this.props.transactionDetails.scheduleTransactionDetail
      );
      this.setState({
        spinTheSpinner: false
      });

      this.props.history.push(this.state.prevPageValue);
    }
  };

  schedule = e => {
    this.setState({ spinTheSpinner: true });
    if (this.props.transactionRef) {
      this.props
        .scheduleCall()
        // .then(result => {
        //   if (this.state.spinTheSpinner) {
        //     this.setState({ spinTheSpinner: false });
        //   }
        //   // this.setState({
        //   //   spinTheSpinner: false,
        //   //   isManualSchedule: true
        //   // });
        // })
        .catch(Error => {
          console.log('error: ', Error);
          this.setState({
            spinTheSpinner: false
          });
        });
    }
  };

  render() {
    return (
      <div>
        <div style={styles.onlyFontstyleElement}>
          <Button
            style={(styles.onlyFontstyleElement, { marginRight: '10px' })}
            color="primary"
            size="lg"
            active
            onClick={this.previous}
            disabled={this.props.disableFinish}
            hidden={this.state.orderComplete}
          >
            Previous
          </Button>

          {!this.state.isFinalPage ? (
            <Button
              style={styles.onlyFontstyleElement}
              color="primary"
              size="lg"
              active
              onClick={this.next}
              disabled={
                this.state.disableNextButton === true ||
                this.state.isManualSchedule === true
              }
            >
              Next
            </Button>
          ) : (
            ''
          )}
          {this.state.isFinalPage ? (
            <Button
              style={styles.onlyFontstyleElement}
              color="primary"
              size="lg"
              active
              onClick={this.schedule}
              disabled={
                this.state.isManualSchedule ||
                this.state.disableNextButton === true ||
                this.props.disableScheduleButton
              }
            >
              {this.state.buttonName}
            </Button>
          ) : (
            ''
          )}
        </div>
        <div>{this.state.spinTheSpinner && <TrackingSpinner />}</div>
      </div>
    );
  }
}
