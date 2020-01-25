import {getProductData} from './ShopifyAPITools'
import dateFormat from 'dateformat'
import moment from 'moment'


export const prepareShopifyStoreName = store => {return store.replace(".","")}

export const getServiceNameToCode = (shippingServices, serviceCode) => {
  return getServiceName(shippingServices.filter((k) => k.includes(serviceCode))[0])
}

export const getCarrierNameToCode = (shippingServices, serviceCode) => {
  return getCarrierName(shippingServices.filter((k) => k.includes(serviceCode))[0])
}

export const getConditionsServoceOptionsToArray = conditionsServiceOptions => {
  let dataResult = null
  if(conditionsServiceOptions)
    Object.keys(conditionsServiceOptions).forEach(key => {
        dataResult={
          ...dataResult,
          [key]: key==="conditionsServiceOptionsDefault" && conditionsServiceOptions["conditionsServiceOptionsDefault"].length ? conditionsServiceOptions[key].split(",") : conditionsServiceOptions[key]
        }
    })
  return dataResult
}

export const getCarrierCode = services => {return services.substring(0, services.indexOf("|"))}

export const getCarrierName = services => {return services.substring(services.indexOf("|")+1, services.indexOf("|-|"))}

export const getServiceCode = services => {return services.substring(services.indexOf("|-|")+3, services.lastIndexOf("|"))}

export const getServiceName = services => {return services.substring(services.lastIndexOf("|")+1, services.length)}

export const getServicesListFormat = services => {
  let result = {}
  services.forEach(serv =>
    result = {
      ...result,
      [getCarrierCode(serv)]:{
        carrierCode:getCarrierCode(serv),
        name:getCarrierName(serv),
        services: result[getCarrierCode(serv)]? {
          ...result[getCarrierCode(serv)]["services"],
          [getServiceCode(serv)]:{
            serviceCode:getServiceCode(serv),
            name:getServiceName(serv)
          }
        }
        :
        {
          [getServiceCode(serv)]:{
            serviceCode:getServiceCode(serv),
            name:getServiceName(serv)
          }
        }
      }
    }
  )
  return result
}

export const getServicesOptionsShipstation = (conditionsServiceOptions, shippingServices, country_code) => {
  let servicesOptionsShipstation =  []
  if(conditionsServiceOptions) {
    Object.keys(conditionsServiceOptions).forEach(c => {
      servicesOptionsShipstation = c === "conditionsServiceOptionsDefault" ?
          [...servicesOptionsShipstation, ...conditionsServiceOptions[c]]
        :
          conditionsServiceOptions[c].options.toLowerCase().includes(country_code.toLowerCase()) ?
            [...servicesOptionsShipstation, conditionsServiceOptions[c].service]
          :
            servicesOptionsShipstation
    })
    servicesOptionsShipstation = [...new Set(servicesOptionsShipstation)]
  }
  if(servicesOptionsShipstation.length)
    return servicesOptionsShipstation
  return shippingServices
}

export const getItemsPMAccum = items => {
  let acumm = 0
  Object.keys(items).forEach(key => acumm += items[key].quantity)
  return acumm
}

export const dateQueryFormat = d => dateFormat(d, "yyyy-mm-dd")+"T00:00:00-05:00"


export const stringToTime = date => new Date(parseInt(date)).getTime()

export const toTime = date => {
  if(typeof date === "number")
    return new Date(date).getTime()
  if(Date.parse(date))
    return new Date(date).getTime()
  return new Date(parseInt(date)).getTime()
}

export const dateToLocal = date => new Date(date).toLocaleString("en-US", {timeZone: "America/New_York"})

export const getDatePretyNormal = date => dateFormat(toTime(date), "dd/mm/yyyy HH:MM:ss")

export const getDatePrety = date => {
  return dateFormat(dateToLocal(toTime(date)), "dd/mm/yyyy HH:MM:ss")
}

export const getDatePretyWHoursNormal = date => dateFormat(new Date(toTime(date)), "dd/mm/yyyy")

export const getDatePretyWHours = date => (dateToLocal(toTime(date)) + 3600000) <  dateToLocal(toTime(new Date()))?
                  moment(dateToLocal(toTime(date))).from(dateToLocal(toTime(new Date())))
                :
                  moment(dateToLocal(toTime(date))).calendar()

export const getDate = () => Date.parse(new Date()).toString()
export const getDateInt = () => Date.parse(new Date())

export const toHourZero = date => new Date(new Date(new Date(dateToLocal(date)).setHours(0)).setMinutes(0)).setSeconds(0).toString()
export const getDateOffsetPrety = () => getDatePrety(getDate())


export const getDescriptionLabel = items => {
  let itemsNames = []
  Object.keys(items).map((key,i) => {
    if(items[key].enabled)
      itemsNames.push(items[key].name)
  })
  return itemsNames.join(", ")
}

export const getTotalPriceLabel = items => {
  let accum = 0
  Object.keys(items).forEach(key=>accum += items[key].enabled? items[key].unitPrice * items[key].quantity : 0 )
  return accum
}

