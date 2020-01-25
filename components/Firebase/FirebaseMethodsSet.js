import dbRef from '../Firebase/firebase'

export const addRomaneoPrinted = (romaneo, romaneosPrinted) => {
  if(!romaneosPrinted.includes(romaneo))
    firebase.database().ref('/').child('romaneosPrinted').set([...romaneosPrinted, romaneo], (err, mes) => console.log(err, mes))
}

export const addRomaneosPrinted = (romaneos, romaneosPrinted) => {
  firebase.database().ref('/').child('romaneosPrinted').set([...romaneosPrinted, ...romaneos])
}

//Nuevo...

export const addData = (targetChild, key, data) => new Promise((resolve, reject) =>{
  dbRef.child(targetChild).child(key).set(data, err => {
    if(err)
      reject(err)
    else
      dbRef.child(targetChild).child(key).once("value", dataReaded => resolve(dataReaded.val()))
  })
})

export const updateData = (targetChild, data) => new Promise((resolve, reject) =>{
  dbRef.child(targetChild).set(data, err => {
    if(err)
      reject(err)
    else
      dbRef.child(targetChild).once("value", dataReaded => resolve(dataReaded))
  })
})

export const addUpdatePMOrder = (pmOrderSku, data) => new Promise((resolve, reject) =>{
  dbRef.child("PMOrders").child(pmOrderSku).set(data, err => {
    if(err)
      reject(err)
    else
      dbRef.child("PMOrders").child(pmOrderSku).once("value", dataReaded => resolve(dataReaded.val()))
  })
})

export const addUpdatePropertyPmOrder = (property, pmOrderSku, data) => new Promise((resolve, reject) =>{
  dbRef.child("PMOrders").child(pmOrderSku).child(property).set(data, err => {
    if(err)
      reject(err)
    else
      dbRef.child("PMOrders").child(pmOrderSku).child(property).once("value", dataReaded => resolve(dataReaded.val()))
  })
})

export const addUpdatePMSsOrder = (pmOrderSku, pmSsOrderId, data) => new Promise((resolve, reject) =>{
  dbRef.child("PMOrders").child(pmOrderSku).child("shipstationOrders").child(pmSsOrderId).set(data, err => {
    if(err)
      reject(err)
    else
      dbRef.child("PMOrders").child(pmOrderSku).child("shipstationOrders").child(pmSsOrderId).once("value", dataReaded => resolve(dataReaded.val()))
  })
})

export const addUpdatePropertyPmSsOrder = (property, pmOrderSku, pmSsOrderId, data) => new Promise((resolve, reject) =>{
  dbRef.child("PMOrders").child(pmOrderSku).child("shipstationOrders").child(pmSsOrderId).child(property).set(data, err => {
    if(err)
      reject(err)
    else
      dbRef.child("PMOrders").child(pmOrderSku).child("shipstationOrders").child(pmSsOrderId).child(property).once("value", dataReaded => resolve(dataReaded.val()))
  })
})

export const setStatusPmOrder = (pmOrderSku, status) => new Promise((resolve, reject) =>{
  dbRef.child(`PMOrders/${pmOrderSku}`).child("status").set(status, err => {
    if(err)
      reject(err)
    else
      dbRef.child(`PMOrders/${pmOrderSku}`).child("status").once("value", dataReaded => resolve(dataReaded.val()))
  })
})

export const setStatusPmSsOrder = (pmOrderSku, pmSsOrderId, status) => new Promise((resolve, reject) =>{
  dbRef.child(`PMOrders/${pmOrderSku}/shipstationOrders`).child(pmSsOrderId).child("status").set(status, err => {
    if(err)
      reject(err)
    else
      dbRef.child(`PMOrders/${pmOrderSku}/shipstationOrders`).child(pmSsOrderId).child("status").once("value", dataReaded => resolve(dataReaded.val()))
  })
})

export const addTimelineToGlobalHistory = (textTimeline, timeLineDate, pmOrderSku, pmOrderNumber) => new Promise((resolve, reject) =>{
  dbRef.child("History").push({
    textTimeline,
    timeLineDate,
    pmOrderSku,
    pmOrderNumber
  }, err => {
    if(err)
      reject(err)
    else
      resolve(true)
  })
})

export const addTimelineToPMOrderHistory = (textTimeline, textTimelineGlobal, timeLineDate, pmOrderSku, pmOrderNumber) => new Promise((resolve, reject) =>{
  dbRef.child(`PMOrders/${pmOrderSku}`).child("history").push({
    textTimeline,
    timeLineDate,
    pmOrderSku,
    pmOrderNumber
  }, err => {
    if(err)
      reject(err)
    else
      addTimelineToGlobalHistory(textTimelineGlobal, timeLineDate, pmOrderSku, pmOrderNumber)
      .then(res => resolve(res))
      .catch(err => reject(ree))
  })
})

export const addTimelineToPMShipstationOrderHistory = (textTimeline, textTimelinePmOrder, textTimelineGlobal, timeLineDate, pmOrderSku, pmOrderNumber, pmSsOrderId) => new Promise((resolve, reject) =>{
  dbRef.child(`PMOrders/${pmOrderSku}/shipstationOrders/${pmSsOrderId}`).child("history").push({
    textTimeline,
    timeLineDate,
    pmOrderSku,
    pmOrderNumber
  }, err => {
    if(err)
      resolove(err)
    else
      addTimelineToPMOrderHistory(textTimelinePmOrder, textTimelineGlobal, timeLineDate, pmOrderSku, pmOrderNumber)
      .then(res => resolve(res))
      .catch(err => reject(ree))
  })
})

export const addSfyOrderToPMOrdersWarnings = (pmOrderSku, pmOrderNumber, status, warningMessage) => new Promise((resolve, reject) =>{
  let data = {pmOrderSku, pmOrderNumber, status, warningMessage}
  dbRef.child("PMOrdersWarning").child(pmOrderSku).set(data, err => {
    if(err)
      reject(err)
  })
})

export const deleteNode = (targetChild) => new Promise((resolve, reject) =>{
  try {
    dbRef.child(targetChild).remove()
    resolve(true)
  } catch (error) {
    console.log(error)
    reject(error)
  }
})