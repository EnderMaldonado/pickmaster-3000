import {addTimelineToGlobalHistory, addTimelineToPMOrderHistory, addTimelineToPMShipstationOrderHistory} from '../Firebase/FirebaseMethodsSet'
import {getPmOrderNumber, getPmSsOrderNumber} from '../Firebase/FirebaseMethodsGet'

// P I C K M A S T E R   O R D E R S . . .

const PMORDER_CREATED = "PMORDER_CREATED"
const PMORDER_ROMANEO_PRINTED = "PMORDER_ROMANEO_PRINTED"
const PMORDER_ROMANEO_SCANNED = "PMORDER_ROMANEO_SCANNED"
const PMORDER_REDONE = "PMORDER_REDONE"
const PMORDER_CANCELLED = "PMORDER_CANCELLED"
const PMORDER_FINALIZED = "PMORDER_FINALIZED"
const PMORDER_PRODUCTS_SCANNED = "PMORDER_PRODUCTS_SCANNED"
const PMORDER_REEDITED = "PMORDER_REEDITED"

const getPMOrderTimeLineType = type => {
  switch (type) {
    case PMORDER_CREATED:
      return "Pickmaster Order <pmOrderNumber> <created>Created</created>"
    case PMORDER_ROMANEO_PRINTED:
      return "Pickmaster Order <pmOrderNumber> Printed"
    case PMORDER_ROMANEO_SCANNED:
      return "Pickmaster Order <pmOrderNumber> Scanned from Romaneo"
    case PMORDER_REDONE:
      return "Pickmaster Order <pmOrderNumber> <redone>Redone</redone>"
    case PMORDER_CANCELLED:
      return "Pickmaster Order <pmOrderNumber> <cancel>Cancelled</cancel>"
    case PMORDER_FINALIZED:
      return "Pickmaster Order <pmOrderNumber> <finalized>Finalized</finalized>"
    case PMORDER_PRODUCTS_SCANNED:
      return "Pickmaster Order <pmOrderNumber> Products Scanned"
    case PMORDER_REEDITED:
      return "Pickmaster Order <pmOrderNumber> Re Edited"
    default:
      return "void"
  }
}


const setTimeLinePMOrder = (pmOrderSku, dateTime, type) => new Promise((resolve, reject) => {

  let textTimeline = getPMOrderTimeLineType(type)

  getPmOrderNumber(pmOrderSku)
  .then(pmOrderNumber =>
    addTimelineToPMOrderHistory(
      textTimeline,
      textTimeline,
      dateTime, pmOrderSku, pmOrderNumber
    )
  )
  .then(res => resolve(res))
  .catch(err => reject(err))
})

export const stlPmOrder_Created = (pmOrderSku, dateTime) =>
  setTimeLinePMOrder(pmOrderSku, dateTime, PMORDER_CREATED)
export const stlPmOrder_RomaneoPrinted = (pmOrderSku, dateTime) =>
  setTimeLinePMOrder(pmOrderSku, dateTime, PMORDER_ROMANEO_PRINTED)
export const stlPmOrder_RomaneoScanned = (pmOrderSku, dateTime) =>
  setTimeLinePMOrder(pmOrderSku, dateTime, PMORDER_ROMANEO_SCANNED)
export const stlPmOrder_Redone = (pmOrderSku, dateTime) =>
  setTimeLinePMOrder(pmOrderSku, dateTime, PMORDER_REDONE)
export const stlPmOrder_Cancelled = (pmOrderSku, dateTime) =>
  setTimeLinePMOrder(pmOrderSku, dateTime, PMORDER_CANCELLED)
export const stlPmOrder_Finalized = (pmOrderSku, dateTime) =>
  setTimeLinePMOrder(pmOrderSku, dateTime, PMORDER_FINALIZED)
export const stlPmOrder_ProductsScanned = (pmOrderSku, dateTime) =>
  setTimeLinePMOrder(pmOrderSku, dateTime, PMORDER_PRODUCTS_SCANNED)
export const stlPmOrder_ReEdited = (pmOrderSku, dateTime) =>
  setTimeLinePMOrder(pmOrderSku, dateTime, PMORDER_REEDITED)

