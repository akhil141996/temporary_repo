import { SCHEDULE_INCORRECT_INFO } from '../actions';

export default function(state = [], action) {
  switch (action.type) {
    case SCHEDULE_INCORRECT_INFO:
      if (action.payload.status === 200) {
        return action.payload.data.serviceResponse;
      } else if (
        action.payload.response === undefined ||
        action.payload.response === null
      ) {
        let toRet = { resultFound: false, time: Date.now };
        let errmsg = action.payload.message;
        toRet = {
          ...toRet,
          message: errmsg
        };
        return toRet;
      } else if (
        (action.payload.response !== undefined ||
          action.payload.response !== null) &&
        action.payload.response.status === 400
      ) {
        let toRet = { resultFound: false, time: Date.now };
        var errmsgobj = action.payload.response.data.errors;
        let errmsg = errmsgobj[0].message;
        toRet = {
          ...toRet,
          message: errmsg
        };
        return toRet;
      }
      break;
    default:
      return state;
  }
}
