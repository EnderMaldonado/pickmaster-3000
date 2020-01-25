import {useContext, useEffect, useState} from 'react'
import { Page, Link, Stack, Modal, Frame, Button, Tooltip, Icon, PageActions } from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'

import CacheOrdersContext from '../Context/CacheOrders/CacheOrdersContext'
import NavigationContext from '../Context/Navigation/NavigationContext'
import {SET_CURRENT_PM_ORDER, SET_ORDER_EDITING_PM_ORDER_PAGE, RESET_CURRENTS} from '../Context/actions.js'

import ModalRemakeReason from '../Organisms/ModalRemakeReason'
import ModalHistory from '../Organisms/ModalHistory'

import OrderScannProductsLayer from '../Templates/OrderScannProductsLayer'
import PackageDistributionLayer from '../Templates/PackageDistributionLayer'
import OrderLabelsLayer from '../Templates/OrderLabelsLayer'
import PMOrderReedit from '../Templates/PMOrderReedit'
import OrderDetails from '../Templates/OrderDetails'

import useFirebaseGet from '../hooks/useFirebaseGet'

import usePickmasterHandles from '../hooks/usePickmasterHandles'

import PickmasterOrderEditingHeader from '../Organisms/PickmasterOrderEditingHeader'

const PickmasterOrderEditing = ({handleChangePage}) =>  {

  const [{currentPMOrderSku}, dispatchCacheOrders] = useContext(CacheOrdersContext)
  const [{editingPMOrderPage}, dispatchNavigation] = useContext(NavigationContext)

  const [pmOrder, setPmOrder] = useState(null)
  const [loadData, setLoadData] = useState(false)

  const [activeModal, setActiveModal] = useState(false)
  const [activeModalHistory, setActiveModalHistory] = useState(false)

  const {cancelPmOrder, finalizePmOrder, remakePmOrder, navigatePmOrderEditTo} = usePickmasterHandles()

  const [loading, setLoading] = useState(false)

  useFirebaseGet([{
      request:`PMOrders/${currentPMOrderSku}`,
      handleResponse: data => {
        setPmOrder(data)
        setLoadData(true)
      },
      handleError: error => console.log(error)
    }
  ], currentPMOrderSku)

  const returnProcesLayerPMOrderEdit = () => {
    switch (editingPMOrderPage) {
      case "ItemsScaning":
        return <OrderScannProductsLayer pmOrder={pmOrder}/>
      case "PackageDistribution":
        return <PackageDistributionLayer pmOrder={pmOrder}/>
      case "PMOrderShipstationOrdersProcess":
        return <OrderLabelsLayer pmOrder={pmOrder}/>
      case "PMOrderReedit":
        return <PMOrderReedit currentPMOrder={pmOrder}/>
      case "OrderDetails":
        return <OrderDetails pmOrder={pmOrder}/>
      default:
        return <div>"Error :(</div>
    }
  }

  const handldeGoToDashboard = () => 
    navigatePmOrderEditTo("OrderDetails")

  const handleCancelPmOrder = () => {
    setLoading(true)
    cancelPmOrder(pmOrder)
      .then(() => {
        if(editingPMOrderPage==="ItemsScaning" || editingPMOrderPage==="PackageDistribution" || editingPMOrderPage==="PMOrderReedit")
        navigatePmOrderEditTo("OrderDetails")
        setLoading(false)
      })
      .catch(err => console.log(err))
  }

  const handleFinalizePmOrder = () => {
    setLoading(true)
    finalizePmOrder(pmOrder.pmOrderSku)
    .then(() => setLoading(false))
    .catch(err => console.log(err))
  }

  const handleRemakePmOrder = remakeReasonText => new Promise((resolve, reject) => {
    remakePmOrder(remakeReasonText, pmOrder)
    .then(skuRemake => resolve(skuRemake))
    .catch(err => {console.log(err);reject(err)})
  })
  const handleFinishRemake = skuRemake => {
    dispatchCacheOrders({type:SET_CURRENT_PM_ORDER, currentPMOrderSku:skuRemake})
    dispatchNavigation({type:SET_ORDER_EDITING_PM_ORDER_PAGE, editingPMOrderPage:"PMOrderReedit"})
  }

    useEffect(()=>{
    },[currentPMOrderSku])    

    return loadData?
      <Page fullWidth>
        <PickmasterOrderEditingHeader {...{editingPMOrderPage, setActiveModal,
          handldeGoToDashboard, handleCancelPmOrder, handleChangePage, pmOrder}}/>
        <TitleBar
          title={"Pickmaster Order Editing"}
        />
        {returnProcesLayerPMOrderEdit()}
        <ModalRemakeReason {...{activeModal, setActiveModal}}
          handleCreate={handleRemakePmOrder} onFinishLoad={handleFinishRemake}/>
        <ModalHistory activeModal={activeModalHistory} setActiveModal={setActiveModalHistory}
         title={`PM Order ${pmOrder.pmOrderNumber} History`}
         origin={`PMOrders/${pmOrder.pmOrderSku}/history`}/>
         <Modal sectioned open={loading} loading>
         </Modal>
      </Page>
   :
  <p>Loading Pickmaster Order Editing . . .</p>
}

export default PickmasterOrderEditing