export const stlPmOrder_Comentary = (pmOrderSku, comentary, dateTime) => new Promise((resolve, reject) => {
  getPmOrderNumber(pmOrderSku)
  .then(pmOrderNumber =>
    addTimelineToPMOrderHistory(
      `PM Order <pmOrderNumber> Comentary: <cmry>${comentary}</cmry>`,
      `PM Order <pmOrderNumber> Comentary: <cmry>${comentary}</cmry>`,
      dateTime, pmOrderSku, pmOrderNumber
    )
  )
  .then(res => resolve(res))
  .catch(err => reject(err))
})

export const stlPmOrder_RemakeReason = (pmOrderSku, comentary, dateTime) => new Promise((resolve, reject) => {

  getPmOrderNumber(pmOrderSku)
  .then(pmOrderNumber =>
    addTimelineToPMOrderHistory(
      `PM Order <pmOrderNumber> Remake Reason: <mkrR>${comentary}</mkrR>`,
      `PM Order <pmOrderNumber> Remake Reason: <mkrR>${comentary}</mkrR>`,
      dateTime, pmOrderSku, pmOrderNumber
    )
  )
  .then(res => resolve(res))
  .catch(err => reject(err))
})



// P I C K M A S T E R   S H I P S T A T I O N   O R D E R S . . .

const PM_SHIPSTATION_PACKED = "PM_SHIPSTATION_PACKED"
const PM_SHIPSTATION_EDITED = "PM_SHIPSTATION_EDITED"
const PM_SHIPSTATION_PROCESSED = "PM_SHIPSTATION_PROCESSED"
const PM_SHIPSTATION_LABEL_DOWNLOADED = "PM_SHIPSTATION_LABEL_DOWNLOADED"
const PM_SHIPSTATION_CANCELLED = "PM_SHIPSTATION_CANCELLED"
const PM_SHIPSTATION_REDONE = "PM_SHIPSTATION_REDONE"
const PM_SHIPSTATION_LABEL_PRINTED = "PM_SHIPSTATION_LABEL_PRINTED"

const getPMShipstationOrderTimeLineType = type => {
  switch (type) {
    case PM_SHIPSTATION_PACKED:
      return "PM Shipstation Order <ssOrderNumber> <created>Packed</created> from Pickmaster Order <pmOrderNumber>"
    case PM_SHIPSTATION_EDITED:
      return "PM Shipstation Order <ssOrderNumber> Edited from Pickmaster Order <pmOrderNumber>"
    case PM_SHIPSTATION_PROCESSED:
      return "PM Shipstation Order <ssOrderNumber> <finalized>Processed<finalized> from Pickmaster Order <pmOrderNumber>"
    case PM_SHIPSTATION_LABEL_DOWNLOADED:
      return "PM Shipstation Order <ssOrderNumber> Label Downloaded from Pickmaster Order <pmOrderNumber>"
    case PM_SHIPSTATION_LABEL_PRINTED:
      return "PM Shipstation Order <ssOrderNumber> Label <created>Printed<created> from Pickmaster Order <pmOrderNumber>"
    case PM_SHIPSTATION_CANCELLED:
      return "PM Shipstation Order <ssOrderNumber> <cancel>Cancelled</cancel> from Pickmaster Order <pmOrderNumber>"
    case PM_SHIPSTATION_REDONE:
      return "PM Shipstation Order <ssOrderNumber> <redone>Redone</redone> from Pickmaster Order <pmOrderNumber>"
    default:
      return "void"
  }
}


const setTimeLineShipstationOrder = (pmOrderSku, pmSsOrderId, dateTime, type) => new Promise( async (resolve, reject) => {

  let textTimelin = getPMShipstationOrderTimeLineType(type)

  let ssOrderN = await getPmOrderNumber(pmOrderSku)
  let pmOrderN = await getPmSsOrderNumber(pmOrderSku, pmSsOrderId)

  addTimelineToPMShipstationOrderHistory(
    textTimelin.replace("<ssOrderNumber>", ssOrderN),
    textTimelin.replace("<ssOrderNumber>", ssOrderN),
    textTimelin.replace("<ssOrderNumber>", ssOrderN),
    dateTime, pmOrderSku, pmOrderN, pmSsOrderId
  )
  .then(res => resolve(res))
  .catch(err => reject(err))
})

