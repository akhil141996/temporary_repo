import { STORE_DATE, CREATE_SCHEDULE_DETAILS } from '../actions';

export default function(state = [], action) {
  switch (action.type) {
    case STORE_DATE:
      if (action.payload.status === 200) {
        return action.payload.data.serviceResponse;
      } else {
        let toRet = { resultFound: false, time: Date.now };
        let errmsg = action.payload.message;
        toRet = {
          ...toRet,
          message: errmsg
        };
        return toRet;
      }
    case CREATE_SCHEDULE_DETAILS:
      if (action.payload.status === 200) {
        return action.payload.data.serviceResponse;
      } else {
        let toRet = { resultFound: false, time: Date.now };
        let errmsg = action.payload.message;
        toRet = {
          ...toRet,
          message: errmsg
        };
        return toRet;
      }

    default:
      return state;
  }
}
