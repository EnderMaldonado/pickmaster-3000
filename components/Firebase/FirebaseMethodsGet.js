import dbRef from '../Firebase/firebase'

export const getData = (targetChild) => new Promise((resolve, reject) => {
  try {
      dbRef.child(targetChild).once("value", dataReaded => resolve(dataReaded.val()))
  } catch (e) {
      reject(e)
  }
})

export const getHistory = (targetChild, callbackBefore, callbackAfter, callbackError) => {
  if(callbackBefore)callbackBefore()
  try {
      dbRef.child(targetChild).orderByChild("timeLineDate").once("value", dataReaded => {
        if(callbackAfter)callbackAfter(dataReaded.val())
      })
  } catch (e) {
      if(callbackError)callbackError(e)
  }
}

export const getPmOrderData = (pmOrderSku) => new Promise((resolve, reject) => {
  try {
      dbRef.child(`PMOrders/${pmOrderSku}`).once("value", dataReaded => resolve(dataReaded.val()))
  } catch (e) {
      reject(e)
  }
})

export const getPmOrderNumber = (pmOrderSku) => new Promise((resolve, reject) => {
  try {
      dbRef.child(`PMOrders/${pmOrderSku}/pmOrderNumber`).once("value", dataReaded => {
        resolve(dataReaded.val())
      })
  } catch (e) {
      reject(e)
  }
})

export const getPmOrderStatus = (pmOrderSku) => new Promise((resolve, reject) => {
  try {
      dbRef.child(`PMOrders/${pmOrderSku}/status`).once("value", dataReaded => {
        resolve(dataReaded.val())
      })
  } catch (e) {
      reject(e)
  }
})

export const getPmOrderProperty = (pmOrderSku, property) => new Promise((resolve, reject) => {
  try {
      dbRef.child(`PMOrders/${pmOrderSku}`).child(property).once("value", dataReaded => {
        resolve(dataReaded.val())
      })
  } catch (e) {
      reject(e)
  }
})

export const getPmSsOrderNumber = (pmOrderSku, pmSsOrderId) => new Promise((resolve, reject) => {
  try {
      dbRef.child(`PMOrders/${pmOrderSku}/shipstationOrders/${pmSsOrderId}/ssOrderNumber`).once("value", dataReaded => {
        resolve(dataReaded.val())
      })
  } catch (e) {
      reject(e)
  }
})

export const getPmSsOrderProperty = (pmOrderSku, pmSsOrderId, property) => new Promise((resolve, reject) => {
  try {
      dbRef.child(`PMOrders/${pmOrderSku}/shipstationOrders/${pmSsOrderId}`).child(property).once("value", dataReaded => {
        resolve(dataReaded.val())
      })
  } catch (e) {
      reject(e)
  }
})

export const existTargetChild = existTargetChild => new Promise((resolve, reject) => {
  try {
      dbRef.child(existTargetChild).once("value", dataReaded => {
        resolve(dataReaded.exists())
      })
  } catch (e) {
      reject(e)
  }
})

export const existPmOrder = (pmOrderSku) => new Promise((resolve, reject) => {
  try {
      dbRef.child("PMOrders").child(pmOrderSku).once("value", dataReaded => {
        resolve(dataReaded.exists())
      })
  } catch (e) {
      reject(e)
  }
})

export const existPmSsOrder = (pmOrderSku, pmSsOrderId) => new Promise((resolve, reject) => {
  try {
      dbRef.child(`PMOrders/${pmOrderSku}/shipstationOrders`).child(pmSsOrderId).once("value", dataReaded => {
        resolve(dataReaded.exists())
      })
  } catch (e) {
      reject(e)
  }
})

export const getRegisterPMCancelled = id => new Promise((resolve, reject) => {
  try {
      dbRef.child('PMOrders').orderByChild("sfyOrderSku").equalTo(id.toString())
      .once("value", dataReaded => {resolve(dataReaded.val())})
  } catch (e) {
    console.log(e)
    reject(e)
  }
})

export const getPmOrdersFinalized = () => new Promise((resolve, reject) => {
  try {
      dbRef.child('PMOrders').orderByChild("status").equalTo("FINALIZED")
      .once("value", dataReaded => {resolve(dataReaded.val())})
  } catch (e) {
    console.log(e)
    reject(e)
  }
})