export const getTotalQuantityLabel = items => {
  let qty = 0
  Object.keys(items).forEach(key=>qty += items[key].enabled? items[key].quantity : 0 )
  return qty
}
export const getRomaneoPMOrderData = pmOrder => {
  let romaneoOrderDataItems = {},
  items = pmOrder.orderData.items
  Object.keys(items).forEach(sku => romaneoOrderDataItems = {
    ...romaneoOrderDataItems,
    [sku]:{
      sku,
      title: items[sku].name,
      location: items[sku].location,
      quantity: items[sku].quantity,
      category: items[sku].category
    }
  })
  return {
    number:pmOrder.pmOrderNumber,
    orderSku:pmOrder.pmOrderSku,
    totalItems:getItemsPMAccum(pmOrder.orderData.items),
    differentItems:Object.keys(items).length,
    shippingAddressName:pmOrder.orderData.shippingAddress.customerName,
    customerName:pmOrder.orderData.customerName,
    customerId:pmOrder.orderData.customerId,
    items:romaneoOrderDataItems
  }
}

export const getTooltipCustomerFormatList = customer => {
  let customerName = customer.substring(customer.indexOf("|")+1, customer.lastIndexOf("|")),
      customerId = customer.substring(customer.lastIndexOf("|")+1, customer.length)
  return <span>
    <b>Customer: </b>{customerName}
    {customerId?<span><br/><span><b>Id: </b>{customerId}</span></span>:null}
  </span>
}

export const getRegion = contry => {
  if(contry && contry.toLowerCase().includes("united states"))
    return "USA"
  return "INTL"
}

export const getPlatform = gateway => {
  if(gateway){
    if (gateway.toLowerCase().includes("ebay"))
      return "Ebay"
    if (gateway.toLowerCase().includes("amazon"))
      return "Amazon"
  }
  return "Shopify"
}

export const getIDPlatform = noteAttributes => {
  let index = -1
  if(noteAttributes.length)
    noteAttributes.filter((note,i) => {
      if(note.name.toLowerCase().includes("id"))
        index = i
    })
  return index>=0 ? noteAttributes[index].value : ""
}

const getCategory = (tags, type) => {
  const categoriesDefined = {
    "Game":{
      name:"Game",
      subcategories:{
        "PS4":{name:"Playstation 4"},
        "PS3":{name:"Playstation 3"},
        "PS2":{name:"Playstation 2"},
        "Xbox One":{name:"Xbox One"},
        "Xbox 360":{name:"Xbox 360"},
        "Xbox":{name:"Xbox"},
        "Wii U":{name:"Wii U"},
        "Wii":{name:"Wii"},
        "3DS":{name:"3DS"},
        "DS":{name:"DS"},
        "PS Vita":{name:"Playstation Vita"},
        "PSP":{name:"Playstation Portatil"},
        "Nintendo Switch":{name:"Nintendo Switch"},
        "PC":{name:"PC"},
      }
    },
    "Funko":{name:"Funko", subcategories:null},
    "Amiibo":{name:"Amiibo", subcategories:null},
    "Cool Stuff":{name:"Cool Stuff", subcategories:null},
    "Accessory":{name:"Accessory", subcategories:null},
    "Toys":{name:"Toys", subcategories:null},
    "Board Game":{name:"Board Game", subcategories:null},
  }

  let typeCategory = categoriesDefined[type]?categoriesDefined[type]:null
  return typeCategory?
            typeCategory.subcategories?
              typeCategory.subcategories[Object.keys(typeCategory.subcategories).filter(key => tags.includes(key))[0]]?
                typeCategory.subcategories[Object.keys(typeCategory.subcategories).filter(key => tags.includes(key))[0]].name
              :
                typeCategory.name
            :
              typeCategory.name
          :
            "unspecified"
}

const reduceSizeImageUrl = (url, size) => {
  let extension = ""
  if(url.includes(".jpg"))
    extension = ".jpg"
  if(url.includes(".jpeg"))
    extension = ".jpeg"
  if(url.includes(".png"))
    extension = ".png"
  return url.replace(extension, `_${size}x${extension}`)
}



//======================================================

const addresUndefined = {
  first_name: "",
  address1: "",
  phone: null,
  city: "",
  zip: "0",
  province: "undefined",
  country: "undefined",
  last_name: "",
  address2: "",
  company: null,
  latitude: 0,
  longitude: 0,
  name: "",
  country_code: "undefined",
  province_code: "undefined"
}

export const getAddressSfy = sfyOrder => {
  return sfyOrder.shipping_address?
    sfyOrder.shipping_address:
    sfyOrder.customer?
      sfyOrder.customer.default_address:
      addresUndefined
}

export const getCustomItemVoid = sku => {
  return {
    name:           "Custom",
    imageUrl:       "",
    imageAltText:   "",
    location:       "",
    sku:            sku,
    unitPrice:      0,
    category:       "Custom",
    type:           "Custom",
    quantity:       1,
    enabled:true
  }
}

