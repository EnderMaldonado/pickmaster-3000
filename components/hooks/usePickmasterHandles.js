import {useContext} from 'react'
import saveAs from 'file-saver'
import dateFormat from 'dateformat'

import RomaneosContext from '../Context/Romaneos/RomaneosContext'
import CacheOrdersContext from '../Context/CacheOrders/CacheOrdersContext'
import ConfigsContext from '../Context/Configs/ConfigsContext'
import NavigationContext from '../Context/Navigation/NavigationContext'
import {ADD_ROMANEO_TO_LIST_PRINT, SET_CURRENT_PM_ORDER, SET_ORDER_EDITING_PM_ORDER_PAGE,
        UPDATE_CONFIG_OPTIONS_FRONTEND, UPDATE_CONFIG_OPTIONS_SERVICES, UPDATE_CONFIG_OPTIONS_TAGLOCATION} from '../Context/actions'

import Cookies from 'js-cookie';

import {getPmOrderData, existPmOrder, existPmSsOrder, getPmOrderStatus, getData,
        getPmSsOrderProperty, getPmOrderProperty, existTargetChild, getPmOrdersFinalized} from '../Firebase/FirebaseMethodsGet'
import {addUpdatePMOrder, addUpdatePMSsOrder, addUpdatePropertyPmSsOrder, deleteNode,
        addUpdatePropertyPmOrder, addData, updateData} from '../Firebase/FirebaseMethodsSet'

import {getRomaneoPMOrderData, createPMOrder, getDate, createOrderShipstation, getServiceNameToCode,
        getConditionsServoceOptionsToArray, getPlatform, getRegion, getAddressSfy, toHourZero, getDateInt} from '../hooks/PickmasterTools'

import {stlPmOrder_Comentary, stlPmOrder_Created, stlPmOrder_RomaneoPrinted, stlPmOrder_Finalized,
        stlPmOrder_RomaneoScanned, stlPmOrder_ProductsScanned,stlPmOrder_RemakeReason,
        stlPmOrder_ReEdited, stlPmOrder_Cancelled,stlPmOrder_Redone,stlPmSsOrder_LabelDownloaded,
        stlPmSsOrder_Packed, stlPmSsOrder_Cancelled, stlPmSsOrder_Redone,
        stlPmSsOrder_Edited, stlPmSsOrder_Processed,stlPmSsOrder_RemakeReason,
        stlPmGlobalr_OptionsEdited, stlPmSsOrder_LabelPrinted} from '../hooks/HistoryTools'

import {advanceStatusProcessIfCan, setPmOrderCancelledStatus, setPmOrderFinalizeStatus, setPmOrderRemakeStatus,
  setPmSsOrderRemakeStatus, setPmSsOrderProcessedStatus, setPmSsOrderCancelledStatus} from '../hooks/StatusTools'

import {useShipstationCreateOrder, useShipstationCreateLabelOrder,
        useShipstationCancelLabel, useShipstationGetCSP} from '../hooks/ShipstationPromises'

import {setFullfillmentOrder, updateFullfillmentOrder, getLocation, getOrdersPending} from '../hooks/ShopifyAPITools';

