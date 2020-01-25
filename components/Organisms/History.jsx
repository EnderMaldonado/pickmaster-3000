import {useContext, useEffect, useState} from 'react'
import { Page } from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'

import CacheOrdersContext from '../Context/CacheOrders/CacheOrdersContext'
import NavigationContext from '../Context/Navigation/NavigationContext'

import HistoryList from '../Organisms/HistoryList'

import {SET_ORDER_EDITING_PM_ORDER_PAGE, SET_CURRENT_PM_ORDER} from '../Context/actions.js'

import {getData, getHistory} from '../Firebase/FirebaseMethodsGet.js'

const History = () => {

  const [{}, dispatchCacheOrders] = useContext(CacheOrdersContext)
  const [{}, dispatchNavigation] = useContext(NavigationContext)

  const [reload, setReload] = useState(false)
  const [historyList, setHistoryList] = useState([])

  const [loadPage, setLoadPage] = useState(false)

  useEffect(()=>{
    setLoadPage(false)
    getHistory("History", null, data => {setHistoryList(data);setLoadPage(true)}, err=>console.log(err))
  },[reload])

  const handleRedirectToProduct = orderSku => {
    getData(`PMOrders/${orderSku}`, null,
    data=>{
        dispatchCacheOrders({type:SET_CURRENT_PM_ORDER, currentPMOrderSku:orderSku})
      if(data.status.includes("FINALIZED") || data.status.includes("CANCELLED"))
        dispatchNavigation({type:SET_ORDER_EDITING_PM_ORDER_PAGE, editingPMOrderPage:"ShipstationOrdersPreview"})
      else if(!data.status.includes("(1/5)") && !data.status.includes("(2/5)") && !data.status.includes("(3/5)"))
        dispatchNavigation({type:SET_ORDER_EDITING_PM_ORDER_PAGE, editingPMOrderPage:"ShipstationOrdersPreview"})
      else
        dispatchNavigation({type:SET_ORDER_EDITING_PM_ORDER_PAGE, editingPMOrderPage:"ItemsScaning"})
    }, err => console.log(err))
  }

  return loadPage?
        <HistoryList data={historyList} redirectToProduct={handleRedirectToProduct}/>
        :
        "Loading History . . ."
}

export default History