export const getProducts = async (items, locationConfig) => new Promise( async (resolve, reject) => {
  try {
    let productsResult = {}

    let ids = items.map(k => k.product_id)
    let productsPromises = ids.map(id => getProductData(id).then(res => res))
    let products = await Promise.all(productsPromises)

    products.forEach((p, i) => {
      let {variants, handle, title, image, tags, product_type} = p
      let sku = variants[0].sku.replace(".","")
      productsResult = {
        ...productsResult,
        [sku || handle]: {
          name:           title,
          imageUrl:       reduceSizeImageUrl(image.src, 200),
          imageAltText:   image.alt,
          location:       locationConfig?tags.split(", ").filter(tag => tag.includes(locationConfig))[0] || "unspecified":"unspecified",
          sku:            sku || handle,
          unitPrice:      items[i].price,
          category:       getCategory(tags, product_type),
          type:           product_type,
          quantity:       items[i].quantity,
          enabled:true
        }
      }
    })
    resolve(productsResult)
  } catch (e) {
    console.log(e);
  }
})

export const getCustomerId = customer => {
  if(customer.note && customer.note.toLowerCase().includes("ebay"))
    return customer.note.toLowerCase().replace("ebay user:","").trim()
  return ""
}

export const getEbayItemId = note_attributes => {
  let itemId = ""
  if(note_attributes && note_attributes.length)
    note_attributes.forEach(element => {
      if(element.name.toLowerCase().includes("ebay item"))
        itemId = element.value
    })
  return itemId
}

export const createPMOrder = (sfyOrderRef, tagLocation) => new Promise( async (resolve, reject) => {
  let sfyOrder = {...sfyOrderRef}

  try {
    let {gateway, id, created_at, note_attributes, customer} = {...sfyOrder}
    let {address1, address2, city, company, country, country_code, name, phone, province, province_code, zip} = getAddressSfy(sfyOrder)
    let items = await getProducts(sfyOrder.line_items, tagLocation)

    let orderData = {
      platform:           gateway?getPlatform(gateway):"Shopify",
      platformOrderId:    note_attributes?getIDPlatform(note_attributes):"",
      customerName:       customer?`${customer.first_name} ${customer.last_name}`:"",
      customerId:         customer?getCustomerId(customer):"",
      itemEbayId:         note_attributes?getEbayItemId(note_attributes):"",
      shippingAddress:   {
        customerName:     name || "",
        country:          country || "",
        country_code:     country_code || country || "",
        address1:         address1 || "",
        address2:         address2 || "",
        city:             city || "",
        state:            province || province_code || "",
        state_code:       province_code || province || "",
        company:          company || "",
        phone:            phone || "",
        postalCode:       zip || "",
        residential:      true,
      },
      region:           country==="United States"?"USA":"INTL",//region
      customerName:     name || "",
      orderDate:        created_at || "",
      items
    }

    resolve({
      pmOrderSku:        id.toString(),//sku orders,
      pmOrderNumber:    `PM-${sfyOrder.name}`,
      status:           "In Process (1/4)",
      sfyOrderNumber:   sfyOrder.name,//number order
      sfyOrderSku:      id.toString(),//sku orders
      createdAt:        getDate(),
      orderData,
      history:          {},
      shipstationOrders:{},
      remakeParent:     "",
      remakeReason:     "",
      remakes:          {}
    })
  } catch (e) {
    console.log(e);
  }
})




//===========================================================









export const createOrderShipstation = (pmOrder, packages, dateTime) => {

  let pmSsOrderId = pmOrder.pmOrderNumber.replace("#","")

  let shipstationOrders = {}
  let packagesAbailible = 0

  packages.forEach((pack, i) => {
    if(pack.packageItemsTotalQuantity > 0) {
      packagesAbailible++
      let items = {}
      Object.keys(pack).forEach((key,i) => {
        if(key !== "packageItemsTotalQuantity" && pack[key].quantityInPackage > 0)
          items = {
            ...items,
            [key]:{ ...pmOrder.orderData.items[key], quantity:pack[key].quantityInPackage }
         }
      })
      shipstationOrders = {
        ...shipstationOrders,
        [packages.length===1?`${pmSsOrderId}`:`${pmSsOrderId}-${packagesAbailible}`]:{
          ...pmOrder,
          ...pmOrder.orderData,
          orderData:            null,
          pmSsOrderId:          packages.length===1?`${pmSsOrderId}`:`${pmSsOrderId}-${packagesAbailible}`,
          ssOrderNumber:        packages.length===1?`${pmOrder.pmOrderNumber}`:`${pmOrder.pmOrderNumber}-${packagesAbailible}`,
          weight:               0,
          size:                 {l:0,w:0,h:0},
          carrierCode:          "",
          serviceCode:          "",
          packageCode:          "",
          shipstationId:        "",
          shipping:             "",
          items,
          customItem:           "",
          status:               "Packed",
          history:              {},
          ssOrderId:            "",
          packageDate:          dateTime,
          shippedDate:          "",
          remakeParent:     "",
          remakeReason:     "",
          remakes:          {}
        }
      }
    }
  })

  return shipstationOrders
}


export const createPMOrderStatus = pmOrder => {
  return {
    pmOrderNumber:pmOrder.pmOrderNumber,
    status:pmOrder.status,
    createdAt:pmOrder.createdAt
  }
}
