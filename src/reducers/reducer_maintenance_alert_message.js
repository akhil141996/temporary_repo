import {ORDER_SERVICE_MAINTENANCE_ALERT,TRACKING_SERVICE_MAINTENANCE_ALERT,DISABLE_ALERT_COMPONENT,ENABLE_ALERT_COMPONENT } from '../actions';


export default function (state = [], action) {
  switch (action.type) {
    case ORDER_SERVICE_MAINTENANCE_ALERT:
        let maintenanceOrderAlertMessage = (action && action.payload && action.payload.data && action.payload.data.serviceResponse && action.payload.data.serviceResponse.alertMessageResponse) ? action.payload.data.serviceResponse.alertMessageResponse.message : undefined;
        
        let maintenanceOrderAlertMessageObject = {alertType: 'Maintenance',
                     message: maintenanceOrderAlertMessage
                    };
        return maintenanceOrderAlertMessageObject;
    case TRACKING_SERVICE_MAINTENANCE_ALERT:
        let maintenanceTrackingAlertMessage = (action && action.payload && action.payload.data && action.payload.data.serviceResponse && action.payload.data.serviceResponse.alertMessageResponse ) ? action.payload.data.serviceResponse.alertMessageResponse.message : undefined;
        
        let maintenanceTrackingAlertMessageObject = {alertType: 'Maintenance',
                     message: maintenanceTrackingAlertMessage                     
                    };
        return maintenanceTrackingAlertMessageObject;
    default:
        return state;
    }
}
