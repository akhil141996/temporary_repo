import React, { Component } from 'react';
import '../../styles/_font.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Link } from 'react-router-dom';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen1: false,
      dropdownOpen2: false
    };
  }

  render() {
    return (
      <div
        id="footer"
        className="container-fluid px-0 py-0 mx-0 my-0 mobile-hidden"
        style={{ background: '#D9D9D9', color: '#9e9e9e' }}
      >
        <footer style={{ padding: '40px', backgroundColor: '#e4e4e4'}}>
          <div className="footer-wrapper">
          <p className="text-center text-t4 grey-900">
              <a href="/userselfschedule">
                <span>Schedule My Delivery</span>
              </a>
            </p>

            {/* <p>
              <span>
                <a href="https://www.costco.com/privacy-policy.html">
                  Your Privacy Rights
                  </a>
              </span>
            </p> */}
            <p className="text-center text-t4 grey-900">
              <span>
                <Link to="/Tracking#divTrackOrders">Track My Delivery</Link>
              </span>
            </p>
            <p className="text-center text-t4 grey-900">
              <span>
                <a href="https://www.costco.com/">
                  Costco.com
                  </a>
              </span>
            </p>
            <p className="text-center text-t4 grey-900">
              <span>
                <a href="https://customerservice.costco.com/app/answers/detail_l/a_id/9831" target='_blank' rel='noopener noreferrer'>
                  Customer Service
                  </a>
              </span>
            </p>
          </div>
          <hr />

        <div className = "footer-wrapper">
          {/* <div  className="col-md-12 col-lg-12"> */}
          <p className="text-center text-t5 grey-800">
              <a href="https://www.costco.com/privacy-policy.html">
               Site Map
                </a>
          </p>
          <p className="text-center text-t5 grey-800">
              <a href="https://www.costco.com/privacy-policy.html">
                Terms & Conditions
                
                </a>
          </p>
          <p className="text-center text-t5 grey-800">
              <a href="https://www.costco.com/privacy-policy.html">
                Your Privacy Rights
                </a>
          </p>
          {/* </div> */}

        </div>

          <div className="py-3 px-5 d-flex align-items-center">
            <div className="col-md-12 col-lg-12">
              <p className="text-center">
                © 2020 - 2021 Costco Wholesale Corporation. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
export default Footer;