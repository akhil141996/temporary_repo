import React, { Component } from 'react';
import Header from './containers/common/header';
import Footer from './containers/common/footer';
import Home from './components/home';
import Contactus from './components/contactUs';
import newTracking from './components/newTracking';
import DeliveryDetails from './components/deliverydetails';
import Schedule from './components/schedule';
import StartPage from './components/startPage';
import Confirmation from './components/confirmation';
import UserSelfSchedule from './components/user_self_schedule';
import ScheduleResult from './components/scheduleResult';
import { Route, Switch } from 'react-router-dom';
import NotFound from './components/notFound';

class App extends Component {
  render() {
    return (
      <div style={{overflowX: "hidden"}}>
        <Header name="innovelHeader" />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/contactus" component={Contactus} />
          <Route path="/tracking" component={newTracking} />
          <Route path="/userselfschedule" component={UserSelfSchedule} />
          <Route path="/selfschedule" component={StartPage} />
          <Route path="/tracking_measure" component={DeliveryDetails} />
          <Route path="/tracking_schedule" component={Schedule} />
          <Route path="/tracking_confirmation" component={Confirmation} />
          <Route path="/schedule_result" component={ScheduleResult} />
          <Route component={NotFound} />
        </Switch>
        <Footer name="innovelFooter" />
      </div>
    );
  }
}

export default App;