export const stlPmSsOrder_Packed = async (pmOrderSku, pmSsOrderId, dateTime) =>
  setTimeLineShipstationOrder(pmOrderSku, pmSsOrderId, dateTime, PM_SHIPSTATION_PACKED)
export const stlPmSsOrder_Edited = async (pmOrderSku, pmSsOrderId, dateTime) =>
  setTimeLineShipstationOrder(pmOrderSku, pmSsOrderId, dateTime, PM_SHIPSTATION_EDITED)
export const stlPmSsOrder_Processed = async (pmOrderSku, pmSsOrderId, dateTime) =>
  setTimeLineShipstationOrder(pmOrderSku, pmSsOrderId, dateTime, PM_SHIPSTATION_PROCESSED)
export const stlPmSsOrder_LabelDownloaded = async (pmOrderSku, pmSsOrderId, dateTime) =>
  setTimeLineShipstationOrder(pmOrderSku, pmSsOrderId, dateTime, PM_SHIPSTATION_LABEL_DOWNLOADED)
export const stlPmSsOrder_LabelPrinted = async (pmOrderSku, pmSsOrderId, dateTime) =>
  setTimeLineShipstationOrder(pmOrderSku, pmSsOrderId, dateTime, PM_SHIPSTATION_LABEL_PRINTED)
export const stlPmSsOrder_Cancelled = async (pmOrderSku, pmSsOrderId, dateTime) =>
  setTimeLineShipstationOrder(pmOrderSku, pmSsOrderId, dateTime, PM_SHIPSTATION_CANCELLED)
export const stlPmSsOrder_Redone = async (pmOrderSku, pmSsOrderId, dateTime) =>
  setTimeLineShipstationOrder(pmOrderSku, pmSsOrderId, dateTime, PM_SHIPSTATION_REDONE)


export const stlPmSsOrder_RemakeReason = (pmOrderSku, pmSsOrderId, comentary, dateTime) => new Promise( async (resolve, reject) => {

  let ssOrderN = await getPmOrderNumber(pmOrderSku)
  let pmOrderN = await getPmSsOrderNumber(pmOrderSku, pmSsOrderId)

  addTimelineToPMShipstationOrderHistory(
    `PM Shipstation Order ${ssOrderN} from Pickmaster Order <pmOrderNumber> Remake Reason: <mkrR>${comentary}</mkrR>`,
    `PM Shipstation Order ${ssOrderN} from Pickmaster Order <pmOrderNumber> Remake Reason: <mkrR>${comentary}</mkrR>`,
    `PM Shipstation Order ${ssOrderN} from Pickmaster Order <pmOrderNumber> Remake Reason: <mkrR>${comentary}</mkrR>`,
    dateTime, pmOrderSku, pmOrderN, pmSsOrderId
  )
  .then(res => resolve(res))
  .catch(err => reject(err))
})


  // P I C K M A S T E R   G L O B A L . . .

const PM_OPTIONS_EDITED = "PM_OPTIONS_EDITEDS"

const getPMGlobalTimeLineType = type => {
  switch (type) {
    case PM_OPTIONS_EDITED:
      return ["Pickmaster Options Edited"]
    default:
      return "void"
  }
}

const setTimeLineGlobal = (pmOrderSku, pmOrderNumber, dateTime, type) => new Promise((resolve, reject) => {

  let textTimelineGlobal = getPMGlobalTimeLineType(type)

  addTimelineToGlobalHistory(textTimelineGlobal, dateTime, pmOrderSku, pmOrderNumber)
  .then(res => resolve(res))
  .catch(err => reject(err))
})

export const stlPmGlobalr_OptionsEdited = async (dateTime) =>
  setTimeLineGlobal(null, null, dateTime, PM_OPTIONS_EDITED)
