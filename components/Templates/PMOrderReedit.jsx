import {useState, useEffect} from 'react'
import { Layout, Button, Spinner, Stack } from '@shopify/polaris'
import {SET_ORDER_PAGE, UPDATE_SHIPSTATION_ORDER, SET_ORDER_EDITING_PM_ORDER_PAGE, SET_CACHE_RATE} from '../Context/actions.js'
import DataPmOrderEdit from '../Organisms/DataPmOrderEdit'

import usePickmasterHandles from '../hooks/usePickmasterHandles'

const PMOrderReedit = ({currentPMOrder}) => {

  const [pmOrder, setPmOrder] = useState(null)
  const [loadPage, setLoadPage] = useState(false)
  const {handleEdit_ContinueToScann} = usePickmasterHandles()
  const [loading, setLoading] = useState(false)

  const handleChangePmOrderSimpleValue = (value, key) => setPmOrder({...pmOrder, [key]:value})
  const handleChangePmOrderOrderDataValue = (value, key) => setPmOrder({
    ...pmOrder,
    orderData:{...pmOrder.orderData, [key]:value}
  })
  const handleChangePmOrderItemsValue = (value, itemSku, key) => setPmOrder({
    ...pmOrder,
    orderData:{
      ...pmOrder.orderData,
      items:{
        ...pmOrder.orderData.items,
        [itemSku]:{
          ...pmOrder.orderData.items[itemSku],
          [key]:value
        }
      }
    }
  })
  const handleChangePmOrderDataShippingAddressValue = (value, key) => setPmOrder({
    ...pmOrder,
    orderData:{
      ...pmOrder.orderData,
      shippingAddress:{
        ...pmOrder.orderData.shippingAddress,
        [key]:value
      }
    }
  })
  const handleChangePmOrderDataBillingAddressValue = (value, key) => setPmOrder({
    ...pmOrder,
    orderData:{
      ...pmOrder.orderData,
      billingAddress:{
        ...pmOrder.orderData.billingAddress,
        [key]:value
      }
    }
  })

  const handleSaveAndContinue = () => {
    setLoading(true)
    handleEdit_ContinueToScann(pmOrder)
    .then(()=>setLoading(false))
    .catch(err => console.log(err))
  }

  useEffect(()=>{
    setLoadPage(false)
    setPmOrder(currentPMOrder)
    setLoadPage(true)
  },[currentPMOrder])

  return loadPage ?
        <Layout sectioned>
          <Layout.Section>
            <Stack distribution="trailing">
              <Stack.Item>
              {
                loading?
                <Spinner accessibilityLabel="Loading... reedit order"/>
                :
                <Button primary onClick={handleSaveAndContinue}>Save and Continue</Button>
              }
              </Stack.Item>
            </Stack>
            <br/>
            <DataPmOrderEdit
              {...{...pmOrder, pmOrder, ...pmOrder.orderData, setPmOrder,
                handleChangePmOrderSimpleValue,
                handleChangePmOrderOrderDataValue,
                handleChangePmOrderItemsValue,
                handleChangePmOrderDataShippingAddressValue,
                handleChangePmOrderDataBillingAddressValue}}
            />
          </Layout.Section>
        </Layout>
      :
        <p>Loading PM Order Edit . . .</p>

}

export default PMOrderReedit