const usePickmasterHandles = () => {

  const [{}, dispatchRomaneos] = useContext(RomaneosContext)
  const [{}, dispatchCacheOrders] = useContext(CacheOrdersContext)
  const [{}, dispatchNavigation] = useContext(NavigationContext)
  const [{conditionsServiceOptions, tagLocation, locationId, shopOrigin, dataUpdateQuantity,
          dateUpdateMin, shippingServices}, dispatchConfig] = useContext(ConfigsContext)

  const lg = m => console.log(m)
  const getCurrentTime = () => getDate()

  // Print Romaneo . . .
  const pmHandlePrintRomaneo = pmOrderSku => new Promise((resolve, reject) => {
    getPmOrderData(pmOrderSku)
      .then(pmOrder => {
        dispatchRomaneos({type:ADD_ROMANEO_TO_LIST_PRINT, romaneoOrderData:getRomaneoPMOrderData(pmOrder)})
        stlPmOrder_RomaneoPrinted(pmOrder.pmOrderSku, getCurrentTime())
        .then(res => resolve(pmOrder))
      })
      .catch(err => {lg(err);reject(err)})
  })

  const checkExistPmOrder = (pmOrderSku) =>  new Promise((resolve, reject) => {
    existPmOrder(pmOrderSku)
    .then(res => resolve(res))
    .catch(err => {lg(err);reject(err)})
  })

  // Create OM Order . . .
  const createPmOrderWithData = (orderSku, data) =>  new Promise((resolve, reject) => {
    addUpdatePMOrder(orderSku, data)
    .then(pmOrder => {
      stlPmOrder_Created(pmOrder.pmOrderSku, getCurrentTime())
      resolve(pmOrder)
    })
    .catch(err => {lg(err);reject(err)})
  })

  // Create OM Order . . .
  const pmHandleCreatePmOrder = (orderSku, sfyOrder) =>  new Promise( async (resolve, reject) => {
    let newPmOrder = await createPMOrder(sfyOrder, tagLocation)
    addUpdatePMOrder(orderSku, newPmOrder)
    .then(pmOrder => {
      stlPmOrder_Created(pmOrder.pmOrderSku, getCurrentTime())
      resolve(pmOrder)
    })
    .catch(err => {lg(err);reject(err)})
  })

  const pmHandleCreatePmOrder_PrintRomaneo = (orderSku, sfyOrder) =>  new Promise(async (resolve, reject) => {
    let exist = await checkExistPmOrder(orderSku)

    if(!exist) {
      pmHandleCreatePmOrder(orderSku, sfyOrder)
      .then(pmOrder => {
        pmHandlePrintRomaneo(pmOrder.pmOrderSku)
        .then(res => resolve(pmOrder))
      })
      .catch(err => {lg(err);reject(err)})
    } else
      resolve(false)
  })

  // Scann PM Order . . .
  const scannPmOrderSku = pmOrderSku => {
    stlPmOrder_RomaneoScanned(pmOrderSku, getCurrentTime())
    redirectToPmOrder(pmOrderSku)
  }

  // Reditect PM Order To Edit . . .
  const redirectToPmOrder = pmOrderSku => {
  getPmOrderStatus(pmOrderSku)
    .then(status => {
      setCurrentPmOrderEdit(pmOrderSku)
      switch (status) {
        case "FINALIZED":
        case "CANCELLED":
        case "REMAKE":
          navigatePmOrderEditTo("OrderDetails")
          break;
        case "In Process (4/4)":
          navigatePmOrderEditTo("PMOrderShipstationOrdersProcess")
          break;
        default:
          advanceStatusProcessIfCan(pmOrderSku, "In Process (1/4)")
          navigatePmOrderEditTo("ItemsScaning")
      }
    })
    .catch(err => lg(err))
  }

  // Go To Items Package . . .
  const handleGoToPackPmOrder = pmOrderSku =>  new Promise((resolve, reject) => {
      stlPmOrder_ProductsScanned(pmOrderSku, getCurrentTime())
      advanceStatusProcessIfCan(pmOrderSku, "In Process (2/4)")
      .then(res => navigatePmOrderEditTo("PackageDistribution"))
      .catch(err => {lg(err);reject(err)})
  })

  //Create PM Shipstation Order . . .
  const createPackShipstation = (pmOrderSku, pmSsOrderId, pmSsOrder, date) =>  new Promise((resolve, reject) => {
    addUpdatePMSsOrder(pmOrderSku, pmSsOrderId, pmSsOrder)
    .then(data => stlPmSsOrder_Packed(pmOrderSku, pmSsOrderId, date?date:getCurrentTime()))
    .then(res => resolve(res))
    .catch(err => {lg(err);reject(err)})
  })

  //Update PM Shipstation Order . . .
  const updatePackShipstation = (pmOrderSku, pmSsOrderId, pmSsOrder) =>  new Promise((resolve, reject) => {
    addUpdatePMSsOrder(pmOrderSku, pmSsOrderId, pmSsOrder)
    .then(data => stlPmSsOrder_Edited(pmOrderSku, pmSsOrderId, getCurrentTime()))
    .then(res => resolve(res))
    .catch(err => {lg(err);reject(err)})
  })

  //Create PM Shipstation Orders and Go To Edit This . . .
  const handleCreate_GoToPMOrderShipstationOrdersProcess = (pmOrder, packages) =>  new Promise((resolve, reject) => {
    let timelineDate = getCurrentTime()
    let shipstationOrders = createOrderShipstation(pmOrder, packages, timelineDate)
    let updatesSsOrders = Object.keys(shipstationOrders).map(key =>
                            createPackShipstation(pmOrder.pmOrderSku, key, shipstationOrders[key], timelineDate)
                              .then(data => data))

    Promise.all(updatesSsOrders)
    .then(res => advanceStatusProcessIfCan(pmOrder.pmOrderSku, "In Process (3/4)"))
    .then(res => navigatePmOrderEditTo("PMOrderShipstationOrdersProcess"))
    .catch(err => {lg(err);reject(err)})
    .finally(resolve(true))
  })

  //CANCEL PM Order . . .
  const cancelPmOrder = pmOrder => new Promise((resolve, reject) => {
    setPmOrderCancelledStatus(pmOrder.pmOrderSku)
    .then(res => checkAndDeleteToWarning(pmOrder.pmOrderSku))
    .then(res => stlPmOrder_Cancelled(pmOrder.pmOrderSku, getCurrentTime()))
    .then(res => {
      if(pmOrder.shipstationOrders){
        let labelsToCancell = []
        Object.keys(pmOrder.shipstationOrders).forEach((key, i) => {
          if(pmOrder.shipstationOrders[key].status !== "Cancelled")
            labelsToCancell.push(cancelPmSsOrder(pmOrder.pmOrderSku, pmOrder.shipstationOrders[key].pmSsOrderId).then(res=>res))
        })
        return Promise.all(labelsToCancell).then(res=>res)
      }
    })
    .then(res => resolve(true))
    .catch(err => {lg(err);reject(err)})
  })

  const checkAndDeleteToWarning = (pmOrderSku) => new Promise( async (resolve, reject) => {
    try {
      let targetChild = `PMOrdersWarning/${pmOrderSku}`
      let exist = await existTargetChild(targetChild)
      if(exist)
        deleteNode(targetChild).then(res => resolve(true))
      else
        resolve(true)
    } catch (error) {
      lg(error)
      reject(error)
    }
  })

  //Set Has FINALIZED PM Order . . .
  const finalizePmOrder = pmOrderSku =>  new Promise((resolve, reject) => {
    setSfyOrderFullfiled(pmOrderSku)
    .then(res => stlPmOrder_Finalized(pmOrderSku, getCurrentTime()))
    .then(res => setPmOrderFinalizeStatus(pmOrderSku))
    .then(res => resolve(res))
    .catch(err => {lg(err);reject(err)})
  })

  const checkAllLabelsProcessed = pmOrderSku => new Promise( async (resolve, reject) => {
    try {
      let shipstationOrders = await getPmOrderProperty(pmOrderSku, "shipstationOrders")

      let packed = Object.keys(shipstationOrders).some((key, i) => shipstationOrders[key].status === "Packed")
      let processed = Object.keys(shipstationOrders).some((key, i) => shipstationOrders[key].status === "Processed")

    resolve(!packed && processed)
    } catch (error) {
      lg(err);reject(err)
    }
    finally {
      resolve(false)
    }
  })

  const setSfyOrderFullfiled = pmOrderSku => new Promise( async (resolve, reject) => {
    try {
      let pmOrder = await getPmOrderData(pmOrderSku)
      let shipstationOrders = pmOrder.shipstationOrders
      let ssOKeys = Object.keys(shipstationOrders)
      let trackingCompany = shipstationOrders[ssOKeys[0]].trackingCompany
      // let trackingCompanies = []
      let trackingNumbers = []
      ssOKeys.forEach(key => {
        // trackingCompanies.push(trackingCompany)
        if(shipstationOrders[key].status === "Processed")
          trackingNumbers.push(shipstationOrders[key].trackingNumber)
      })
      let trackings = {trackingNumbers, trackingCompany}
      let fullfill
      if(pmOrder.fullfillmentId){
        fullfill = await updateFullfillmentOrder(pmOrder.sfyOrderSku, pmOrder.fullfillmentId, trackings)
      }else {
        fullfill = await setFullfillmentOrder(pmOrder.sfyOrderSku, trackings, locationId)
      }
      if(fullfill){
        addUpdatePMOrder(pmOrderSku, {...pmOrder, fullfillmentId:fullfill.id.toString(), pmOrderFinalizedDate:getCurrentTime()})
          .then(res => resolve(true))
          .catch(err => {lg(err);reject(err)})
      }
    } catch (err) {
      lg(err)
      reject(err)
    }
  })

  // Genera Remake Number pm Shipstatiopn order . . .
  const generateRemakeSkuOrder = (pmOrderSku,  pmOrderNumber) => new Promise((resolve, reject) => {
    knowiFExist_CreateSkuAndNumberPmOrder(pmOrderSku, pmOrderNumber)
    .then(res => resolve(res))
    .catch(err => {lg(err);reject(err)})
  })

  //Check if remake exist and update number . . .
  const knowiFExist_CreateSkuAndNumberPmOrder = (pmOrderSku, pmOrderNumber, index = 1) => new Promise((resolve, reject) => {
    existPmOrder(pmOrderSku)
    .then(res => {
      if(res)
        knowiFExist_CreateSkuAndNumberPmOrder(`${pmOrderSku}-${index}`, `${pmOrderNumber}-${index}`, index + 1)
        .then(res => resolve(res))
        .catch(err => {lg(err);reject(err)})
      else
        resolve({pmOrderSku, pmOrderNumber})
    })
    .catch(err => {lg(err);reject(err)})
  })

  //REMAKE PM Order . . .
  const remakePmOrder = (remakeReasonText, pmOrder) => new Promise( async (resolve, reject) => {
    let time = getCurrentTime()
    let idRemake = pmOrder.pmOrderSku + "-RMK",
        numberRemake = pmOrder.pmOrderNumber + "-RMK"
    let newPmO = await generateRemakeSkuOrder(idRemake, numberRemake, time)

    let pmO = await createPmOrderWithData(newPmO.pmOrderSku,
      {...pmOrder, pmOrderSku:newPmO.pmOrderSku, history:{},
      remakeReason:remakeReasonText,
      remakeParent:pmOrder.pmOrderNumber,
      pmOrderNumber:newPmO.pmOrderNumber, status:"In Process (1/4)",
      shipstationOrders:{}})
    stlPmOrder_RemakeReason(newPmO.pmOrderSku, remakeReasonText, time)
    .then(res => stlPmOrder_Redone(pmOrder.pmOrderSku, time))
    .then(res => setPmOrderRemakeStatus(pmOrder.pmOrderSku))
    .then(res => resolve(newPmO.pmOrderSku))
    .catch(err => {lg(err);reject(err)})
  })

  // SHIPSTATION ORDERS...
  //Cancel pickmaster shipstation order and labels . . .
  const cancelPmSsOrder = (pmOrderSku, pmSsOrderId) => new Promise((resolve, reject) => {
    stlPmSsOrder_Cancelled(pmOrderSku, pmSsOrderId, getCurrentTime())
    .then(res => setPmSsOrderCancelledStatus(pmOrderSku, pmSsOrderId))
    .then(res => cancelShipstationLabel(pmSsOrderId, pmOrderSku))
    .then(res => res)
    .catch(err => {lg(err);reject(err)})
    .finally(()=>resolve(true))
  })

  const cancelShipstationLabel = (pmSsOrderId, pmOrderSku) => new Promise(async (resolve, reject) => {
    let ssOId

    try {
      ssOId = await getPmSsOrderProperty(pmOrderSku, pmSsOrderId, "ssOrderId")
    } catch (e) {
      ssOId = null
    }

    if(ssOId){
      let labelData = await addUpdatePropertyPmSsOrder("labelData", pmOrderSku, pmSsOrderId, "")
      let ssOrderId = await addUpdatePropertyPmSsOrder("ssOrderId", pmOrderSku, pmSsOrderId, "")
      useShipstationCancelLabel(ssOId)
      .catch(err => {lg(err);reject(err)})
      .finally(()=>resolve(true))
    } else
      resolve(true)
  })

  // Genera Remake Number pm Shipstatiopn order . . .
  const generateRemakeIdSsOrder = (pmOrderSku, pmSsOrderId, ssOrderNumber) => new Promise((resolve, reject) => {
    knowiFExist_CreateIDAndNumberSsOrder(pmOrderSku, pmSsOrderId, ssOrderNumber)
    .then(res => resolve(res))
    .catch(err => {lg(err);reject(err)})
  })

  //Check if remake exist and update number . . .
  const knowiFExist_CreateIDAndNumberSsOrder = (pmOrderSku, pmSsOrderId, ssOrderNumber, index = 1) => new Promise((resolve, reject) => {
    existPmSsOrder(pmOrderSku, pmSsOrderId)
    .then(res => {
      if(res)
        knowiFExist_CreateIDAndNumberSsOrder(pmOrderSku, `${pmSsOrderId}-${index}`, `${ssOrderNumber}-${index}`, index + 1)
        .then(res => resolve(res))
        .catch(err => {lg(err);reject(err)})
      else
      resolve({pmSsOrderId, ssOrderNumber})
    })
    .catch(err => {lg(err);reject(err)})
  })

  //Create Remake pm Ss Order . . .
  const createRemakePmSsOrder = (pmOrder, remakeReasonText, pmSsOrder) => new Promise( async (resolve, reject) => {
    let idRemake = pmSsOrder.pmSsOrderId + "-RMK",
        numberRemake = pmSsOrder.ssOrderNumber + "-RMK",
        dateTime = getCurrentTime()
    try {
      let cancel = await cancelShipstationLabel(pmSsOrder.pmSsOrderId, pmOrder.pmOrderSku)
    } catch (error) {
      lg(error)
    }
    let newSsO = await generateRemakeIdSsOrder(pmOrder.pmOrderSku, idRemake, numberRemake)
    createPackShipstation(pmOrder.pmOrderSku, newSsO.pmSsOrderId,
      {...pmSsOrder, pmSsOrderId:newSsO.pmSsOrderId, ssOrderId:"", labelData:"",
      remakeReason:remakeReasonText, ssOrderNumber:newSsO.ssOrderNumber, status:"Packed",
      remakeParent:pmSsOrder.ssOrderNumber, remakes:null}, dateTime)
    .then(pmSsO =>  addUpdatePropertyPmSsOrder("remakes", pmOrder.pmOrderSku, pmSsOrder.pmSsOrderId,
    pmSsOrder.remakes?
    {...pmSsOrder.remakes, [newSsO.pmSsOrderId]:newSsO.ssOrderNumber}:
    {[newSsO.pmSsOrderId]:newSsO.ssOrderNumber}))
    .then(res => stlPmSsOrder_RemakeReason(pmOrder.pmOrderSku, newSsO.pmSsOrderId, remakeReasonText, dateTime))
    .then(res => setPmSsOrderRemakeStatus(pmOrder.pmOrderSku, pmSsOrder.pmSsOrderId))
    .then(res => stlPmSsOrder_Redone(pmOrder.pmOrderSku, pmSsOrder.pmSsOrderId, dateTime))
    .then(res => resolve(true))
    .catch(err => {lg(err);reject(err)})
  })

  //Process Shipstation Order...
  const processShipstationOrder = label => new Promise( async (resolve, reject) => {
    let [res, body] = await useShipstationCreateOrder(label)
    let result = await processAndDownloadSsLabel(body.orderId, label)
    if(result.result === "Error"){
      useShipstationCancelLabel(body.orderId)
      .catch(err => {lg(err);reject(err)})
      resolve(result)
    }else {
      addUpdatePMSsOrder(label.pmOrderSku, label.pmSsOrderId,
        {...label, ssOrderId:result.bodyResponse.orderId,  labelData: result.bodyResponse.labelData,
          shippedDate:getCurrentTime(), status:"Processed", shippingRate:result.bodyResponse.shipmentCost,
          trackingNumber:result.bodyResponse.trackingNumber,
          trackingCompany:getServiceNameToCode(shippingServices, label.serviceCode)})
      .then(res => setPmSsOrderProcessedStatus(label.pmOrderSku, label.pmSsOrderId))
      .then(res => stlPmSsOrder_Processed(label.pmOrderSku, label.pmSsOrderId, getCurrentTime()))
      .then(res => resolve(result))
      .catch(err => {lg(err);reject(err)})
    }
  })

  const processAndDownloadSsLabel = (ssOrderId, label) => new Promise((resolve, reject) => {
    useShipstationCreateLabelOrder(ssOrderId, label)
    .then(([lres, lbody]) => {
      if(lres.statusMessage==="OK" && lbody.labelData)
        return lbody
      else resolve({result:"Error", exceptionMessage:lbody.ExceptionMessage})
    })
    .then(bodyResponse => {
      resolve({result:"OK", bodyResponse})
    })
    .catch(err => {lg(err);reject(err)})
  })

  const downloadSsLabel = (pmOrderSku, pmSsOrderId, ssOrderNumber) => new Promise( async (resolve, reject) => {
    try {
      let labelData = await getPmSsOrderProperty(pmOrderSku, pmSsOrderId, "labelData")
      downloadPDF(labelData, ssOrderNumber, pmOrderSku, pmSsOrderId)
      resolve(labelData)
    } catch (error) {
      lg(error)
      reject(error)
    }
  })

  const downloadPDF = (labelData, ssOrderNumber, pmOrderSku, pmSsOrderId) => {
    let ventana = window.open("","PDF")
    if(ventana)
      ventana.document.write("<embed id='pdf' width='100%' height='100%' src='data:application/pdf;base64, " +  encodeURI(labelData) + "'></embed>")
    // saveAs(createPdf(labelData), `Label-Shipping-Order-${ssOrderNumber}.pdf`)
    stlPmSsOrder_LabelDownloaded(pmOrderSku, pmSsOrderId, getCurrentTime())
  }

  const createPdf = (labelData) => {
   return `data:application/pdf;base64,${labelData}`
  }

  //Editr PM Order . . .
  const editPmOrder = pmOrder => new Promise((resolve, reject) => {
    addUpdatePMOrder(pmOrder.pmOrderSku, pmOrder)
    .then(pmO => resolve(pmO))
    .catch(err => {lg(err);reject(err)})
  })

  const handleEdit_ContinueToScann = pmOrder =>  new Promise((resolve, reject) => {
    editPmOrder(pmOrder)
    .then(pmO => {
      stlPmOrder_ReEdited(pmOrder.pmOrderSku, getCurrentTime())
      advanceStatusProcessIfCan(pmOrder.pmOrderSku, "In Process (1/4)")
      setCurrentPmOrderEdit(pmOrder.pmOrderSku)
      navigatePmOrderEditTo("ItemsScaning")
    })
    .catch(err => {lg(err);reject(err)})
    .finally(()=>resolve(true))
  })

  // Save Time line Comentary...
  const saveTimelineComentaryPmOrder = (pmOrderSku, comentary) => new Promise((resolve, reject) => {
    stlPmOrder_Comentary(pmOrderSku, comentary, getCurrentTime())
    .then(resolve(true))
    .catch(err => {lg(err);reject(err)})
  })

  const checkPmOrdersNeedCancel = (pmOrders) => new Promise((resolve, reject) => {
    try {
      let pmOrder = null
      Object.keys(pmOrders).forEach((key, i) => {
        if(pmOrders[key].status!=="CANCELLED" && pmOrders[key].status!=="REMAKE")
          pmOrder = pmOrders[key]
      })
      resolve(pmOrder)
    } catch (error) {
      reject(error)
    }
  })



  //Get Orders Pending . . .86400000 day
  const timeF = d => dateFormat(d, "yyyy-mm-dd")
  const getOrdersPendingDays  = () => new Promise( async (resolve, reject) => {
    try {
      let time = getCurrentTime()
      let dates = [{start:timeF(parseInt(time) + 86400000), end:timeF(parseInt(time) + (86400000*2))}]

      let promises = dates.map(t => getOrdersPending(t).then(res => res))

      let resolves = await Promise.all(promises)

      let counts = []
      resolves.forEach(orders => {
        let ebayINTL=0, ebayUSA=0, amazon=0, shopify=0
        orders.forEach(order => {
          let {country} =  getAddressSfy(order)
          switch (getPlatform(order.gateway)) {
            case "Ebay":
              if(getRegion(country) === "INTL")
                ebayINTL++
              else
                ebayUSA++
              break;
            case "Amazon":
              amazon++
              break;
            case "Shopify":
              shopify++
              break;
            default:
              break;
          }
        })
        counts.push({ebayINTL, ebayUSA, amazon, shopify})
      })

      resolve(counts)
    } catch (err) {
      lg(err)
      reject(err)
    }
  })


  const pmOrdersFinalized  = () => new Promise( async (resolve, reject) => {
    try {
      let minDate = toHourZero(getDateInt())

      let pmOrdersFinalized = await getPmOrdersFinalized()

      let ebayINTL=0, ebayUSA=0, amazon=0, shopify=0

      if(pmOrdersFinalized) {
        Object.keys(pmOrdersFinalized).forEach((pmOrderSku, i) => {
          if(pmOrdersFinalized[pmOrderSku].pmOrderFinalizedDate &&
            pmOrdersFinalized[pmOrderSku].pmOrderFinalizedDate >= minDate) {

            let {region, platform} =  pmOrdersFinalized[pmOrderSku].orderData
            switch (platform) {
              case "Ebay":
                if(region === "INTL")
                  ebayINTL++
                else
                  ebayUSA++
                break;
              case "Amazon":
                amazon++
                break;
              case "Shopify":
                shopify++
                break;
              default:
                break;
            }
          }
        })
      }
      resolve({ebayINTL, ebayUSA, amazon, shopify})
    } catch (err) {
      lg(err)
      reject(err)
    }
  })

  //Initialize Services . . .
  const initializeServices = () => new Promise((resolve, reject) => {
    let services = []
    useShipstationGetCSP()
    .then(listCarriers => {
      Object.keys(listCarriers).forEach(carrierCode => {
        Object.keys(listCarriers[carrierCode]["services"]).forEach(serviceCode=>{
          services=[...services, `${carrierCode}|${listCarriers[carrierCode].name}|-|${serviceCode}|${listCarriers[carrierCode]["services"][serviceCode].name}`]
        })
      })
      resolve(services)
    })
    .catch(err => {lg(err);reject(err)})
  })

  //Initialize configs . . .
  const initializeConfig = () => new Promise( async (resolve, reject) => {
    try {
      let time = new Date()
      let location = await getLocation()
      let services = await initializeServices()
      dispatchConfig({type:UPDATE_CONFIG_OPTIONS_FRONTEND,
        locationId:location.id,
        shopOrigin:Cookies.get("shopOrigin"),
        dataUpdateQuantity:100,
        dateUpdateMin:{ start: time, end: time },
        shippingServices:services,
        region: "",
        platform: "",
        queryValue: ""
      })
      let config = await getData("config")
      if(config){
        dispatchConfig({type:UPDATE_CONFIG_OPTIONS_TAGLOCATION, tagLocation:config.tagLocation || ""})
        dispatchConfig({type:UPDATE_CONFIG_OPTIONS_SERVICES,
                        conditionsServiceOptions:getConditionsServoceOptionsToArray(config.conditionsServiceOptions) || null})
      }
      resolve(true)
    } catch (err) {
      lg(err); reject(err)
    }
  })

  //Save Config...
  const saveOptions = (configOptions) => new Promise( async (resolve, reject) => {
    updateData("config", {...configOptions})
    .then(()=> resolve(true))
    .catch(err => {lg(err);reject(err)})
  })

  // Set Current PM Order Edit. . .
  const setCurrentPmOrderEdit = pmOrderSku =>
    dispatchCacheOrders({type:SET_CURRENT_PM_ORDER, currentPMOrderSku:pmOrderSku})

  // Navigate PM Order . . .
  const navigatePmOrderEditTo = link =>
    dispatchNavigation({type:SET_ORDER_EDITING_PM_ORDER_PAGE, editingPMOrderPage:link})

  // Navigate Pickmaster . . .
  const navigateToPage = link =>
    dispatchNavigation({type:SET_ORDER_PAGE, page:link})

  return {
    pmHandlePrintRomaneo, pmHandleCreatePmOrder, pmHandleCreatePmOrder_PrintRomaneo, scannPmOrderSku,redirectToPmOrder,
    handleGoToPackPmOrder, createPackShipstation, updatePackShipstation, handleCreate_GoToPMOrderShipstationOrdersProcess, cancelPmSsOrder,
    generateRemakeIdSsOrder, knowiFExist_CreateIDAndNumberSsOrder, createRemakePmSsOrder, processShipstationOrder, editPmOrder,
    handleEdit_ContinueToScann, setCurrentPmOrderEdit, navigatePmOrderEditTo, cancelPmOrder, navigateToPage, finalizePmOrder,
    remakePmOrder, saveTimelineComentaryPmOrder, downloadSsLabel, checkAllLabelsProcessed, checkPmOrdersNeedCancel,
    initializeConfig, saveOptions, getOrdersPendingDays, pmOrdersFinalized
  }
}

export default usePickmasterHandles
