import axios from 'axios'
import {dateQueryFormat} from './PickmasterTools'

export const getProductData = id => new Promise((resolve, reject) => {
  axios(`api/product/${id}`)
    .then(response => {
      if(response.status===200 && response.statusText==="OK")
        resolve(response.data.data.product)
      else
        reject(response)
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
})

export const setFullfillmentOrder = (sfyOrderSku, trakings, locationId) => new Promise((resolve, reject) => {
  axios.post(`postcreatefulfillment/${sfyOrderSku}`, {
    "fulfillment": {
      "location_id": locationId,
      "tracking_numbers": trakings.trackingNumbers,
      "tracking_company":trakings.trackingCompany,
      "notify_customer": true
    }
  })
  .then(response => {
      resolve(response.data.data.fulfillment)
  })
  .catch(err => {
    console.log(err)
    reject(err)
  })
})


export const updateFullfillmentOrder = (sfyOrderSku, fulfillmentId, trakings) => new Promise((resolve, reject) => {
  axios.put(`putupdatefulfillment/${sfyOrderSku}/${fulfillmentId}`, {
    "fulfillment": {
      "id": fulfillmentId,
      "tracking_numbers": trakings.trackingNumbers,
      "tracking_company":trakings.trackingCompany,
      "notify_customer": true
    }
  })
  .then(response => {
      resolve(response.data.data.fulfillment)
  })
  .catch(err => {
    console.log(err)
    reject(err)
  })
})

export const getLocation = () => new Promise((resolve, reject) => {
  axios(`api/locations.json`)
    .then(response => {
      if(response.status===200 && response.statusText==="OK")
        resolve(response.data.data.locations[0])
      else
        reject(response)
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
})

export const getShop = () => new Promise((resolve, reject) => {
  axios(`api/shop.json`)
    .then(response => {
      if(response.status===200 && response.statusText==="OK")
        resolve(response.data.data.shop)
      else
        reject(response)
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
})

export const getOrdersPending = (dateUpdateMin) => new Promise(async (resolve, reject) => {
  let lastId = 0
  let auxData = []
  let ordersResponse = []

  try {

    do {
      let response = await axios(`api/orders.json?created_at_min=${dateQueryFormat(dateUpdateMin.start)}&created_at_max=${dateQueryFormat(dateUpdateMin.end)}&limit=250&financial_status=paid&fulfillment_status=unfulfilled&fields=id,created_at,gateway,shipping_address,customer&since_id=${lastId}`)
      
      if(response.status===200 && response.statusText==="OK") {
        ordersResponse = response.data.data.orders

        if(ordersResponse.length) {
          auxData.push(...ordersResponse)
          lastId = ordersResponse[ordersResponse.length-1].id
        }

      }
      else {
        reject(response)
        ordersResponse = []
      }

    } while (ordersResponse.length)
    
    resolve(auxData)

  } catch (err) {
    console.log(err)
    reject(err)
  }
})
