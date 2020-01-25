import {useContext, useEffect, useState, useRef} from 'react'
import { Page, TextStyle, DisplayText, Stack, Link } from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'

import OrdersToSendLayer from '../Templates/OrdersToSendLayer'
import Prot_RomaneosList from '../Organisms/Prot_RomaneosList'
import ToastAlert from '../Atoms/ToastAlert'

import RomaneosContext from '../Context/Romaneos/RomaneosContext'
import ConfigsContext from '../Context/Configs/ConfigsContext'
import NavigationContext from '../Context/Navigation/NavigationContext'
import {SET_ORDER_PAGE,UPDATE_CONFIG_OPTIONS_FRONTEND, PM_ORDER, CLEAN_ROMANEO_LIST} from '../Context/actions.js'

import {getData, getPmOrderData} from '../Firebase/FirebaseMethodsGet.js'

import {getPlatform, getRegion, getAddressSfy, getCustomerId, getEbayItemId} from '../hooks/PickmasterTools'

import usePickmasterHandles from '../hooks/usePickmasterHandles'
import useShopifyAPIRest from '../hooks/useShopifyAPIRest'

const OrdersToSend = ({handleRefresh}) => {

  const [{}, dispatchRomaneos] = useContext(RomaneosContext)
  const [{}, dispatchNavigation] = useContext(NavigationContext)
  const [{dataUpdateQuantity, dateUpdateMin}, dispatchConfig] = useContext(ConfigsContext)

  const {pmHandleCreatePmOrder_PrintRomaneo, pmHandlePrintRomaneo, scannPmOrderSku, redirectToPmOrder} = usePickmasterHandles()

  const refProtRomaneos = useRef();
  const refToastAlert = useRef();

  // Ordenes de shopify . . .
  const { data, loading, error } = useShopifyAPIRest(dateUpdateMin)

  const [skuScannList, setSkuScannList] = useState([])// Lista de los SKU de las Sfy ordenes.

  const [shopifyOrdersList, setShopifyOrdersList] = useState(null)
  const [shopifyDataOrderList, setShopifyDataOrdersList] = useState(null)// Lista con los datos de las ordenes Sfy.

  const [pmOrdersInProcess, setPmOrdersInProcess] = useState(null)
  const [pmOrdersCancelled, setPmOrdersCancelled] = useState(null)
  const [pmOrdersFinalized, setPmOrdersFinalized] = useState(null)

  const [showListSelect, setShowListSelect] = useState(0)

  const [orderSelectToPrint, setOrderSelectToPrint] = useState([])
  const [currentListSelectedToPrint, setCurrentListSelectedToPrint] = useState(null)

  const [loadPage, setLoadPage] = useState(false)

  const handleChangeDataUpdateQuantity = value =>{
    dispatchConfig({type:UPDATE_CONFIG_OPTIONS_FRONTEND, dataUpdateQuantity:value})
  }
  const handleChangeDateMin = value =>{
    dispatchConfig({type:UPDATE_CONFIG_OPTIONS_FRONTEND, dateUpdateMin:value})
    setLoadPage(false)
  }

  const handleSelectorderToPrint = (value, id) => {
    let arr = orderSelectToPrint
    if(value)
      arr.push(id)
    else
      arr.splice(arr.indexOf(id),1)
    setOrderSelectToPrint(arr)
    setCurrentListSelectedToPrint({...currentListSelectedToPrint, [id]:value})
  }

  const handleSelectAllOrderToPrint = (value, id) => {    
    let currentListToSelectToPrintAux = {}
    switch (showListSelect) {
      case 0:
        if(Object.keys(shopifyOrdersList).length > 0)
          Object.keys(shopifyOrdersList).forEach((key,i)=>currentListToSelectToPrintAux={...currentListToSelectToPrintAux, [key]:value})
        else
          currentListToSelectToPrintAux = null
        break;
      case 1:
        if(Object.keys(pmOrdersInProcess).length > 0)
          Object.keys(pmOrdersInProcess).forEach((key,i)=>currentListToSelectToPrintAux={...currentListToSelectToPrintAux, [key]:value})
        else
          currentListToSelectToPrintAux = null
        break;
      default:
        currentListToSelectToPrintAux = null
    }
    setCurrentListSelectedToPrint(currentListToSelectToPrintAux)
  }

  const handleChangeShowListSelect = value => {    
    let currentListToSelectToPrintAux = {}
    switch (showListSelect) {
      case 0:
        if(shopifyOrdersList && Object.keys(shopifyOrdersList).length > 0)
          Object.keys(shopifyOrdersList).forEach((key,i)=>currentListToSelectToPrintAux={...currentListToSelectToPrintAux, [key]:false})
        else
          currentListToSelectToPrintAux = null
        break;
      case 1:
        if(pmOrdersInProcess && Object.keys(pmOrdersInProcess).length > 0)
          Object.keys(pmOrdersInProcess).forEach((key,i)=>currentListToSelectToPrintAux={...currentListToSelectToPrintAux, [key]:false})
        else
          currentListToSelectToPrintAux = null
        break;
      default:
        currentListToSelectToPrintAux = null
    }
    setOrderSelectToPrint([])
    setShowListSelect(value)
    setCurrentListSelectedToPrint(currentListToSelectToPrintAux)
    handleCleanPrintedList()
  }

  const handlePrintOneRomaneo = (orderSku) => new Promise((resolve, reject) => {
    handlePrintRomaneo(orderSku)
    .then(pmOrder => {
      handlePrintIframe()
      if(showListSelect===0)
        updateListPrinted([pmOrder])
      handleCleanPrintedList()
      resolve(true)
    })
    .catch(err => {console.log(err);reject(err)})
  })

  const handlePrintRomaneo = (orderSku) => new Promise((resolve, reject) => {
    if(pmOrdersInProcess[orderSku]){
      pmHandlePrintRomaneo(orderSku)
      .then(res => {
        resolve(res)
      })
    }else {
      pmHandleCreatePmOrder_PrintRomaneo(orderSku, shopifyDataOrderList[orderSku])
      .then(pmOrder => {

        if(!pmOrder){
          getPmOrderData(orderSku)
          .then(res => {
            refToastAlert.current.handleToastAlert(false, 30000, <span>This shopify order is already in Pickmaster <Link onClick={()=>redirectToProduct(res.pmOrderSku)}>{res.pmOrderNumber}</Link></span>)
            resolve(res)
          })
        } else {
          resolve(pmOrder)
        }
      })
      .catch(err => {console.log(err);reject(err)})
    }
  })

  const handlePrintIframe = () => {
    refProtRomaneos.current.handlePrint();
  }

  const handleCleanPrintedList = () => {
    dispatchRomaneos({type:CLEAN_ROMANEO_LIST})
  }

  const updateListPrinted = (pmOrders) => {
    let spO = {...shopifyOrdersList}
    let spDataO = {...shopifyDataOrderList}
    let pmP = {...pmOrdersInProcess}
    let skuL = [...skuScannList]
    Object.keys(pmOrders).forEach(i => {
      delete spO[pmOrders[i].pmOrderSku]
      delete spDataO[pmOrders[i].pmOrderSku]
      pmP = createDataListToPm(pmOrders[i], pmP)
    })
    Object.keys(pmP).forEach(k => skuL.push(k))
    setShopifyOrdersList(spO)
    setShopifyDataOrdersList(spDataO)
    setPmOrdersInProcess(pmP)
    setSkuScannList(skuL)
    setCurrentListSelectedToPrint(null)
  }

  const handleConfigClick = () => dispatchNavigation({type:SET_ORDER_PAGE, page:"Options"})

  const redirectToProduct = orderSku => scannPmOrderSku(orderSku)

  const redirectToOrder = orderSku => redirectToPmOrder(orderSku)

  const getItemsAccum = (items) => {
    let accum = 0
    items.forEach(i=>accum += i.quantity)
    return accum
  }

  const getItemsPMAccum = (items) => {
    let accum = 0
    Object.keys(items).forEach(i=>accum += items[i].quantity)
    return accum
  }

  const createDataListToPm = (pmOrder, currentList) => {
    return {
      ...currentList,
      [pmOrder.pmOrderSku]:{
        number:           pmOrder.pmOrderNumber,
        platform :        pmOrder.orderData.platform,
        platformOrderId:  pmOrder.orderData.platformOrderId,
        region:           pmOrder.orderData.region,
        country:          pmOrder.orderData.shippingAddress.country,
        country_code:     pmOrder.orderData.shippingAddress.country_code,
        totalItems:       getItemsPMAccum(pmOrder.orderData.items),
        orderDate:        pmOrder.orderData.orderDate,
        customerName:     pmOrder.orderData.customerName,
        customerNameAddress: pmOrder.orderData.shippingAddress.customerName,
        customerId:       pmOrder.orderData.customerId,
        paymentDate:      pmOrder.orderData.paymentDate,
        sku:              pmOrder.pmOrderSku,
        createdAt:        pmOrder.createdAt,
        itemEbayId:       pmOrder.orderData.itemEbayId
      }
    }
  }

  const getOrdersList = () => {
    switch (showListSelect) {
      case 0:
        return shopifyOrdersList
      case 1:
        return pmOrdersInProcess
      case 2:
        return pmOrdersFinalized
      case 3:
        return pmOrdersCancelled
      default:
        return null
    }
  }


  useEffect(()=>{
    setLoadPage(false)

    let dat
    if((data && !loading) || error) {
      dat = data
      if(error)
        dat = {}
      getData("PMOrders")
      .then(pmOrdersData => {

        let pmOrders = pmOrdersData || {}
        let sfyOrders = {}, sfyordersData = {}
        for (let d of dat) {
          try {
            let sku = d.id.toString()
            if ( !Object.keys(pmOrders).includes(sku) ){
              let {country, country_code, name} =  getAddressSfy(d)
              sfyOrders = {
                ...sfyOrders,
                [sku]: {
                  number:           d.name,
                  platform :        d.gateway?getPlatform(d.gateway):"Shopify",
                  region:           getRegion(country),
                  country,
                  country_code,
                  totalItems:       getItemsAccum(d.line_items),
                  orderDate:        d.created_at,
                  customerName:     d.customer?`${d.customer.first_name} ${d.customer.last_name}`:"",
                  customerNameAddress: name,
                  customerId:       d.customer?getCustomerId(d.customer):"",
                  itemEbayId:       d.note_attributes?getEbayItemId(d.note_attributes):"",
                  sku
                }
              }
              sfyordersData = {...sfyordersData, [sku]:d}
            }
          } catch (e) {
            console.log(e)
          }
        }
        setShopifyOrdersList(sfyOrders)
        setShopifyDataOrdersList(sfyordersData)
        let currentListToSelectToPrint = {}
        Object.keys(sfyOrders).forEach((key,i)=>currentListToSelectToPrint={...currentListToSelectToPrint, [key]:false})
        setCurrentListSelectedToPrint(currentListToSelectToPrint)

        let pmF = {}, pmP = {}, pmC = {}, skuScann = []
        Object.keys(pmOrders).forEach(key => {
          if(pmOrders[key].orderData)
            switch (pmOrders[key].status) {
              case "FINALIZED":
                pmF = createDataListToPm(pmOrders[key], pmF)
                break;
              case "CANCELLED":
              case "REMAKE":
                pmC = createDataListToPm(pmOrders[key], pmC)
                break;
              default:
                pmP = createDataListToPm(pmOrders[key], pmP)
                skuScann.push(key)
            }
        })
        setPmOrdersInProcess(pmP)
        setPmOrdersCancelled(pmC)
        setPmOrdersFinalized(pmF)
        setSkuScannList(skuScann)

        setLoadPage(true)
      })
      .catch(err => console.log(err))
    }
    if(error){
      console.log(error)
    }

    return  () => {
      setSkuScannList([])
      setShopifyOrdersList(null)
      setShopifyDataOrdersList(null)
      setPmOrdersInProcess(null)
      setPmOrdersCancelled(null)
      setPmOrdersFinalized(null)
      setShowListSelect(0)
      setOrderSelectToPrint([])
      setCurrentListSelectedToPrint(null)
      setLoadPage(false)
    }
  },[data, loading, error])

  return (
      <Page
        fullWidth
      >
        <TitleBar
          title={"Pickmaster Orders"}
        />
        <Stack alignment="center">
          <Stack.Item fill>
          <DisplayText size="medium"><TextStyle variation="strong">Pickmaster Orders</TextStyle></DisplayText>
          </Stack.Item>
          <Stack.Item>
          </Stack.Item>
        </Stack>
        <div style={{marginBottom:"1.6rem"}}></div>
            <OrdersToSendLayer
              ordersList={getOrdersList()}
              {...{handlePrintOneRomaneo, redirectToProduct, showListSelect, handleChangeShowListSelect,handleSelectAllOrderToPrint,
                orderSelectToPrint, handleSelectorderToPrint, skuScannList, handleConfigClick, handleChangeDataUpdateQuantity,
                shopifyOrdersList, updateListPrinted, pmOrdersInProcess, pmOrdersFinalized,currentListSelectedToPrint, redirectToOrder,
                pmOrdersCancelled, handlePrintRomaneo, handlePrintIframe, handleRefresh, handleCleanPrintedList, handleChangeDateMin,
                loadPage}}
                dataQuantity={dataUpdateQuantity} dateUpdateMin={dateUpdateMin}
              />
            <Prot_RomaneosList ref={refProtRomaneos}/>
            <ToastAlert ref={refToastAlert}/>
      </Page>
  )
}

export default OrdersToSend
