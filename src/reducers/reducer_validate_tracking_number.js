// import {VALIDATED_TRACKING_NUMBER} from '../actions';
//
// export default function (state = [], action) {
//   switch (action.type) {
//     case VALIDATED_TRACKING_NUMBER:
//       if (action.payload.status === 200){
//         return action.payload.data.serviceResponse;
//       } else if(action.payload.response === undefined || action.payload.response === null){
//             let toRet = {resultFound:false, time: Date.now};
//             var errmsg = action.payload.message;
//               toRet = {
//                   ...toRet,
//                   message:errmsg}
//                   return toRet;
//       } else if (action.payload.response !== undefined && action.payload.response !== null){
//       let toRet = {resultFound:false, time: Date.now};
//       var errmsgobj =action.payload.response.data.errors;
//       var errmsg =   errmsgobj[0].message;
//         toRet = {
//             ...toRet,
//             message:errmsg}
//             return toRet;
//       }
//     default:
//       return state;
//   }
// }
