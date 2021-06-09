import React from 'react';
import IdleTimer from 'react-idle-timer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TimeOutModal } from '../containers/common/timeOutModal.js';
import { clearSessionStorage } from '../containers/common/innovel_util';
import { withRouter } from 'react-router-dom';

class LogoffLayer extends React.Component {
  constructor(props) {
    super(props);

    this.idleTimer = null;

    this.state = {
      //onIdle check time = 5 minutes
      timeout: 300000,
      showModal: false,
      isTimedOut: false,
      timer: null
    };
  }

  onAction = e => {
    if (!this.state.showModal) {
      this.setState({ isTimedOut: false });
    }
  };

  onActive = e => {
    if (!this.state.showModal) {
      this.setState({ isTimedOut: false });
    }
  };

  onIdle = async e => {
    await this.setState({ showModal: true, isTimedOut: true });
    this.idleTimer.pause();
    this.startTimer();
  };

  startTimer = () => {
    clearInterval(this.timer);
    this.setState({
      //ModalTime = 2 min
      timerTime: 120000
    });
    this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 1000;
      if (newTime >= 0) {
        this.setState({
          timerTime: newTime
        });
      } else {
        this.handleLogout();
      }
    }, 1000);
  };

  handleClose = () => {
    this.setState({ showModal: false, isTimedOut: false });
    clearInterval(this.timer);
    this.idleTimer.reset();
  };

  handleLogout = () => {
    this.setState({ timerOn: false, showModal: false });
    clearInterval(this.state.timer);
    clearInterval(this.timer);
    clearSessionStorage();
    this.props.history.push('/userselfschedule?timeout=True');
  };

  render() {
    const { timerTime } = this.state;
    let seconds = ('0' + Math.floor((timerTime / 1000) % 60) % 60).slice(-2);
    let minutes = ('0' + Math.floor((timerTime / 60000) % 60)).slice(-2);
    return (
      <div>
        <IdleTimer
          ref={ref => {
            this.idleTimer = ref;
          }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={this.state.timeout}
          stopOnIdle={true}
        />

        <div className="">
          <TimeOutModal
            showModal={this.state.showModal}
            handleClose={this.handleClose}
            minutes={minutes}
            seconds={seconds}
          />
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    clearInterval(this.timer);
  }
}

export default withRouter(LogoffLayer);
