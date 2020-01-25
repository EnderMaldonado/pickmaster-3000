const itemsStructure = itemsProduct => {
  let items = []
  Object.keys(itemsProduct).map((key,i) => {
    if(itemsProduct[key].enabled)
      items.push({
        "lineItemKey": itemsProduct[key].handle,
        "sku": itemsProduct[key].sku,
        "name": itemsProduct[key].name,
        "imageUrl": itemsProduct[key].imageUrl,
        "quantity": itemsProduct[key].quantity,
        "unitPrice": itemsProduct[key].unitPrice
      })
  })
  return items
}

export const createOrdenJson = (shipstationOrder) => {
const {ssOrderNumber, orderDate, shippingAddress, billingAddress, paymentDate,
   items, amountPaid, note, paymentMethod, weight, size, internationalOptions} = shipstationOrder
  return {
    "orderNumber": ssOrderNumber,
    "orderDate": orderDate,
    "paymentDate": paymentDate,
    "orderStatus": "awaiting_shipment",
    "billTo": {
      "name": shippingAddress.customerName,
      "company": shippingAddress.company,
      "street1": shippingAddress.address1,
      "street2": shippingAddress.address2,
      "street3": null,
      "city": shippingAddress.city,
      "state": shippingAddress.state,
      "postalCode": shippingAddress.postalCode,
      "country": shippingAddress.country_code,
      "phone": shippingAddress.phone,
      "residential": "true"
    },
    "shipTo": {
      "name": shippingAddress.customerName,
      "company": shippingAddress.company,
      "street1": shippingAddress.address1,
      "street2": shippingAddress.address2,
      "street3": null,
      "city": shippingAddress.city,
      "state": shippingAddress.state,
      "postalCode": shippingAddress.postalCode,
      "country": shippingAddress.country_code,
      "phone": shippingAddress.phone,
      "residential": "true"
    },
    "items": itemsStructure(items),
    amountPaid,
    "customerNotes": note,
    paymentMethod,
    "requestedShippingService": "OtherInternational",
    internationalOptions:null
  }
}

export const createLabelJson = ({orderId, weight, size, carrierCode, serviceCode}) => {
  return {
    orderId,
    carrierCode,
    serviceCode,
    "packageCode": "package",
    "weight": {
      "value": weight,
      "units": "ounces"
    },
    "dimensions": {
      "units": "inches",
      "length": size.l,
      "width": size.w,
      "height": size.h
    },
    "testLabel": false
  }
}

export const createRateJson = ({carrierCode, serviceCode, state,
                                  city, country_code, weight, size, residential, postalCode}) => {

  return {
    carrierCode,
    serviceCode,
    "packageCode": "package",
    "fromPostalCode": 33126,
    "toState": state,
    "toCountry": country_code,
    "toPostalCode": postalCode,
    "toCity": city,
    "weight": {
      "value": weight,
      "units": "ounces"
    },
    "dimensions": {
      "units": "inches",
      "length": size.l,
      "width": size.w,
      "height": size.h
    },
    residential
  }
}
