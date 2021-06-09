import React, { Component } from 'react';
import { Card, Row, Col, Input } from 'reactstrap';
import VideoModal from './videomodal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { apiRepo } from '../../repository/apiRepo';
import '../../styles/_deliveryform.scss';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../styles/_font.scss';
import { getTransactionDetails } from '../../actions/index';
import {
  setPromise,
  str2bool,
  phoneNoFormat,
  getTransactionRef
} from '../common/innovel_util';
import Image2 from '../../images/deliveryDetails_3.png';

export class DeliveryDetailsForm extends Component {
  constructor(props) {
    super(props);
    const transID = getTransactionRef();
    this.errorMsgRef = React.createRef();
    this.state = {
      gated: false,
      isOpen: false,
      transactionID: transID,
      isDelDetToUpdate: false,
      isValidForm: false,
      loading: false,
      schedulerOrdType: 0,
      allOrders: [],
      alertErrorMsg: null
    };

    const script = document.createElement('script');
    script.src = '';
    script.async = true;
    document.body.appendChild(script);
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) this.closeModal();
    });
    this.props.shareMethods(this.storeDeliveryDetails.bind(this));
  }

  componentDidMount() {
    //Checking if there is a service response with the assumption
    //that subOrderDeliveryDetailsList will come through if there is a response
    if (
      this.props.transactionDetails !== null &&
      this.props.transactionDetails !== undefined
    ) {
      //Null checks and check for deliveryDetails
      if (
        this.props.transactionDetails.orderDeliveryDetails !== null &&
        this.props.transactionDetails.orderDeliveryDetails !== undefined &&
        this.props.transactionDetails.scheduleTransactionDetail
          .deliveryDetail === true
      ) {
        const OrdDelDetails = this.props.transactionDetails
          .orderDeliveryDetails;

        var replacementFlCheckedOrders = OrdDelDetails.subOrderDeliveryDetailsList.filter(
          subOrder => subOrder.replacementOrderFl === true
        );

        var haulAwayFlCheckedOrders = OrdDelDetails.subOrderDeliveryDetailsList.filter(
          subOrder => subOrder.haulAwayFl === true
        );

        var haulAvailableCheckedOrders = OrdDelDetails.subOrderDeliveryDetailsList.filter(
          subOrder => subOrder.haulAvailable === true
        );

        var haulAwayValue;
        if (this.props.transactionDetails.trackingOrder.length === 1) {
          haulAwayValue = OrdDelDetails.subOrderDeliveryDetailsList[0].haulAway;
        } else {
          if (haulAwayFlCheckedOrders.length > 0) {
            haulAwayValue = 1;
          } else {
            haulAwayValue = 0;
          }
        }

        //Loop through and check if haul available false and set order level flags
        let subOrderDeliveryDetailsList = OrdDelDetails.subOrderDeliveryDetailsList.map(
          subOrder => {
            if (subOrder.haulAvailable === false) {
              subOrder.haulAwayFl = false;
              subOrder.haulAway = 0;
            }
            return subOrder;
          }
        );

        //Checking if atleast one parent level dryYes flag is true in every trackingOrder
        var dryYes = false;
        this.props.transactionDetails.trackingOrder.map(order => {
          if (order.orderDeliveryDetails.dryYes === true) {
            dryYes = true;
          }
        });

        //Checking if atleast one parent level dryYes flag is true in every trackingOrder
        var gasRq = false;
        this.props.transactionDetails.trackingOrder.map(order => {
          if (order.orderDeliveryDetails.dryYes === true) {
            gasRq = true;
          }
        });

        this.setState({
          schedulerOrdType:
            this.props.transactionDetails.scheduleTransactionDetail !==
              undefined ||
            this.props.transactionDetails.scheduleTransactionDetail !== null
              ? this.props.transactionDetails.scheduleTransactionDetail
                  .scheduleOrderType
              : 0,
          //Assumption that subOrderDeliveryDetailsList is available
          subOrderDeliveryDetailsList: subOrderDeliveryDetailsList
        });

        //Finish setting state
        this.setState({
          validPhone: OrdDelDetails.validPhone,
          phone: phoneNoFormat(OrdDelDetails.updatedShipToPhone),
          phoneSubmit: OrdDelDetails.updatedShipToPhone,
          shipToPhone: this.props.transactionDetails.shipToPhone,
          gated: OrdDelDetails.gated,
          gatedFl: OrdDelDetails.gatedFl,
          newlyBuilt: OrdDelDetails.newlyBuilt,
          newlyBuiltFl: OrdDelDetails.newlyBuiltFl,
          largeTruckAccessFl: OrdDelDetails.largeTruckAccessFl,
          replacementOrderFl:
            replacementFlCheckedOrders.length > 0 ? true : false,
          reverseDoorFl: OrdDelDetails.reverseDoorFl,
          shutOffValveFl: OrdDelDetails.shutOffValveFl,
          haulAway: haulAwayFlCheckedOrders.length > 0 ? true : false,
          haulAwayValue: haulAwayValue,
          haulAvailable: haulAvailableCheckedOrders.length > 0 ? true : false,
          isDelDetToUpdate: this.props.transactionDetails
            .scheduleTransactionDetail.deliveryDetail,
          dryYes: dryYes,
          gasRq: gasRq,
          brownBoxFl: false,
          allOrders: this.props.transactionDetails.trackingOrder
        });
      } else {
        this.setState({
          validPhone: '',
          phone: '',
          phoneSubmit: this.props.transactionDetails.orderDeliveryDetails.updatedShipToPhone,
          shipToPhone: this.props.transactionDetails.shipToPhone,
          gated: '',
          gatedFl: '',
          newlyBuilt: '',
          newlyBuiltFl: '',
          largeTruckAccessFl: '',
          replacementOrderFl:
            replacementFlCheckedOrders.length > 0 ? true : false,
          reverseDoorFl: '',
          shutOffValveFl: '',
          haulAway: haulAwayFlCheckedOrders.length > 0 ? true : false,
          haulAwayValue: haulAwayValue,
          brownBoxFl: '',
          haulAvailable: haulAvailableCheckedOrders.length > 0 ? true : false,
          isDelDetToUpdate: this.props.transactionDetails
            .scheduleTransactionDetail.deliveryDetail,
          dryYes: dryYes,
          gasRq: gasRq,
          allOrders: this.props.transactionDetails.trackingOrder
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(!!this.state.alertErrorMsg && prevState.alertErrorMsg !== this.state.alertErrorMsg) {
      this.errorMsgRef.current.scrollIntoView(false);
    }
  }

  openModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  handleQ0Change = e => {
    this.setState({
      validPhone: e.target.value,
      phone: undefined
    });
  };

  handlePhoneChange = e => {
    this.setState({
      phone: phoneNoFormat(e.target.value)
    });
    var phoneno = /[(][0-9]{3}[)][0-9]{3}[-][0-9]{4}/;
    if (e.target.value.match(phoneno)) {
      this.setState({
        phoneError: '',
        phoneSubmit:
          e.target.value.substring(1, 4) +
          e.target.value.substring(5, 8) +
          e.target.value.substring(9, 13)
      });
    } else {
      this.setState({
        phoneError: 'Please enter a valid phone'
      });
    }
  };

  handleQ1Change = e => {
    this.setState({
      gatedFl: str2bool(e.target.value)
    });
  };

  handleGatedChange = e => {
    this.setState({
      gated: e.target.value
    });
  };

  handleQ2Change = e => {
    this.setState({
      newlyBuiltFl: str2bool(e.target.value)
    });
  };

  handleNewlyBuiltChange = e => {
    this.setState({
      newlyBuilt: e.target.value
    });
  };

  handleQ3Change = e => {
    this.setState({
      largeTruckAccessFl: str2bool(e.target.value)
    });
  };

  handleQ4Change = e => {
    //Changing parent level state based on UI
    this.setState({
      replacementOrderFl: str2bool(e.target.value)
    });

    if (str2bool(e.target.value) === false) {
      //Reseting individual order replacementOrderFl state to false if parent level state change is false
      let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
        (subOrder, index) => {
          return { ...subOrder, replacementOrderFl: false };
        }
      );

      this.setState({
        subOrderDeliveryDetailsList: subOrderDeliveryDetailsList
      });
    } else {
      //Setting individual order haulAway and replacement state based on parent level state change
      if (this.state.allOrders.length === 1) {
        let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
          (subOrder, index) => {
            return {
              ...subOrder,
              replacementOrderFl: true,
              haulAwayFl: false,
              haulAway: 0
            };
          }
        );
        //Setting parent level haulAway state based on parent level replacementOrderFl change
        this.setState({
          subOrderDeliveryDetailsList: subOrderDeliveryDetailsList,
          haulAway: false,
          haulAwayValue: 0
        });
      }

      //Checking for total number of replacement Orders
      let noOfReplacementOrders = 0;
      this.state.subOrderDeliveryDetailsList.map((subOrder, index) => {
        if (subOrder.replacementOrderFl === true) {
          noOfReplacementOrders++;
        }
      });

      if (noOfReplacementOrders === this.state.allOrders.length) {
        let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
          (subOrder, index) => {
            return {
              ...subOrder,
              replacementOrderFl: true,
              haulAwayFl: false,
              haulAway: 0
            };
          }
        );
        this.setState({
          subOrderDeliveryDetailsList: subOrderDeliveryDetailsList,
          haulAway: false,
          haulAway: 0
        });
      }
    }
  };

  handleQ5Change = e => {
    //Setting parent level haulAway flag state
    this.setState({
      haulAway: str2bool(e.target.value)
    });

    //Setting individual order haulAway state based on parent level state change
    if (str2bool(e.target.value) === false) {
      let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
        (subOrder, index) => {
          return { ...subOrder, haulAwayFl: false, haulAway: 0 };
        }
      );

      this.setState({
        subOrderDeliveryDetailsList: subOrderDeliveryDetailsList,
        haulAway: false,
        haulAwayValue: 0
      });
    } else {
      //Setting individual orderlevel haulAway fl state
      if (this.state.allOrders.length === 1 && !this.state.replacementOrderFl) {
        let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
          (subOrder, index) => {
            return {
              ...subOrder,
              haulAwayFl: true
            };
          }
        );
        this.setState({
          subOrderDeliveryDetailsList: subOrderDeliveryDetailsList
        });
      } else {
        this.setState({
          haulAwayValue: 1
        });
      }
    }
  };

  //Method to handle single order flow, haulAway value change
  handleHaulAwayChange = e => {
    this.setState({
      haulAwayValue: parseInt(e.target.value)
    });

    if (this.state.allOrders.length === 1) {
      let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
        (subOrder, index) => {
          return {
            ...subOrder,
            haulAwayFl: true,
            haulAway: parseInt(e.target.value)
          };
        }
      );
      this.setState({
        subOrderDeliveryDetailsList: subOrderDeliveryDetailsList
      });
    }
  };

  handleQ8Change = e => {
    this.setState({
      reverseDoorFl: str2bool(e.target.value)
    });
  };

  handleQ9Change = e => {
    this.setState({
      shutOffValveFl: str2bool(e.target.value)
    });
  };

  handleQ10Change = e => {
    this.setState({
      brownBoxFl: false
    });
  };

  //Bulk order flow, individual order replacementFl event handler
  handleOrderLevelReplacementOrderFlChange = e => {
    let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
      (subOrder, index) => {
        if (e.target.getAttribute('data-index') === index.toString()) {
          if (
            subOrder.replacementOrderFl === undefined ||
            subOrder.replacementOrderFl === false ||
            subOrder.replacementOrderFl === 'false'
          ) {
            subOrder.haulAwayFl = false;
            subOrder.haulAway = 0;
            subOrder.replacementOrderFl = true;
          } else {
            subOrder.replacementOrderFl = false;
          }
        }
        return subOrder;
      }
    );
    let replacementFlCheckedOrders = subOrderDeliveryDetailsList.filter(
      subOrder => subOrder.replacementOrderFl === true
    );

    if (replacementFlCheckedOrders.length > 0) {
      this.setState({
        replacementOrderFl: true
      });
    } else {
      this.setState({
        replacementOrderFl: false
      });
    }

    let haulAwayFlCheckedOrders = subOrderDeliveryDetailsList.filter(
      subOrder => subOrder.haulAwayFl === true
    );

    if (haulAwayFlCheckedOrders.length > 0) {
      this.setState({
        haulAway: true
      });
    } else {
      this.setState({
        haulAway: false
      });
    }

    if (replacementFlCheckedOrders.length === this.state.allOrders.length) {
      this.setState({
        haulAway: false,
        haulAway: 0
      });
    }

    this.setState({ subOrderDeliveryDetailsList: subOrderDeliveryDetailsList });
  };

  //Bulk order flow, individual order haulAway Fl event handler
  handleOrderLevelHaulawayFlChange = e => {
    let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
      (subOrder, index) => {
        if (e.target.getAttribute('data-index') === index.toString()) {
          if (
            subOrder.haulAwayFl === undefined ||
            subOrder.haulAwayFl === false ||
            subOrder.haulAwayFl === 'false'
          ) {
            subOrder.haulAwayFl = true;
          } else {
            subOrder.haulAwayFl = false;
          }
        }
        return subOrder;
      }
    );

    let haulAwayFlCheckedOrders = subOrderDeliveryDetailsList.filter(
      subOrder => subOrder.haulAwayFl === true
    );

    if (haulAwayFlCheckedOrders.length > 0) {
      this.setState({
        haulAway: true,
        haulAwayValue: 1
      });
    } else {
      this.setState({
        haulAway: false,
        haulAwayValue: 0
      });
    }
    this.setState({ subOrderDeliveryDetailsList: subOrderDeliveryDetailsList });
  };

  //Bulk order flow, individual order haulAway value event handler
  handleOrderLevelHaulAwayValueChange = e => {
    let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
      (subOrder, index) => {
        if (e.target.getAttribute('data-index') === index.toString()) {
          subOrder.haulAway = parseInt(e.target.value);
          return subOrder;
        } else {
          return subOrder;
        }
      }
    );
    this.setState({ subOrderDeliveryDetailsList: subOrderDeliveryDetailsList });
  };

  validateForm() {
    this.setState({
      isValidForm: true,
      gatedError: '',
      streetError: '',
      phoneError: '',
      haulError: ''
    });
    var messageObj = {
      alertType: 'reset',
      message: ''
    };
    this.setState({ alertErrorMsg: messageObj.message });
    if (
      (this.state.validPhone === undefined ||
        this.state.validPhone === null ||
        this.state.validPhone === '') &&
      (this.state.phone === undefined ||
        this.state.phone === null ||
        this.state.phone === '')
    ) {
      let messageObj = {
        alertType: 'error',
        message: 'Please select if this is a valid phone'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }
    if (
      this.state.gatedFl === undefined ||
      this.state.gatedFl === null ||
      this.state.gatedFl === ''
    ) {
      let messageObj = {
        alertType: 'error',
        message: 'Please select if this is a gated community'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }
    if (
      this.state.newlyBuiltFl === undefined ||
      this.state.newlyBuiltFl === null ||
      this.state.newlyBuiltFl === ''
    ) {
      let messageObj = {
        alertType: 'error',
        message: 'Please select if this is a newly built community'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }
    if (
      this.state.haulAway === undefined ||
      this.state.haulAway === null ||
      this.state.haulAway === ''
    ) {
      let messageObj = {
        alertType: 'error',
        message: 'Please select if there are old items to be hauled away'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }
    if (
      (this.state.validPhone === 'false' || this.state.validPhone === false) &&
      this.state.phone !== undefined
    ) {
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (this.state.phone !== '' && !this.state.phone.match(phoneno)) {
        this.setState({
          phoneError: 'Please enter a valid phone',
          isValidForm: false
        });

        let messageObj = {
          alertType: 'error',
          message: 'Please enter a valid phone'
        };
        this.setState({ alertErrorMsg: messageObj.message });
        return false;
      }
    } else if (
      (this.state.validPhone === 'false' || this.state.validPhone === false) &&
      this.state.phone === undefined
    ) {
      this.setState({
        phoneError: 'Please enter a valid phone',
        isValidForm: false
      });
      let messageObj = {
        alertType: 'error',
        message: 'Please enter a valid phone'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }
    if (
      (this.state.gatedFl === true || this.state.gatedFl === 'true') &&
      (this.state.gated === '' || this.state.gated === null)
    ) {
      this.setState({
        gatedError: 'Please select your preference for entrance',
        isValidForm: false
      });
      let messageObj = {
        alertType: 'error',
        message:
          'If you live in a gated community, please select your preference for entrance'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }
    if (
      (this.state.newlyBuiltFl === true ||
        this.state.newlyBuiltFl === 'true') &&
      (this.state.newlyBuilt === '' || this.state.newlyBuilt === null)
    ) {
      this.setState({
        streetError: 'Please provide street name',
        isValidForm: false
      });
      let messageObj = {
        alertType: 'error',
        message:
          'If your home is in a newly built community, please provide street name'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }
    if (
      (this.state.haulAway === true || this.state.haulAway === 'true') &&
      (this.state.haulAwayValue === '0' ||
        this.state.haulAwayValue === '' ||
        this.state.haulAwayValue === null)
    ) {
      this.setState({
        haulError: 'Please select number of items to be hauled away',
        isValidForm: false
      });
      let messageObj = {
        alertType: 'error',
        message: 'Please select number of items to be hauled away'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }

    if (
      (this.state.haulAway === true || this.state.haulAway === 'true') &&
      this.state.allOrders.length > 1
    ) {
      this.state.subOrderDeliveryDetailsList.map((subOrder, index) => {
        if (
          (subOrder.haulAwayFl === true || subOrder.haulAwayFl === 'true') &&
          (subOrder.haulAway === '' ||
            subOrder.haulAway === 0 ||
            !subOrder.haulAway)
        ) {
          let messageObj = {
            alertType: 'error',
            message:
              'If one of the orders is a replacement order. Please select atleast one tracking number as a replacement order.'
          };
          this.setState({ alertErrorMsg: messageObj.message });

          return false;
        }
        return 0;
      });
    }

    if (
      this.state.largeTruckAccessFl === undefined ||
      this.state.largeTruckAccessFl === null ||
      this.state.largeTruckAccessFl === ''
    ) {
      let messageObj = {
        alertType: 'error',
        message: 'Please select if a large truck can access your street'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }

    if (
      this.state.replacementOrderFl === undefined ||
      this.state.replacementOrderFl === null ||
      this.state.replacementOrderFl === ''
    ) {
      let messageObj = {
        alertType: 'error',
        message: 'Please select if this is a replacement order'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }

    let replacementFlCheckedOrders = this.state.subOrderDeliveryDetailsList.filter(
      subOrder => subOrder.replacementOrderFl === true
    );

    if (
      (this.state.replacementOrderFl === true ||
        this.state.replacementOrderFl === 'true') &&
      this.state.allOrders.length > 1 &&
      replacementFlCheckedOrders.length < 1
    ) {
      let messageObj = {
        alertType: 'error',
        message:
          'If one of the orders is a replacement order. Please select atleast one tracking number as a replacement order.'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }

    let haulAwayFlCheckedOrders = this.state.subOrderDeliveryDetailsList.filter(
      subOrder => subOrder.haulAwayFl === true
    );

    if (
      this.state.haulAway === true &&
      this.state.allOrders.length > 1 &&
      haulAwayFlCheckedOrders.length < 1
    ) {
      let messageObj = {
        alertType: 'error',
        message:
          'If one of the orders has items that need to be hauled away. Please select atleast one tracking number and select the number of items to be hauled away.'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }

    let haulAwayValueCheckedOrders = this.state.subOrderDeliveryDetailsList.filter(
      subOrder => subOrder.haulAway > 0
    );

    if (
      (this.state.haulAway === true || this.state.haulAway === 'true') &&
      haulAwayValueCheckedOrders.length !== haulAwayFlCheckedOrders.length
    ) {
      let messageObj = {
        alertType: 'error',
        message:
          'If you have selected an order for haul away, please specify the number of items to be hauled away for that order.'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }

    if (
      (this.state.dryYes === true || this.state.dryYes === 'true') &&
      (this.state.reverseDoorFl === undefined ||
        this.state.reverseDoorFl === null ||
        this.state.reverseDoorFl === '')
    ) {
      let messageObj = {
        alertType: 'error',
        message: 'Please select if you require a door reversal'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }

    if (
      (this.state.gasRq === true || this.state.gasRq === 'true') &&
      (this.state.shutOffValveFl === undefined ||
        this.state.shutOffValveFl === null ||
        this.state.shutOffValveFl === null)
    ) {
      let messageObj = {
        alertType: 'error',
        message:
          'Please select if existing water shut off valve and/or gas valve meet this criteria?'
      };
      this.setState({ alertErrorMsg: messageObj.message });
      return false;
    }
    // if (this.state.schedulerOrdType===5 && (this.state.brownBoxFl=== undefined || this.state.brownBoxFl === null || this.state.brownBoxFl === "")) {
    //   var messageObj ={
    //          alertType:'error',
    //          message:"Please select if you want a brown box delivery"}
    //          this.props.getMessageToShow(messageObj);
    //     return false;
    //     }
    return true;
  }

  storeDeliveryDetails = () => {
    let subOrderDeliveryDetailsList = this.state.subOrderDeliveryDetailsList.map(
      (subOrder, index) => {
        let eachOrder = { ...subOrder };
        if (subOrder.haulAwayFl === false) {
          subOrder.haulAway = 0;
        }

        if (subOrder.replacementOrderFl === true) {
          subOrder.haulAwayFl = false;
          subOrder.haulAway = 0;
        }

        eachOrder = {
          ...eachOrder,
          customerTransactionRef: subOrder.customerTransactionRef,
          trackingNumber: subOrder.trackingNumber,
          replacementOrderFl: subOrder.replacementOrderFl,
          haulAway: subOrder.haulAway,
          haulAwayFl: subOrder.haulAwayFl,
          haulAvailable: subOrder.haulAvailable
        };
        return eachOrder;
      }
    );

    let haulAwayValue = this.state.haulAwayValue;

    if (
      (this.state.haulAwayFl === true || this.state.haulAwayFl === 'true') &&
      this.state.allOrders.length > 1
    ) {
      haulAwayValue = 1;
    }
    if (this.state.haulAwayFl === false || this.state.haulAwayFl === 'false') {
      haulAwayValue = 0;
    }

    const orderToUpdate = {
      customerTransactionRef: this.state.transactionID,
      validPhone:
        this.state.validPhone === true || this.state.validPhone === 'true'
          ? true
          : false,
      updatedShipToPhone: this.state.phoneSubmit,
      gatedFl: this.state.gatedFl,
      gated: this.state.gated,
      newlyBuiltFl: this.state.newlyBuiltFl,
      newlyBuilt: this.state.newlyBuilt,
      largeTruckAccessFl: this.state.largeTruckAccessFl,
      reverseDoorFl: this.state.reverseDoorFl,
      shutOffValveFl: this.state.shutOffValveFl,
      brownBoxFl: false,
      subOrderDeliveryDetailsList: subOrderDeliveryDetailsList
    };

    if (this.validateForm()) {
      if (this.state.isDelDetToUpdate) {
        return apiRepo
          .serviceCall('put', '/v2/schedule/measurement/', orderToUpdate)
          .then(response => {
            return response;
          })
          .catch(Error => {
            var messageObj = {
              alertType: 'error',
              message:
                'Error in updating order delivery details. Please try again.'
            };
            this.setState({ alertErrorMsg: messageObj.message });
            console.log('error: ', Error);
            this.setState({
              spinTheSpinner: false
            });
          });
      } else {
        return apiRepo
          .serviceCall('post', '/v2/schedule/measurement/', orderToUpdate)
          .then(response => {
            return response;
          })
          .catch(Error => {
            var messageObj = {
              alertType: 'error',
              message:
                'Error in adding order delivery details. Please try again.'
            };
            this.setState({ alertErrorMsg: messageObj.message });
            console.log('error: ', Error);
            this.setState({
              spinTheSpinner: false
            });
          });
      }
    } else {
      return setPromise(false);
    }
  };

  render() {
    let noOfReplacementOrders = 0;
    let ordersWithHaulAvailableOrReplacementFlDeciders = 0;
    if (this.state.subOrderDeliveryDetailsList) {
      this.state.subOrderDeliveryDetailsList.map(subOrder => {
        if (subOrder.replacementOrderFl === true) {
          noOfReplacementOrders++;
        }

        if (
          subOrder.haulAvailable === false ||
          subOrder.replacementOrderFl === true
        ) {
          ordersWithHaulAvailableOrReplacementFlDeciders++;
        }
      });
    }

    return (
      <div>
        {this.state.subOrderDeliveryDetailsList && (
          <form>
            <div>
              <div>
                <Card body style={{ background: '#ff7518' }}>
                  <div
                    style={{
                      width: '100%'
                    }}
                    className="responsive-image"
                  >
                    <img
                      src={Image2}
                      className="responsive-image__delivery"
                      alt="2nd Delivery Details"
                    />
                  </div>
                  <br />
                  <div>
                    <span className="text-white text-xsmall text-bold">
                      Do not wait until delivery day to find out it does not
                      fit. Make sure your item will fit through the pathway and
                      in its final location to ensure a successful delivery.
                      Walk the path and measure now! How to walk the path?
                      {!this.state.isOpen && (
                        <Link
                          className="text-xsmall text-bold"
                          to="/tracking_measure"
                          onClick={this.openModal}
                        >
                          {' '}
                          CLICK HERE
                        </Link>
                      )}
                    </span>
                    {this.state.isOpen && (
                      <div>
                        <VideoModal
                          isOpen={this.state.isOpen}
                          closeVideo={this.openModal}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </div>
              <br />
              {this.state.alertErrorMsg && (
                <p className="alert alert-danger fade show" ref={this.errorMsgRef}>{this.state.alertErrorMsg}</p>
              )}
              <div>
                {this.state.shipToPhone && (
                  <div className="col-md-12 ">
                    <label className="text-xxsmall text-bold">
                      {' '}
                      Is {phoneNoFormat(this.state.shipToPhone)} a valid phone
                      number to reach you about your delivery?{' '}
                    </label>
                    <Row>
                      <Col sm="2">
                        <label>
                          <input
                            type="radio"
                            value={true}
                            checked={
                              this.state.validPhone === true ||
                              this.state.validPhone === 'true'
                            }
                            onChange={this.handleQ0Change}
                          />
                          Yes
                        </label>
                      </Col>
                      <Col sm="2">
                        <label>
                          <input
                            type="radio"
                            value={false}
                            checked={
                              this.state.validPhone === false ||
                              this.state.validPhone === 'false'
                            }
                            onChange={this.handleQ0Change}
                          />
                          No
                        </label>
                      </Col>
                    </Row>
                  </div>
                )}
                {((this.state.validPhone !== null &&
                  (this.state.validPhone === 'false' ||
                    this.state.validPhone === false)) ||
                  this.state.shipToPhone === null) && (
                  <div className="col-md-12">
                    <label className="text-xxsmall">
                      {' '}
                      Please enter the correct phone number{' '}
                    </label>
                    <Input
                      type="text"
                      onChange={this.handlePhoneChange}
                      value={this.state.phone}
                    />
                    <span style={{ color: 'red' }}>
                      {this.state.phoneError}
                    </span>
                  </div>
                )}
                {this.state.validPhone === '' &&
                this.state.shipToPhone === '' && (
                  <div className="col-md-12">
                    <label className="text-xxsmall">
                      {' '}
                      Please enter phone number{' '}
                    </label>
                    <Input
                      type="text"
                      onChange={this.handlePhoneChange}
                      value={this.state.phone}
                    />
                    <span style={{ color: 'red' }}>
                      {this.state.phoneError}
                    </span>
                  </div>
                )}

                <div className="col-md-12">
                  <label className="text-xxsmall text-bold">
                    {' '}
                    Do you live in a gated community?{' '}
                  </label>
                  <Row>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={true}
                          checked={
                            this.state.gatedFl === true ||
                            this.state.gatedFl === 'true'
                          }
                          onChange={this.handleQ1Change}
                        />
                        Yes
                      </label>
                    </Col>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={false}
                          checked={
                            this.state.gatedFl === false ||
                            this.state.gatedFl === 'false'
                          }
                          onChange={this.handleQ1Change}
                        />
                        No
                      </label>
                    </Col>
                  </Row>
                </div>

                {(this.state.gatedFl === true ||
                  this.state.gatedFl === 'true') && (
                  <div className="col-md-12">
                    <label className="text-xxsmall text-bold">
                      {' '}
                      How do we get entrance?{' '}
                    </label>
                    <Input
                      onChange={this.handleGatedChange}
                      type="select"
                      value={this.state.gated}
                    >
                      <option value=""> Please Select</option>
                      <option value="See the Guard">See the guard</option>
                      <option value="Call me on Arival">
                        Call me on arrival
                      </option>
                      <option value="Gate Pass">Gate pass</option>
                    </Input>
                    <span style={{ color: 'red' }}>
                      {this.state.gatedError}
                    </span>
                  </div>
                )}

                <div className="col-md-12">
                  <label className="text-xxsmall text-bold">
                    {' '}
                    Is your home in a newly built community?{' '}
                  </label>
                  <Row>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={true}
                          checked={
                            this.state.newlyBuiltFl === true ||
                            this.state.newlyBuiltFl === 'true'
                          }
                          onChange={this.handleQ2Change}
                        />
                        Yes
                      </label>
                    </Col>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={false}
                          checked={
                            this.state.newlyBuiltFl === false ||
                            this.state.newlyBuiltFl === 'false'
                          }
                          onChange={this.handleQ2Change}
                        />
                        No
                      </label>
                    </Col>
                  </Row>
                </div>
                {(this.state.newlyBuiltFl === true ||
                  this.state.newlyBuiltFl === 'true') && (
                  <div className="col-md-12">
                    <label className="text-xxsmall">
                      {' '}
                      Please enter the closest intersection street names{' '}
                    </label>
                    <Input
                      onChange={this.handleNewlyBuiltChange}
                      value={this.state.newlyBuilt}
                    />
                    <span style={{ color: 'red' }}>
                      {this.state.streetError}
                    </span>
                  </div>
                )}
                <div className="col-md-12">
                  <label className="text-xxsmall text-bold">
                    {' '}
                    Can a large delivery truck access your street and home(26ft
                    box truck)?{' '}
                  </label>
                  <Row>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={true}
                          checked={
                            this.state.largeTruckAccessFl === true ||
                            this.state.largeTruckAccessFl === 'true'
                          }
                          onChange={this.handleQ3Change}
                        />
                        Yes
                      </label>
                    </Col>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={false}
                          checked={
                            this.state.largeTruckAccessFl === false ||
                            this.state.largeTruckAccessFl === 'false'
                          }
                          onChange={this.handleQ3Change}
                        />
                        No
                      </label>
                    </Col>
                  </Row>
                </div>
                <div className="col-md-12">
                  {this.state.allOrders.length > 1 && (
                    <label className="text-xxsmall text-bold">
                      {' '}
                      Are any of the orders you are scheduling a replacement
                      Order?{' '}
                    </label>
                  )}
                  {this.state.allOrders.length === 1 && (
                    <label className="text-xxsmall text-bold">
                      {' '}
                      Is this a replacement order?{' '}
                    </label>
                  )}
                  <Row>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={true}
                          checked={
                            this.state.replacementOrderFl === true ||
                            this.state.replacementOrderFl === 'true'
                          }
                          onChange={this.handleQ4Change}
                        />
                        Yes
                      </label>
                    </Col>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={false}
                          checked={
                            this.state.replacementOrderFl === false ||
                            this.state.replacementOrderFl === 'false'
                          }
                          onChange={this.handleQ4Change}
                        />
                        No
                      </label>
                    </Col>
                  </Row>

                  {this.state.allOrders.length > 1 &&
                  (this.state.replacementOrderFl === true ||
                    this.state.replacementOrderFl === 'true') && (
                    <div>
                      <label className="text-xxsmall text-bold">
                        Select all the orders below that are replacement orders.
                      </label>
                      {this.state.subOrderDeliveryDetailsList.map(
                        (subOrder, index) => {
                          return (
                            <div key={index}>
                              <span key={index}>
                                <input
                                  key={index}
                                  data-index={index}
                                  type="checkbox"
                                  checked={
                                    subOrder.replacementOrderFl === true ||
                                    subOrder.replacementOrderFl === 'true'
                                  }
                                  onChange={
                                    this
                                      .handleOrderLevelReplacementOrderFlChange
                                  }
                                />
                                {'  '}
                                <label key={index + 1}>
                                  {subOrder.trackingNumber}
                                </label>
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                <div className="col-md-12">
                  {this.state.allOrders.length > 1 &&
                  !(noOfReplacementOrders === this.state.allOrders.length) &&
                  this.state.haulAvailable &&
                  !(
                    ordersWithHaulAvailableOrReplacementFlDeciders ===
                    this.state.allOrders.length
                  ) && (
                    <label className="text-xxsmall text-bold">
                      {' '}
                      In any of the orders being scheduled are there old items
                      to be hauled away? Note: Haul Away is only available for
                      like items and same quantities as items being delivered.
                      Example: free standing fridge for free standing fridge,
                      slide in range for a slide in range.
                    </label>
                  )}
                  {this.state.allOrders.length === 1 &&
                  !(noOfReplacementOrders === this.state.allOrders.length) &&
                  !(
                    ordersWithHaulAvailableOrReplacementFlDeciders ===
                    this.state.allOrders.length
                  ) &&
                  this.state.haulAvailable && (
                    <label className="text-xxsmall text-bold">
                      {' '}
                      Are there old items to be hauled away? Note: Haul Away is
                      only available for like items and same quantities as items
                      being delivered. Example: free standing fridge for free
                      standing fridge, slide in range for a slide in range.
                    </label>
                  )}

                  {!(noOfReplacementOrders === this.state.allOrders.length) &&
                  !(
                    ordersWithHaulAvailableOrReplacementFlDeciders ===
                    this.state.allOrders.length
                  ) &&
                  this.state.haulAvailable && (
                    <Row>
                      <Col sm="2">
                        <label>
                          <input
                            type="radio"
                            value={true}
                            disabled={this.state.disableButtons}
                            checked={
                              this.state.haulAway === true ||
                              this.state.haulAway === 'true'
                            }
                            onChange={this.handleQ5Change}
                          />
                          Yes
                        </label>
                      </Col>
                      <Col sm="2">
                        <label>
                          <input
                            type="radio"
                            value={false}
                            disabled={this.state.disableButtons}
                            checked={
                              this.state.haulAway === false ||
                              this.state.haulAway === 'false'
                            }
                            onChange={this.handleQ5Change}
                          />
                          No
                        </label>
                      </Col>
                    </Row>
                  )}

                  {this.state.allOrders.length === 1 &&
                  (this.state.haulAway === true ||
                    this.state.haulAway === 'true') &&
                  !(noOfReplacementOrders === this.state.allOrders.length) &&
                  !(
                    ordersWithHaulAvailableOrReplacementFlDeciders ===
                    this.state.allOrders.length
                  ) &&
                  this.state.haulAvailable && (
                    <div>
                      <label className="text-xxsmall text-bold">
                        How many Items?{' '}
                      </label>
                      <Input
                        name="haulAway"
                        type="select"
                        onChange={this.handleHaulAwayChange}
                        value={
                          this.state.subOrderDeliveryDetailsList[0].haulAway
                        }
                      >
                        <option value="">Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                      </Input>
                    </div>
                  )}

                  {this.state.allOrders.length > 1 &&
                  (this.state.haulAway === true ||
                    this.state.haulAway === 'true') &&
                  !(noOfReplacementOrders === this.state.allOrders.length) &&
                  !(
                    ordersWithHaulAvailableOrReplacementFlDeciders ===
                    this.state.allOrders.length
                  ) &&
                  this.state.haulAvailable && (
                    <div>
                      <label className="text-xxsmall text-bold">
                        Select all the orders below that have old items to be
                        hauled away and then select the number of items for each
                        order.
                      </label>
                      {this.state.subOrderDeliveryDetailsList.map(
                        (subOrder, index) => {
                          if (
                            !subOrder.replacementOrderFl &&
                            subOrder.haulAvailable
                          ) {
                            return (
                              <div key={index}>
                                <span key={index}>
                                  <input
                                    key={index}
                                    data-index={index}
                                    type="checkbox"
                                    checked={
                                      subOrder.haulAwayFl === true ||
                                      subOrder.haulAwayFl === 'true'
                                    }
                                    onChange={
                                      this.handleOrderLevelHaulawayFlChange
                                    }
                                  />
                                  {'  '}
                                  <label key={index + 1}>
                                    {subOrder.trackingNumber}
                                  </label>
                                </span>
                                {subOrder.haulAwayFl && (
                                  <div key={index + 1}>
                                    <label
                                      key={index + 1}
                                      className="text-xxsmall text-bold"
                                    >
                                      How many Items?{' '}
                                    </label>
                                    <Input
                                      key={index}
                                      data-index={index}
                                      name="haulAway"
                                      type="select"
                                      onChange={
                                        this.handleOrderLevelHaulAwayValueChange
                                      }
                                      value={subOrder.haulAway || '0'}
                                    >
                                      <option value="0">Select</option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                      <option value="6">6</option>
                                      <option value="7">7</option>
                                      <option value="8">8</option>
                                      <option value="9">9</option>
                                    </Input>
                                    <span style={{ color: 'red' }}>
                                      {subOrder.haulError}
                                    </span>
                                    <br />
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            return <div key={index} />;
                          }
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>

              {(this.state.dryYes === true || this.state.dryYes === 'true') && (
                <div className="col-md-12">
                  <label className="text-xxsmall text-bold">
                    Please note: Front load washer doors cannot be changed. Does
                    your new dryer/washer require a door reversal change placing
                    the handle on the right side?{' '}
                  </label>
                  <Row>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={true}
                          checked={
                            this.state.reverseDoorFl === true ||
                            this.state.reverseDoorFl === 'true'
                          }
                          onChange={this.handleQ8Change}
                        />
                        Yes
                      </label>
                    </Col>
                    <Col sm="2">
                      <label>
                        <input
                          type="radio"
                          value={false}
                          checked={
                            this.state.reverseDoorFl === false ||
                            this.state.reverseDoorFl === 'false'
                          }
                          onChange={this.handleQ8Change}
                        />
                        No
                      </label>
                    </Col>
                  </Row>
                </div>
              )}
              {(this.state.gasRq === true || this.state.gasRq === 'true') && (
                <div>
                  <ul className="a text-xxsmall text-bold">
                    <li className="a text-xxsmall">
                      <p>
                        {' '}
                        If the item is refrigeration with an ice maker or
                        natural gas appliance, please validate that there is a
                        shut off valve above the floor directly behind the
                        appliance.
                      </p>
                    </li>
                    <li className="a text-xxsmall">
                      <p>
                        {' '}
                        The delivery team cannot connect the appliance if the
                        shut off valve is not located behind the appliance.
                      </p>
                    </li>
                  </ul>

                  <div className="col-md-12">
                    <label className="text-xxsmall text-bold">
                      {' '}
                      Does your existing water shut off valve and/or gas valve
                      meet this criteria?{' '}
                    </label>
                    <Row>
                      <Col sm="2">
                        <label>
                          <input
                            type="radio"
                            value={true}
                            checked={
                              this.state.shutOffValveFl === true ||
                              this.state.shutOffValveFl === 'true'
                            }
                            onChange={this.handleQ9Change}
                          />
                          Yes
                        </label>
                      </Col>
                      <Col sm="2">
                        <label>
                          <input
                            type="radio"
                            value={false}
                            checked={
                              this.state.shutOffValveFl === false ||
                              this.state.shutOffValveFl === 'false'
                            }
                            onChange={this.handleQ9Change}
                          />
                          No
                        </label>
                      </Col>
                    </Row>
                  </div>

                  <div className="col-md-12">
                    <label className="text-xxsmall text-bold">
                      Please note: The delivery team cannot convert or connect
                      to propane gas.
                    </label>
                  </div>
                </div>
              )}
              {/*this.state.schedulerOrdType===5 &&(
         <div className="col-md-12">
         <label className="text-xxsmall text-bold"> In the event your home is not ready or you do not have the appropriate shut off valve we can still deliver the appliance without installation. Do you want a brown box delivery?
(Items in carton no hookup required). </label>
         <Row>
         <Col sm="2">
               <label>
               <input type="radio" value={true}
                   checked={this.state.brownBoxFl === true  || this.state.brownBoxFl === 'true'}
                   onChange={this.handleQ10Change}
               />
               Yes
               </label>
           </Col>
           <Col sm="2">
               <label>
               <input type="radio" value={false}
                   checked={this.state.brownBoxFl === false  || this.state.brownBoxFl === 'false'}
                   onChange={this.handleQ10Change}
               />
               No
               </label>
           </Col>
           </Row>
         </div>
       )*/}

              {/* <div className="col-md-12">
         <label className="text-xxsmall text-bold"> With any large appliance, the most difficult point of entry may be your front door.
There needs to be enough room and a clear path for the delivery team to safely move the appliances through your home.
Have you confirmed that the new appliances will fit through your doors and hallways
along with its final destination based off of the products’ measurements?</label>
            <Row>
            <Col sm="2">
               <label>
               <input type="radio" value={true}
                   checked={this.state.measure === true  || this.state.measure === 'true'}
                   onChange={this.handleQ7Change}
               />
               Yes
               </label>
               </Col>
               <Col sm="2">
               <label>
               <input type="radio" value={false}
                   checked={this.state.measure === false  || this.state.measure === 'false'}
                   onChange={this.handleQ7Change}
               />
               No
               </label>
               </Col>
            </Row>
         </div>*/}
              <br />
              <div>
                <Row>
                  <Col sm="4" />
                </Row>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ getTransactionDetails }, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(DeliveryDetailsForm);
