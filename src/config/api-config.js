let env;
let trackingHost;
let tokenHost;
let orderHost;
const context = '/innovel-services/order/api';
const tokenContext = '/innovel-services/rft/api';
let loginClient;
let trackingHome;
let alertHost;
let alertContext = '/innovel-services/alert'

env = process.env.REACT_APP_RFT_ENV || 'local';

switch (env) {
  case 'local':
    trackingHost = 'http://localhost:8080';
    orderHost = 'http://localhost:8084';
    tokenHost = 'http://localhost:8085';
    loginClient = 'http://localhost:3005';
    trackingHome = 'http://localhost:3000';
    alertHost = 'http://localhost:8089';
    break;
  case 'prod':
    trackingHost = '';
    orderHost = '';
    tokenHost = '';
    loginClient = '';
    trackingHome = '/';
    alertHost = '';
    break;
  case 'nonprod':
    trackingHost = '';
    orderHost = '';
    tokenHost = '';
    loginClient = '';
    trackingHome = '/';
    alertHost = '';
    break;
  default:
    trackingHost = 'http://localhost:8080';
    orderHost = 'http://localhost:8084';
    tokenHost = 'http://localhost:8085';
    alertHost = 'http://localhost:8089';
}

export const API_ROOT = orderHost + context;
export const API_SERVER = trackingHost + '/innovel-services';
export const TOKEN_ROOT = tokenHost + tokenContext;
export const APP_CONTEXT = '/innovel-services/order';
export const LOGIN_ROOT = loginClient + '/innovel-services/login/login';
export const TRACKING_ROOT = trackingHome;
export const ALERT_ROOT = alertHost + alertContext;