import { apiRepo } from '../repository/apiRepo';
export const TRANSACTION_DETAIL = 'transaction_detail';
export const SCHEDULE_DELIVERY = 'schedule_delivery';
export const SCHEDULE_INCORRECT_INFO = 'schedule_incorrect_info';
export const STORE_DATE = 'store_date';
export const CREATE_SCHEDULE_DETAILS = 'create_schedule_details';
export const GET_ORDER = 'get_order';
export const FLASH_MESSAGE = 'getMessageToShow';
export const VALIDATED_ORDER = 'validated_order';
export const ORDER_SERVICE_MAINTENANCE_ALERT ='getOrderServiceMaintenanceAlert';
export const MAINTENANCE_ALERT_MESSAGE = 'showMaintenanceAlertMessage';
export const TRACKING_SERVICE_MAINTENANCE_ALERT = 'getTrackingServiceMaintenanceAlert';

export function getRecaptchaResponse(parm) {
  const request = apiRepo.serviceCallV2(
    'post',
    `/api/verifyRecaptcha/`,
    'track',
    parm
  );
  return {
    type: VALIDATED_ORDER,
    payload: request
  };
}

export function sendQuote(parm) {
  const request = apiRepo.serviceCallV2(
    'post',
    `/api/sendQuote/`,
    'track',
    parm
  );
  return {
    type: VALIDATED_ORDER,
    payload: request
  };
}
export function getTrackingDetails(parm) {
  const request = apiRepo.serviceCallV2(
    'get',
    `/api/tracking/${parm}`,
    'track'
  );
  return {
    type: VALIDATED_ORDER,
    payload: request
  };
}

export function validateTrackNbrForScheduling(parm) {
  const request = apiRepo.serviceCall(
    'get',
    `/v2/schedule/validate/trackingnumber/${parm}`
  );
  return {
    type: TRANSACTION_DETAIL,
    payload: request
  };
}

export function getTransactionDetails(parm1, parm2) {
  const request = apiRepo.serviceCall(
    'get',
    `/v2/schedule/gettrackingdetails/transactionref/${parm1}?filter=${parm2}`
  );
  return {
    type: TRANSACTION_DETAIL,
    payload: request
  };
}

export function submitForSelfScheduling(values) {
  const request = apiRepo.serviceCall(
    'put',
    `/v2/schedule/confirmation/submit`,
    values
  );
  return {
    type: SCHEDULE_DELIVERY,
    payload: request
  };
}

export function getStarter(values) {
  const request = apiRepo.serviceCall('post', `/v2/schedule/starter`, values);
  return {
    type: TRANSACTION_DETAIL,
    payload: request
  };
}

export function notifyCustomerService(values) {
  const request = apiRepo.serviceCall(
    'put',
    `/v2/schedule/confirmation/sendalert`,
    values
  );
  return {
    type: SCHEDULE_INCORRECT_INFO,
    payload: request
  };
}

export function updateScheduleDetails(values) {
  const request = apiRepo.serviceCall(
    'put',
    `/v2/schedule/deliverydate`,
    values
  );
  return {
    type: STORE_DATE,
    payload: request
  };
}

export function createScheduleDetails(values) {
  const request = apiRepo.serviceCall(
    'post',
    `/v2/schedule/deliverydate`,
    values
  );
  return {
    type: CREATE_SCHEDULE_DETAILS,
    payload: request
  };
}

// export function getOrderDetails(parm) {
//   const request = apiRepo.serviceCall('get', `/v1/schedule/getorder/${parm}`);
//   return {
//     type: GET_ORDER,
//     payload: request
//   };
// }

export function getMessageToShow(values) {
  return {
    type: FLASH_MESSAGE,
    payload: values
  };
}

export function getOrderServiceMaintenanceAlert(parm) {
  const request = apiRepo.maintenanceServiceCall(
    'get',
    `/api/v1/scheduler/maintenance`
  );
  return {
    type: ORDER_SERVICE_MAINTENANCE_ALERT,
    payload: request
  };
}

export function getTrackingServiceMaintenanceAlert(parm) {
  const request = apiRepo.maintenanceServiceCall(
    'get',
    `/api/v1/tracking/maintenance`
  );
  return {
    type: TRACKING_SERVICE_MAINTENANCE_ALERT,
    payload: request
  };
}

export function showMaintenanceAlertMessage(values) {
  return {
    type: MAINTENANCE_ALERT_MESSAGE,
    payload: values
  };
}