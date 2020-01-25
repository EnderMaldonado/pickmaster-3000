import {getPmOrderStatus} from '../Firebase/FirebaseMethodsGet'
import {setStatusPmOrder, setStatusPmSsOrder} from '../Firebase/FirebaseMethodsSet'

export const advanceInProcess = (pmOrderSku, status) => new Promise((resolve, reject) => {
    let statusNew = ""
    switch (status) {
      case "In Process (1/4)": statusNew = "In Process (2/4)";
        break;
      case "In Process (2/4)": statusNew = "In Process (3/4)";
        break;
      case "In Process (3/4)": statusNew = "In Process (4/4)";
        break;
      default:
        statusNew = status
    }
  setStatusPmOrder(pmOrderSku, statusNew)
    .then(res => resolve(res))
    .catch(err => {console.log(err);reject(err)})
})

export const advanceStatusProcessIfCan = (pmOrderSku, statusNeeded) => new Promise((resolve, reject) => {
  getPmOrderStatus(pmOrderSku)
  .then(status => {
    if(status === statusNeeded)
      return advanceInProcess(pmOrderSku, status)
  })
  .then(res => resolve(res))
  .catch(err => {console.log(err);reject(err)})
})

export const setPmOrderFinalizeStatus = pmOrderSku => new Promise((resolve, reject) => {
    setStatusPmOrder(pmOrderSku, "FINALIZED")
    .then(res => resolve(res))
    .catch(err => {console.log(err);reject(err)})
})

export const setPmOrderCancelledStatus = pmOrderSku => new Promise((resolve, reject) => {
    setStatusPmOrder(pmOrderSku, "CANCELLED")
    .then(res => resolve(res))
    .catch(err => {console.log(err);reject(err)})
})

export const setPmOrderRemakeStatus = pmOrderSku => new Promise((resolve, reject) => {
    setStatusPmOrder(pmOrderSku, "REMAKE")
    .then(res => resolve(res))
    .catch(err => {console.log(err);reject(err)})
})


export const setPmSsOrderProcessedStatus = (pmOrderSku, pmSsOrderId) => new Promise((resolve, reject) => {
    setStatusPmSsOrder(pmOrderSku, pmSsOrderId, "Processed")
    .then(res => resolve(res))
    .catch(err => {console.log(err);reject(err)})
})

export const setPmSsOrderCancelledStatus = (pmOrderSku, pmSsOrderId) => new Promise((resolve, reject) => {
    setStatusPmSsOrder(pmOrderSku, pmSsOrderId, "Cancelled")
    .then(res => resolve(res))
    .catch(err => {console.log(err);reject(err)})
})

export const setPmSsOrderRemakeStatus = (pmOrderSku, pmSsOrderId) => new Promise((resolve, reject) => {
    setStatusPmSsOrder(pmOrderSku, pmSsOrderId, "Remake")
    .then(res => resolve(res))
    .catch(err => {console.log(err);reject(err)})
})
