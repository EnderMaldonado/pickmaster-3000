import {useContext} from 'react'
import { TextStyle, DisplayText, Link, Button, Tooltip, PageActions, Stack, ButtonGroup } from '@shopify/polaris'
import BadgeStatus from '../Atoms/BadgeStatus'
import {MobileChevronMajorMonotone, RepeatOrderMajorMonotone, 
  MobileCancelMajorMonotone, AnalyticsMajorMonotone} from '@shopify/polaris-icons';
import {getDatePrety} from '../hooks/PickmasterTools'
import ConfigsContext from '../Context/Configs/ConfigsContext'

const PickmasterOrderEditingHeader = ({setActiveModal, handldeGoToDashboard, editingPMOrderPage,
  handleCancelPmOrder, pmOrder, handleChangePage}) => {
  const [{shopOrigin}] = useContext(ConfigsContext)

  const conditionsStatus = {
    "In Process (1/5)":"info",
    "In Process (2/5)":"info",
    "In Process (3/5)":"info",
    "In Process (4/5)":"info",
    "In Process (5/5)":"info",
    "FINALIZED":"success",
    "CANCELLED":"warning",
    "REMAKE":"warning"
  }

  const titleMetadata = () =>
    <span>{getDatePrety(pmOrder.orderData.orderDate)} from Shopify Order <Link url={`https://${shopOrigin}/admin/orders/${pmOrder.sfyOrderSku}`} external={true}>{pmOrder.sfyOrderNumber}</Link> <BadgeStatus status={pmOrder.status} conditions={conditionsStatus}/></span>

return <>
  <Stack alignment="trailing">
    <Stack.Item>
      <div style={{color: '#637381'}}>
        <Button plain icon={MobileChevronMajorMonotone} onClick={()=>handleChangePage("OrdersToSend")}>Pickmaster Orders</Button>
      </div>
      <TextStyle variation="strong">
        <DisplayText element="h3" size="medium">{`Pickmaster Order ${pmOrder.pmOrderNumber}`}</DisplayText>
      </TextStyle>
    </Stack.Item>
    <Stack.Item>
      {titleMetadata()}
    </Stack.Item>
    {
      editingPMOrderPage==="OrderDetails"?
      <Stack.Item fill>
        <Stack alignment="trailing" distribution="trailing">
          <ButtonGroup>
            {
              pmOrder.status==="FINALIZED" || pmOrder.status=="CANCELLED"?
              <Tooltip content={pmOrder.status=="CANCELLED"?"Make Another PM Order like it":"Cancel the Order (cancel labels to) and Make Another like it"}>
                <div style={{color:"#b02b13"}}>
                <Button outline monochrome icon={RepeatOrderMajorMonotone} onClick={()=>setActiveModal(true)}>
                </Button></div>
              </Tooltip> : null
            }
            {
              pmOrder.status!=="CANCELLED" && pmOrder.status!=="REMAKE"?
              <Tooltip content="Cancel Order (cancel labels to)">
                  <Button size="large" monochrome destructive onClick={()=>handleCancelPmOrder()}
                    icon={MobileCancelMajorMonotone}></Button>
              </Tooltip>
              :null
            }
          </ButtonGroup>
        </Stack>
      </Stack.Item>
      :
      <Stack.Item>
        <Tooltip content="PM Order Dashboard">
          <Button size="large" plain icon={AnalyticsMajorMonotone} onClick={handldeGoToDashboard}></Button>
        </Tooltip>
      </Stack.Item>
    }
    </Stack>
    <div style={{height:"1rem"}}></div>
    <PageActions/>
  </>
}

export default PickmasterOrderEditingHeader
