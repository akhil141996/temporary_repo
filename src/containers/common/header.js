import React from 'react';
import '../../styles/_font.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';
import {
  Nav,
  NavItem
} from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../images/costco_logistics.png';
import '../../styles/_header.scss';
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.toggle = this.toggle.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      showBurgerMenu: false,
      dropdownOpen1: false,
      dropdownOpen2: false,
      dropdownOpen3: false,
      dropdownOpen4: false,
      dropdownOpen5: false,
      dropdownOpen6: false,
      dropdownOpen7: false,
      hideHeader: false
    };
  }

  toggle(id) {
    this.setState({ [id]: !this.state[id] });
  }

  onMouseEnter(e, i) {
    this.setState({ dropdownOpen1: false });
    this.setState({ dropdownOpen2: false });
    this.setState({ dropdownOpen3: false });
    this.setState({ dropdownOpen4: false });
    this.setState({ dropdownOpen5: false });
    this.setState({ dropdownOpen6: false });
    this.setState({ dropdownOpen7: false });

    if (e === 1) {
      this.setState({ dropdownOpen1: true });
    } else if (e === 2) {
      this.setState({ dropdownOpen2: true });
    } else if (e === 3) {
      this.setState({ dropdownOpen3: true });
    } else if (e === 4) {
      this.setState({ dropdownOpen4: true });
    } else if (e === 5) {
      this.setState({ dropdownOpen5: true });
    } else if (e === 6) {
      this.setState({ dropdownOpen6: true });
    } else if (e === 7) {
      this.setState({ dropdownOpen7: true });
    }
  }

  onMouseLeave(e, i) {
    this.setState({ dropdownOpen1: false });
    this.setState({ dropdownOpen2: false });
    this.setState({ dropdownOpen3: false });
    this.setState({ dropdownOpen4: false });
    this.setState({ dropdownOpen5: false });
    this.setState({ dropdownOpen6: false });
    this.setState({ dropdownOpen7: false });
  }

  //  componentWillMount() {
  //    if(this.props.validatedTrackNumDetails === undefined ||
  //        this.props.validatedTrackNumDetails === null ||
  //        this.props.validatedTrackNumDetails.length === 0){
  //          this.setState( { orderValid: null });
  //    }
  //  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    //  if(nextProps.validatedTrackNumDetails !== undefined &&
    //     nextProps.validatedTrackNumDetails.length !== 0 &&
    //    (nextProps.validatedTrackNumDetails.isDuplicate === false &&
    //      nextProps.validatedTrackNumDetails.allowToSchedule))
    //  {
    //    this.setState( { orderValid: true});
    //  }
    //  else{
    //    this.setState( { orderValid: false});
    //  }
    if (
      nextProps.transactionDetails !== undefined &&
      nextProps.transactionDetails.length !== 0 &&
      (nextProps.transactionDetails.isDuplicate === false &&
        nextProps.transactionDetails.allowToSchedule)
    ) {
      this.setState({ hideHeader: true });
    } else {
      this.setState({ hideHeader: false });
    }
    if (
      nextProps.selfScheduleResponse !== undefined &&
      nextProps.selfScheduleResponse !== null &&
      nextProps.selfScheduleResponse.length !== 0
    ) {
      if (nextProps.selfScheduleResponse.failureType !== 1) {
        this.setState({ hideHeader: false });
      }
    }
    if (
      nextProps.scheduleIncorrectInfoResponse !== undefined &&
      nextProps.scheduleIncorrectInfoResponse !== null &&
      nextProps.scheduleIncorrectInfoResponse.length !== 0
    ) {
      if (nextProps.scheduleIncorrectInfoResponse.failureType !== 1) {
        this.setState({ hideHeader: false });
      }
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.closeBurgerMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closeBurgerMenu)
  }

  closeBurgerMenu = (e) => {
    document.body.style.backgroundColor = "white";
    if (this.wrapperRef && !this.wrapperRef.current.contains(e.target)) {
      this.setState({ showBurgerMenu: false });
    }
  }

  toggleBurgerMenu = () => {
    this.setState({ showBurgerMenu: !this.state.showBurgerMenu })
  }

  render() {
    if (this.state.hideHeader) {
      return <div />;
    }

    return (
      <div
        className="navbar-header nav-border"
        ref={this.wrapperRef}
      >
        <a className="navbar-brand logo-fix" href="/" style={{ padding: '1rem 0rem' }}>
          <img
            src={logo}
            alt="Costco Logistics"
            className="logo"
          />
        </a>
        <div className="navbar-expand-sm navbar-light hide-sm">
          <button
            className="navbar-toggler"
            type="button"
            style={{
              borderColor: 'transparent',
            }}
            onClick={this.toggleBurgerMenu}
          >
            <span className="navbar-toggler-icon" />
            <span className="text-t7" style={{ display: 'block' }}>Menu</span>
          </button>
        </div>
        <div className="nav navbar-lg-view navbar-nav pull-right">
          <NavItem className="separator">
            <Link to="/userselfschedule" className="nav-font">
              Schedule My Delivery
            </Link>
          </NavItem>
          <NavItem className="separator">
            <Link to="/tracking#divTrackOrders" className="nav-font">
              Track My Delivery
            </Link>
          </NavItem>
          <NavItem className="separator">
            <a href="https://customerservice.costco.com/app/answers/detail_l/a_id/9831" className="nav-font" target='_blank' rel='noopener noreferrer' onClick={this.toggleBurgerMenu}>
              Customer Service
              </a>
          </NavItem>
          <NavItem>
            <a href="https://www.costco.com/" className="nav-font" target='_blank' rel='noopener noreferrer' onClick={this.toggleBurgerMenu}>
              Costco.com
            </a>
          </NavItem>
          {/* <NavItem>
            <a href="https://customerservice.costco.com/app/answers/detail_l/a_id/9831" className="nav-font" target='_blank' rel='noopener noreferrer' onClick={this.toggleBurgerMenu}>
              Help
            </a>
          </NavItem> */}

        </div>
        <Nav
          onMouseLeave={this.onMouseLeave.bind(this, 1)}
          className={`navbar navbar-toggleable-md navbar-fixed-top justify-content-end navbar-custom ${this.state.showBurgerMenu ? 'show' : ''}`}
          style={{
            float: 'right',
            position: 'relative',
            top: 0,
            bottom: 0,
            left: -26,
            marginTop: 220,
            marginRight: -30,
            right: 40,
            border: "1px solid #9c9c9c",
            padding: 0,
            boxShadow: "0px 5px 10px #333333",
            blur: 10
          }}
        >
          <div className="nav navbar-nav pull-right hide-sm">
            <NavItem className="menu-nav-item">
              <Link to="/userselfschedule" className="menu-nav-font" onClick={this.toggleBurgerMenu}>
                Schedule My Delivery
              </Link>
            </NavItem>
            <NavItem className="menu-nav-item">
              <Link to="/tracking#divTrackOrders" className="menu-nav-font" onClick={this.toggleBurgerMenu}>
                Track My Delivery
              </Link>
            </NavItem>
            <NavItem className="menu-nav-item">
              <a href="https://customerservice.costco.com/app/answers/detail_l/a_id/9831" className="menu-nav-font" target='_blank' rel='noopener noreferrer' onClick={this.toggleBurgerMenu}>
                Customer Service
              </a>
            </NavItem>
            <NavItem className="menu-nav-item">
              <a href="https://www.costco.com/" className="menu-nav-font" target='_blank' rel='noopener noreferrer' onClick={this.toggleBurgerMenu}>
                Costco.com
            </a>
            </NavItem>

          </div>
        </Nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    transactionDetails: state.transactionDetails,
    selfScheduleResponse: state.selfScheduleResponse,
    scheduleIncorrectInfoResponse: state.scheduleIncorrectInfoResponse
  };
}

export default connect(mapStateToProps, null)(Header);
