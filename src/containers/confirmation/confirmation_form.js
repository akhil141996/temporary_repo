import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { reduxForm, change } from 'redux-form';
import { getMessageToShow, submitForSelfScheduling } from '../../actions/index';
import { connect } from 'react-redux';
import '../../styles/self_scheduler/_confirmationPage.scss';
import {
  setPromise,
  phoneNoFormat,
  getTransactionRef
} from '../common/innovel_util';

class ConfirmationForm extends Component {
  constructor(props) {
    super(props);
    const transID = getTransactionRef();
    this.state = {
      schedulingOrder: false,
      canSchedule: false,
      isUpdate: false,
      transactionID: transID,
      alternateContact: phoneNoFormat(
        props.responseValues.trackingOrder[0].phone
      )
    };
  }

  setAlternateContact = e => {
    this.setState({
      alternateContact: phoneNoFormat(e.target.value)
    });
    var phoneno = /[(][0-9]{3}[)][0-9]{3}[-][0-9]{4}/;
    if (e.target.value.match(phoneno)) {
      this.setState({
        phoneError: '',
        canSchedule: true,
        alternateContactSubmit:
          e.target.value.substring(1, 4) +
          e.target.value.substring(5, 8) +
          e.target.value.substring(9, 13)
      });
      this.props.enableButton(true);
    } else if (e.target.value === '(') {
      this.setState({
        phoneError: '',
        canSchedule: true
      });
      this.props.enableButton(true);
    } else {
      this.setState({
        phoneError:
          'Please enter a valid phone number, in the format (999)999-9999',
        canSchedule: false
      });
      this.props.enableButton(false);
    }
  };

  validateAltPhone() {
    if (
      this.state.alternateContact !== '' &&
      this.state.alternateContact !== undefined &&
      this.state.alternateContact !== null
    ) {
      var phoneno = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
      if (this.state.alternateContact.match(phoneno)) {
        this.setState({
          phoneError: '',
          canSchedule: true
        });
        return true;
      } else {
        this.setState({
          phoneError:
            'Please enter a valid phone number,only digits are allowed.',
          canSchedule: false
        });
        return false;
      }
    } else {
      return true;
    }
  }

  componentDidMount() {
    this.props.shareMethods(this.storeConfirmationDetails.bind(this));
  }

  storeConfirmationDetails = () => {
    var submitValues;
    submitValues = {
      ...submitValues,
      shipToPhone: this.state.alternateContactSubmit || null,
      transactionRef: this.state.transactionID
    };

    if (this.validateAltPhone()) {
      this.setState({ schedulingOrder: true });
      return this.props
        .submitForSelfScheduling(submitValues)
        .then(response => {
          if (response.payload.status === 200) {
            if (response.payload.data.serviceResponse.status === 'inprogress') {
              let messageObj = {
                alertType: 'success',
                message: 'Started scheduling succesfully!'
              };
              this.props.getMessageToShow(messageObj);
              this.props.history.push('/schedule_result');
            } else {
              if (
                response.payload.data.serviceResponse.status !== 'inprogress'
              ) {
                sessionStorage.removeItem('transactionRef');
              }
              let messageObj = {
                alertType: 'error',
                message:
                  "Failed with error code '" +
                  response.payload.data.serviceResponse.status +
                  "'."
              };
              this.props.getMessageToShow(messageObj);
              this.setState({ schedulingOrder: false });
            }
          } else {
            var messageObj = {
              alertType: 'error',
              message: 'Error in confirming. Please try again later.'
            };
            this.props.getMessageToShow(messageObj);
          }
          return response.payload;
        })
        .catch(Error => {
          var messageObj = {
            alertType: 'error',
            message:
              'Technical error, please come back at a later time and try again.'
          };
          this.props.getMessageToShow(messageObj);
        });
    } else {
      return setPromise(false);
    }
  };

  render() {
    return (
      <div>
        <form>
          <Col sm="10">
            <Row>
              <Col sm="6">
                <label>Purchase Order</label>
              </Col>
              <Col sm="6">
                <input
                  type="text"
                  value={this.props.transactionDetails.trackingNumber}
                  disabled={true}
                  className="style401"
                />
              </Col>
            </Row>
            {this.props.transactionDetails.scheduleTransactionDetail
              .scheduleOrderType === 4 && (
              <Row>
                <Col sm="6">
                  <label>Requested Delivery Date</label>
                </Col>
                <Col sm="6">
                  <input
                    type="text"
                    value={this.props.transactionDetails.scheduleDate}
                    disabled={true}
                    className="style401"
                  />
                </Col>
              </Row>
            )}

            <Row>
              <Col sm="6">
                <label>Address</label>
              </Col>
              <Col sm="6">
                <input
                  type="text"
                  value={this.props.transactionDetails.shipToAddress1}
                  disabled={true}
                  className="style401"
                />
              </Col>
            </Row>

            <Row>
              <Col sm="6">
                <label>Address 2</label>
              </Col>
              <Col sm="6">
                <input
                  type="text"
                  value={this.props.transactionDetails.shipToAddress2}
                  disabled={true}
                  className="style401"
                />
              </Col>
            </Row>

            <Row>
              <Col sm="6">
                <label>City</label>
              </Col>
              <Col sm="6">
                <input
                  type="text"
                  value={this.props.transactionDetails.shipToCity}
                  disabled={true}
                  className="style401"
                />
              </Col>
            </Row>

            <Row>
              <Col sm="6">
                <label>State</label>
              </Col>
              <Col sm="6">
                <input
                  type="text"
                  value={this.props.transactionDetails.shipToState}
                  disabled={true}
                  className="style401"
                />
              </Col>
            </Row>

            <Row>
              <Col sm="6">
                <label>Zip Code</label>
              </Col>
              <Col sm="6">
                <input
                  type="text"
                  value={this.props.transactionDetails.shipToZip}
                  disabled={true}
                  className="style401"
                />
              </Col>
            </Row>

            <Row>
              <Col sm="6">
                <label>Phone</label>
              </Col>
              <Col sm="6">
                <input
                  type="text"
                  value={
                    this.props.transactionDetails.orderDeliveryDetails
                      .validPhone ? (
                      phoneNoFormat(this.props.transactionDetails.shipToPhone)
                    ) : (
                      phoneNoFormat(
                        this.props.transactionDetails.orderDeliveryDetails
                          .updatedShipToPhone
                      )
                    )
                  }
                  disabled={true}
                  className="style401"
                />
              </Col>
            </Row>

            <Row>
              <Col sm="6">
                <label>Mobile/Alternate</label>
              </Col>
              <Col sm="6">
                <input
                  type="text"
                  value={this.state.alternateContact}
                  disabled={this.props.deliveryDetailsCorrect}
                  onChange={this.setAlternateContact}
                  className="style401"
                />
                <span style={{ color: 'red' }}>{this.state.phoneError}</span>
              </Col>
            </Row>

            <Row>
              <Col sm="6">
                <label>Email</label>
              </Col>
              <Col sm="6">
                <input
                  type="text"
                  value={this.props.transactionDetails.customerEmail}
                  disabled={true}
                  className="style401"
                />
              </Col>
            </Row>
          </Col>
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

function validate(values) {
  const errors = {};
  return errors;
}
export default reduxForm({
  validate,
  form: 'ConfirmationForm'
})(
  connect(mapStateToProps, {
    getMessageToShow,
    change,
    submitForSelfScheduling
  })(ConfirmationForm)
);
