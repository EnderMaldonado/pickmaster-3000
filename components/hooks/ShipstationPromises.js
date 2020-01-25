import shipstationAPI from 'node-shipstation'
import {createOrdenJson, createLabelJson, createRateJson} from './shipstationsRequestBodyJson.js'

const shipstation = new shipstationAPI(
  'f7adc69a14824b2d8138942e7dc2830a',
  '52c9e14ffa4c42a9995418c737f22d5f'
)

export const useShipstationCreateOrder = shipstationOrder => new Promise((resolve, reject) => {
  shipstation.addOrder(createOrdenJson(shipstationOrder), (err, res, body) => {
    if(err)
      reject(err)
    if(res && body)
      resolve([res, body])
  })
})
export const useShipstationCreateLabelOrder = (orderId, shipstationOrder) => new Promise((resolve, reject) => {
  shipstation.setLabelForOrder(createLabelJson({orderId, ...shipstationOrder}), (lerr, lres, lbody) => {
    if(lerr)
      reject(lerr)
    if(lres && lbody)
      resolve([lres, lbody])
  })
})

//Get Carriers.....
const getListCarriers = () => new Promise((resolve, reject) => {
  let carriers = {}
  shipstation.getCarriers((err, res, body) => {
    if(err)
      reject(lerr)
    if(res && body) {
      body.forEach((carrier,i) => carriers={...carriers, [carrier.code]:{name:carrier.name, code:carrier.code}})
      resolve(carriers)
    }
  })
})
//Get Services.....
const getListServices = carrierCode => new Promise((resolve, reject) => {
  let services = {}
  shipstation.getServices(carrierCode, (err, res, body) => {
    if(err)
      reject(lerr)
    if(res && body) {
      body.forEach((service,i) => services={...services, [service.code]:service})
      resolve(services)
    }
    return null
  })
})
//Get Packages.....
const getListPackages = carrierCode => new Promise((resolve, reject) => {
  let packages = {}
  shipstation.getPackages(carrierCode, (err, res, body) => {
    if(err)
      reject(lerr)
    if(res && body) {
      body.forEach((pack,i) => packages={...packages, [pack.code]:pack})
      resolve(packages)
    }
  })
})
export const useShipstationGetCSP = async () => new Promise( async (resolve, reject) =>  {
  let listCarriers = {}

  listCarriers = await getListCarriers()
  let serv = Object.keys(listCarriers).map( key => getListServices(key).then(s =>  s) )

  let servProm = await Promise.all(serv)

  Object.keys(listCarriers).forEach((key,i) => listCarriers[key]={...listCarriers[key], services:{...servProm[i]}})

  resolve(listCarriers)
})
export const useShipstationGetShippingRates = shipstationOrder => new Promise((resolve, reject) => {
  shipstation.getShippingRates(createRateJson(shipstationOrder), (err, res, body) => {
      if(err)
        reject(err)
      if(res && body){
        resolve([res, body])
      }
    })
})

export const useShipstationCancelLabel = shipstationOrderId => new Promise((resolve, reject) => {
  shipstation.deleteOrder(shipstationOrderId, (err, res, body) => {
    if(err)
      reject(err)
    if(res && body){
      resolve(body.success)
    }
  })
})

export const useShipstationCancelLabels = (shipstationOrders) => new Promise((resolve, reject) => {
  let labelsProceseds = []
  Object.keys(shipstationOrders).forEach((key, i) => {
    if(shipstationOrders[key].status.includes("Processed"))
      labelsProceseds.push(useShipstationCancelLabel(shipstationOrders[key].ssOrderId).then(r=>r))
  })
  Promise.all(labelsProceseds).then(l => resolve(true)).catch(err=>reject(err))
})
