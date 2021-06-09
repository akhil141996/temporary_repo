import React, { Component } from 'react';
import $ from 'jquery';
import '../styles/_contactus.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/_font.scss';
const TopBanner = () => {
    return (<div className="contactus-panel1" id="getaquote">
      <div className="col-md-2">
        <br />
      </div>
      <div className="col-md-8" align="left" vertical-align="bottom">
        <br />
        <h1 className="text-white text-h1 margin-0">Contact Us</h1>
        <div className="text-white nav-font" data-animate="fadeInUp">
          <p className="text-med">We are here for you.</p>
        </div>
      </div>
      <div className="col-md-2">
        <br />
      </div>
    </div>)
  }
  const RightBanner = () => {
    return (<><div className="col-md-5">
      <div className="contactus-panel2" />
    </div>
      <div className="col-md-1">
        <br />
      </div></>)
  }

export class ContactUs extends Component {

    scrollToDiv() {
        var divId = window.location.hash;
        if (
            divId !== '' &&
            divId !== undefined &&
            $(divId).offset() !== undefined
        ) {
            $('html, body').animate(
                {
                    scrollTop: $(divId).offset().top - 100
                },
                2000
            );
        }
    }
    displayInnovelContent = () => {
        return (<div className="col-md-5">
            <div align="left">
               
                <div id="contactus-content">
                <p>This holiday season, online shopping and shipping volumes are expected to be at an all-time high. As a result, some areas are experiencing delays.  We are aware of the delays with product arrival and are working to resolve as quickly as possible. We will be contacting impacted members as soon as the product has arrived to reschedule delivery.</p>
                <p>You can find more information on order status, returns, exchanges, and more, on our <a target="_blank" rel="noopener noreferrer" href="https://customerservice.costco.com">Customer Service page</a>.  Should you need further assistance, you can reach us <a target="_blank" rel="noopener noreferrer" href="https://customerservice.costco.com/app/answers/detail/a_id/8162">here</a>.</p>
                </div>
            </div>
        </div>)
    }
    render() {
        this.scrollToDiv();
        return (<div style={{ paddingTop: '75px' }}>
            <TopBanner />
            <br />
            <br />
            <div className="row px-0" style={{ height: '100%' }}>
                <div className="col-md-1">
                    <br />
                </div>
                {this.displayInnovelContent()}
                <RightBanner />
            </div>
        </div>
        )
    }
}

export default ContactUs;