import { combineReducers } from 'redux';
import ValidateTrackingNumberReducer from './reducer_validate_tracking_number';
import TransactionDetailsReducer from './reducer_get_transaction_details';
import SelfScheduleSubmitReducer from './reducer_self_schedule_submit';
import ScheduleIncorrectInfoReducer from './reducer_schedule_incorrect_info';
import StoreDeliveryDateReducer from './reducer_store_deliverydate';
import FlashMessageReducer from './reducer_flash_message';
import MaintenanceAlertMessageReducer from './reducer_maintenance_alert_message';

const reducers = {
  validatedTrackNumDetails: ValidateTrackingNumberReducer,
  transactionDetails: TransactionDetailsReducer,
  selfScheduleResponse: SelfScheduleSubmitReducer,
  scheduleIncorrectInfoResponse: ScheduleIncorrectInfoReducer,
  storeDeliveryDate: StoreDeliveryDateReducer,
  flashMessage: FlashMessageReducer,
  maintenanceAlertMessage: MaintenanceAlertMessageReducer
};
const reducer = combineReducers(reducers);

export default reducer;
