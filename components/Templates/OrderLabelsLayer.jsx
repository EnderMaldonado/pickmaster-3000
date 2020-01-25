import {useState, useEffect} from 'react'
import { Layout, DisplayText } from '@shopify/polaris'

import ModalRemakeReason from '../Organisms/ModalRemakeReason'
import ModalHistory from '../Organisms/ModalHistory'
import PMEditingPageNameHeader from '../Atoms/PMEditingPageNameHeader'
import usePickmasterHandles from '../hooks/usePickmasterHandles'

import OrderLabelEditLayer from './OrderLabelEditLayer'

const OrderLabelsLayer = ({pmOrder}) => {

  const [loadPage, setLoadPage] = useState(false)

  const [activeModal, setActiveModal] = useState(false)
  const [idToRemake, setIdToRemake] = useState(null)
  const [idHistory, setIdHistory] = useState(null)
  const [activeModalHistory, setActiveModalHistory] = useState(false)

  const {cancelPmSsOrder, finalizePmOrder, createRemakePmSsOrder, processShipstationOrder,
    downloadSsLabel, checkAllLabelsProcessed} = usePickmasterHandles()

  const handleProcess = label => new Promise((resolve, reject) => {
    processShipstationOrder(label)
    .then(async res => {
      if(res.result==="OK"){
        let result = await checkAllLabelsProcessed(pmOrder.pmOrderSku)
        if(result)
          finalizePmOrder(pmOrder.pmOrderSku)
        resolve(res.bodyResponse.labelData)
      }else
        reject(res.exceptionMessage)
    })
    .catch(err => console.log(err))
  })

  const handleCancelSsOrder = pmSsOrderId => new Promise((resolve, reject) => {
    cancelPmSsOrder(pmOrder.pmOrderSku, pmSsOrderId)
    .then(()=>resolve(true))
    .catch(err => console.log(err))
  })

  const handleDownloadSsLabel = label => new Promise((resolve, reject)=>{
    downloadSsLabel(label.pmOrderSku, label.pmSsOrderId, label.ssOrderNumber)
    .then((labelData)=>resolve(labelData))
    .catch(err => console.log(err))
  })

  const handleRemakeSsOrder = (remakeReasonText, pmSsOrderId) => new Promise((resolve, reject) => {
    createRemakePmSsOrder(pmOrder, remakeReasonText, pmOrder.shipstationOrders[pmSsOrderId])
    .then(res => resolve(res))
    .catch(err => console.log(err))
  })
  const handleRemake = pmSsOrderId => {
    setIdToRemake(pmSsOrderId)
    setActiveModal(true)
  }

  const handleHistory = pmSsOrderId => {
    setIdHistory(pmSsOrderId)
    setActiveModalHistory(true)
  }

  useEffect(()=>{
    setLoadPage(false)
    checkAllLabelsProcessed(pmOrder.pmOrderSku)
    .then(result => {
      if(result)
        finalizePmOrder(pmOrder.pmOrderSku)
      setLoadPage(true)
    })
  },[])


  return  loadPage ? <>
  <Layout>
    { pmOrder.shipstationOrders?
      null
      :
      <Layout.Section>
        <TextStyle variation="negative"><TextStyle variation="strong">
          <DisplayText size="small">Not Shipstations Orders</DisplayText>
        </TextStyle></TextStyle>
      </Layout.Section>
    }
    </Layout>
        { pmOrder.shipstationOrders?
            Object.keys(pmOrder.shipstationOrders).map((key,i) => {
              return (
                <OrderLabelEditLayer
                  key={i}
                  pmSsOrderId={key}
                  pmOrderSku={pmOrder.pmOrderSku}
                  pmOrderNumber={pmOrder.pmOrderNumber}
                  {...{handleProcess, handleHistory, handleRemake, handleDownloadSsLabel}} handleCancel={handleCancelSsOrder}
                />
              )
            })
          :
            null
        }
    <ModalRemakeReason {...{activeModal, setActiveModal}}
      handleCreate={handleRemakeSsOrder} onFinishLoad={null} sku={idToRemake}/>
    <ModalHistory activeModal={activeModalHistory} setActiveModal={setActiveModalHistory}
     title={`PM Shipstation Order ${idHistory?pmOrder.shipstationOrders[idHistory].ssOrderNumber:""} History`}
     origin={`PMOrders/${pmOrder.pmOrderSku}/shipstationOrders/${idHistory}/history`}/>
   </>
    :
    <p>Order Labels Layer . . .</p>

}

export default OrderLabelsLayer
