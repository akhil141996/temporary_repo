import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Nav, NavLink } from 'reactstrap';
import DynamicTabsList from './dynamic_tabs_list';
import styles from '../../styles.css.js';

export class InnovelTabNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableTabs: true
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.transactionStatus !== undefined &&
      this.props.transactionStatus.pageNavigation !== undefined &&
      this.props.transactionStatus.pageNavigation !== null &&
      prevProps.transactionStatus !== this.props.transactionStatus
    ) {
      this.setUpTabs(this.props.transactionStatus.pageNavigation);
      this.setState({
        transactionDetails: this.props.transactionStatus,
        enableTabs: true
      });
    } else if (
      this.props.initInfo !== undefined &&
      this.props.initInfo.serviceResponse !== undefined &&
      this.props.initInfo.serviceResponse &&
      prevProps.initInfo.serviceResponse !== this.props.initInfo.serviceResponse
    ) {
      this.setUpTabs(this.props.initInfo.serviceResponse.pageNavigation);
      let transactionDetails = {};
      transactionDetails.pageNavigation = this.props.initInfo.pageNavigation;
      this.setState({
        transactionDetails: transactionDetails,
        enableTabs: true
      });
    }

    if (prevProps.transactionStatus !== this.props.transactionStatus) {
      this.setState({
        enableTabs: true
      });
    }
  }

  setUpTabs = pageNavigation => {
    const navigation = _.entries(pageNavigation);
    let tabCount = navigation.length;

    this.setState({
      tabCount: tabCount,
      navigation: navigation
    });
  };
  findPageName = (myArray, value) => {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i][1] === value) {
        return myArray[i][0];
      }
    }
  };
  getDisplayNameTab(tabName, orderType) {
    if (tabName === 'tracking_schedule') return 'Select Your Date';
    if (tabName === 'tracking_measure') return 'Delivery Preparation';
    if (tabName === 'tracking_confirmation')
      return orderType === 4 ? 'Confirmation' : 'Confirm Address';
    return '??';
  }
  enableTab = (transactionDetails, index, enableTabs) => {
    var path = window.location.pathname;
    var pathToSet = path.substr(path.lastIndexOf('/') + 1, path.length - 1);
    const navigation = _.entries(transactionDetails.pageNavigation);
    let tabName = this.findPageName(navigation, index);
    //return true to enable tab
    if (!enableTabs) return false;
    if (transactionDetails.scheduleOrderType === 4) {
      if (index === 0 && pathToSet !== 'tracking_schedule') return true;
      if (
        tabName === 'tracking_measure' &&
        transactionDetails.schedule &&
        pathToSet !== 'tracking_measure'
      )
        return true;
      if (
        tabName === 'tracking_confirmation' &&
        transactionDetails.schedule &&
        transactionDetails.deliveryDetail &&
        pathToSet !== 'tracking_confirmation'
      )
        return true;
      return false;
    } else if (transactionDetails.scheduleOrderType === 5) {
      if (index === 0 && pathToSet !== 'tracking_measure') return true;
      if (
        tabName === 'tracking_confirmation' &&
        transactionDetails.deliveryDetail &&
        pathToSet !== 'tracking_confirmation'
      )
        return true;
      return false;
    }
  };
  render() {
    var path = window.location.pathname;
    var pathToSet = path.substr(path.lastIndexOf('/') + 1, path.length - 1);
    return (
      <div style={styles.headerbotompart}>
        <Nav>
          <DynamicTabsList numTabs={this.state.tabCount}>
            {index => (
              <NavLink key={index} style={true ? {} : { display: 'none' }}>
                {!(
                  pathToSet.toUpperCase() ===
                  this.findPageName(this.state.navigation, index).toUpperCase()
                ) && (
                  <Link
                    key={index}
                    style={
                      this.enableTab(
                        this.state.transactionDetails,
                        index,
                        this.state.enableTabs
                      ) ? (
                        {}
                      ) : (
                        { pointerEvents: 'none' }
                      )
                    }
                    to={this.findPageName(this.state.navigation, index)}
                    className="active"
                  >
                    {this.getDisplayNameTab(
                      this.findPageName(this.state.navigation, index),
                      this.state.transactionDetails.scheduleOrderType
                    )}
                  </Link>
                )}
                {pathToSet.toUpperCase() ===
                  this.findPageName(
                    this.state.navigation,
                    index
                  ).toUpperCase() && (
                  <p style={{ color: '#F15D22' }}>
                    {this.getDisplayNameTab(
                      this.findPageName(this.state.navigation, index),
                      this.state.transactionDetails.scheduleOrderType
                    )}
                  </p>
                )}
              </NavLink>
            )}
          </DynamicTabsList>
        </Nav>
        <br />
      </div>
    );
  }
}
