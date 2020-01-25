import {useContext, useState, useEffect} from 'react'
import { Layout } from '@shopify/polaris'
import {SET_ORDER_EDITING_PM_ORDER_PAGE} from '../Context/actions.js'
import DataOrderShipstation from '../Organisms/DataOrderShipstation'
import NavigationContext from '../Context/Navigation/NavigationContext'
import {getCustomItemVoid} from '../hooks/PickmasterTools'
import useFirebaseGet from '../hooks/useFirebaseGet'

const OrderLabelEditLayer = ({pmSsOrderId, pmOrderSku, handleHistory, handleDownloadSsLabel, 
  handleProcess, handleRemake, handleCancel, handlePrintSsLabel}) => {

  const [{}, dispatchNavigation] = useContext(NavigationContext)

  const [loadData, setLoadData] = useState(false)
  useFirebaseGet([{
      request:`PMOrders/${pmOrderSku}/shipstationOrders/${pmSsOrderId}`,
      handleResponse: data => {
        setLabel(data)
        setLoadData(true)
      },
      handleError: error => console.log(error)
    }
  ], pmSsOrderId)

  const [label, setLabel] = useState(null)
  const [loadPage, setLoadPage] = useState(false)

  const[canProcess, setCanProcess] = useState(false)

  const handleChangeLabelSimpleValue = (value, key) => setLabel({...label, [key]:value})
  const handleChangeLabelServiceValue = (carrierCode, serviceCode) => setLabel({...label, carrierCode, serviceCode})

  const handleChangeLabelItemsValue = (value, itemSku, key) => setLabel({
          ...label,
          items:{
            ...label.items,
            [itemSku]:{
              ...label.items[itemSku],
              [key]:value
            }
          }
        })
  const handleChangeLabelSizeValue = (value, key) => setLabel({...label, size:{...label.size, [key]:value}})
  const handleChangeLabelShippingAddressValue = (value, key) => setLabel({...label, shippingAddress:{...label.shippingAddress, [key]:value}})
  const handleChangeLabelBillingAddressValue = (value, key) => setLabel({...label, billingAddress:{...label.billingAddress, [key]:value}})

  const [customItems, setCustomItems] = useState(0)
  const handleAddCustomProduct = () => {
    setLabel({...label, items:{
      ...label.items, ["custom-"+customItems]:getCustomItemVoid("custom-"+customItems)
    }})
    setCustomItems(customItems + 1)
  }

  useEffect(()=>{
    setLoadPage(false)
    if(loadData)
      setLoadPage(true)
  },[loadData])


  const handlePaginationPrevious = () => {
    dispatchNavigation({type:SET_ORDER_EDITING_PM_ORDER_PAGE, editingPMOrderPage:"ShipstationOrdersPreview"})
  }

  return loadPage ? <>
        <Layout>
          <Layout.Section>
            <br/>
            <DataOrderShipstation
              {...{...label, label, setLabel, canProcess,
                handleChangeLabelSimpleValue,
                handleChangeLabelItemsValue,
                handleChangeLabelSizeValue,
                handleChangeLabelServiceValue,
                handleChangeLabelShippingAddressValue,
                handleChangeLabelBillingAddressValue,
                setCanProcess, handleHistory, handleProcess,
                handleRemake, handleCancel,
                handleProcess, handleDownloadSsLabel, handlePrintSsLabel,
                handleAddCustomProduct
              }}
            />
          </Layout.Section>
        </Layout>
        </>
      :
        <p>Loading Order label Edit Layer . . .</p>

}

export default OrderLabelEditLayer
