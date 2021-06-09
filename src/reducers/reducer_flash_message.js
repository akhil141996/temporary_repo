import {FLASH_MESSAGE, } from '../actions';

export default function (state = [], action) {
  switch (action.type) {
    case FLASH_MESSAGE:
        let toRet = {alertType: action.payload.alertType,
                        message: action.payload.message,
                        time: Date.now(), };
        return toRet;
    default:
        return state;
    }
}
