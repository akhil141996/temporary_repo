import React, { Component } from 'react';
//import { css } from 'react-emotion';
import { ClipLoader } from 'react-spinners';

var style = { paddingTop: '5px' };
var textStyle = { color: '#007bff', fontSize: 'large' };

export class TrackingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      displayMsg: props.displayMsg
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      displayMsg: nextProps.displayMsg
    });
  }

  render() {
    return (
      <div className="sweet-loading" align="center" style={style}>
        <div style={textStyle}>{this.state.displayMsg}</div>
        <ClipLoader
          sizeUnit={'px'}
          size={35}
          color={'#007bff'}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default TrackingSpinner;
