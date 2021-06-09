import axios from 'axios';
import { API_ROOT } from '../config/api-config';
import { API_SERVER } from '../config/api-config';
import { TOKEN_ROOT } from '../config/api-config';
import { APP_CONTEXT } from '../config/api-config';
import { ALERT_ROOT } from '../config/api-config';

const PREFIX_LOGIN = 'Bearer ';

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response) {
      if (error.response.status === 401) {
        // uses windows sessionStorage
        localStorage.removeItem('token');
        window.location.href = APP_CONTEXT + '/login';
      } else if (error.response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = APP_CONTEXT + '/unauth';
      }
    }
    return Promise.reject(error);
  }
);

class ApiRepo {
  serviceCall = (httpMethod, path, inputParams, header) => {
    let url = '';

    if (path === '/oauth/token' || path === '/oauth/revoke-token') {
      url = TOKEN_ROOT + path;
      // url = "http://localhost:8085/innovel-services/rft/api/oauth/token";
      //           url = "http://localhost:8085/innovel-services/rft/api/oauth/token";
    } else {
      url = API_ROOT + path;
    }

    // setting access token
    let headerToSet;
    if (header === undefined) {
      if (localStorage.getItem('token') !== null) {
        headerToSet = {
          headers: {
            Authorization: PREFIX_LOGIN + localStorage.getItem('token'),
            'innovel-beta': 'true'
          }
        };
      } else {
        headerToSet = {
          headers: {
            'innovel-beta': 'true'
          }
        };
      }
    } else {
      if (localStorage.getItem('token') !== null) {
        headerToSet = {
          headers: {
            ...header,
            'innovel-beta': 'true',
            Authorization: PREFIX_LOGIN + localStorage.getItem('token')
          }
        };
      } else {
        headerToSet = { headers: { ...header, 'innovel-beta': 'true' } };
      }
    }

    switch (httpMethod) {
      case 'get':
        return axios.get(url, headerToSet);
      case 'post':
        return axios.post(url, inputParams, headerToSet);
      case 'put':
        return axios.put(url, inputParams, headerToSet);
      case 'delete':
        return axios.delete(url, headerToSet);
      default:
        throw new Error('Unsupported http method');
    }
  };

  maintenanceServiceCall = (httpMethod, path, inputParams, header) => {
    let url = ALERT_ROOT + path;

    switch (httpMethod) {
      case 'get':
        return axios.get(url);
      default:
        throw new Error('Unsupported http method');
    }
  };
  
  serviceCallV2 = (httpMethod, path, context, inputParams, header) => {
    var contextPath = '';
    switch (context) {
      case 'track':
        contextPath = '';
        break;
      default:
        contextPath = '';
        break;
    }

    let url = '';
    url = API_SERVER + contextPath + path;

    // setting access token
    let headerToSet;
    if (header === undefined) {
      if (localStorage.getItem('token') !== null) {
        headerToSet = {
          headers: {
            'innovel-beta': 'true',
            Authorization: PREFIX_LOGIN + localStorage.getItem('token')
          }
        };
      } else {
        headerToSet = {
          headers: {
            'innovel-beta': 'true'
          }
        };
      }
    } else {
      if (localStorage.getItem('token') !== null) {
        headerToSet = {
          headers: {
            ...header,
            'innovel-beta': 'true',
            Authorization: PREFIX_LOGIN + localStorage.getItem('token')
          }
        };
      } else {
        headerToSet = { headers: { ...header, 'innovel-beta': 'true' } };
      }
    }

    switch (httpMethod) {
      case 'get':
        return axios.get(url, headerToSet);
      case 'post':
        return axios.post(url, inputParams, headerToSet);
      case 'put':
        return axios.put(url, inputParams, headerToSet);
      case 'delete':
        return axios.delete(url, headerToSet);
      default:
        throw new Error('Unsupported http method');
    }
  };
}

export let apiRepo = new ApiRepo();
