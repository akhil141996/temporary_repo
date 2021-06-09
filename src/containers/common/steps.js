import React, { Component } from 'react';
import '../../styles/_deliveryform.scss';
import logoTape from '../../images/tape2.jpg';
import logoChecklist from '../../images/task12.jpg';
import logoCalendar from '../../images/cal1.jpg';
import { TrackingSpinner } from '../common/tracking_spinner';

class Steps extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  //   if (props.schedulerOrdType === 4) {
  //     //Normal orders
  //     if (props.step === 1) {
  //       this.state = {
  //         step: 'Step 1',
  //         text:
  //           'Please select your delivery date. The calendar will be displayed with available dates highlighted in GREEN.',
  //         image: logoCalendar
  //       };
  //     } else if (props.step === 2) {
  //       this.state = {
  //         step: 'Step 2',
  //         text:
  //           'Please answer a few required questions to ensure your delivery meets your expectations.',
  //         image: logoTape
  //       };
  //     } else if (props.step === 3) {
  //       this.state = {
  //         step: 'Step 3',
  //         text:
  //           'Please validate that your delivery address is correct. Then click the schedule button to complete your delivery scheduling.If the address is not correct, please contact your seller at ' +
  //           props.custService,
  //         image: logoChecklist
  //       };
  //     }
  //   } else if (props.schedulerOrdType === 5) {
  //     //Normal orders
  //     if (props.step === 2) {
  //       this.state = {
  //         step: 'Step 2',
  //         text:
  //           'Please answer a few required questions to ensure your delivery meets your expectations.',
  //         image: logoChecklist
  //       };
  //     } else if (props.step === 1) {
  //       this.state = {
  //         step: 'Step 1',
  //         text: 'Provide information to prepare for your delivery.',
  //         image: logoTape
  //       };
  //     }
  //   }
  // }

  //

  componentDidMount() {
    if (this.state.loading) {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    // if (
    //   this.props.schedulerOrdType &&
    //   prevProps.schedulerOrdType !== this.props.schedulerOrdType
    // ) {
    let step, text, image;
    if (this.props.schedulerOrdType === 4) {
      //Normal orders
      if (this.props.step === 1) {
        step = 'Step 1';
        text =
          'Please select your delivery date. The calendar will be displayed with available dates highlighted in GREEN.';
        image = logoCalendar;
      } else if (this.props.step === 2) {
        step = 'Step 2';
        text =
          'Please answer a few questions to ensure you’re prepared for delivery.  Based on the item service level you purchased, the delivery team will review the final location and determine the best path to get there.';
        image = logoTape;
      } else if (this.props.step === 3) {
        step = 'Step 3';
        text =
          'Please validate that your delivery address is correct. Then click the schedule button to complete your delivery scheduling. If the address is not correct, please contact your seller at ' +
          this.props.custService;
        image = logoChecklist;
      }
    } else if (this.props.schedulerOrdType === 5) {
      //Normal orders
      if (this.props.step === 2) {
        step = 'Step 2';
        text =
          'Please answer a few questions to ensure you’re prepared for delivery.  Based on the item service level you purchased, the delivery team will review the final location and determine the best path to get there.';
        image = logoChecklist;
      } else if (this.props.step === 1) {
        step = 'Step 1';
        text = 'Provide information to prepare for your delivery.';
        image = logoTape;
      }
    }
    // }

    var paddingBottom = '90%';

    return (
      <div className="well">
        {!this.state.loading && (
          <div>
            <h2 className="h2Style">{step}</h2>
            <p className="paraStyle">{text}</p>
            <div className="responsive-image">
              <div style={{ paddingBottom }} />
              <img src={image} className="responsive-image__image img-fluid" alt="Step" />
            </div>
          </div>
        )}
        {this.state.loading && (
          <div>
            <div className="responsive-image">
              <TrackingSpinner />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Steps;
