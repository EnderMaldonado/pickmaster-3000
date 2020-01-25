import { Layout, DisplayText, TextStyle, Card, Button} from '@shopify/polaris'
import PmOrderHistory from '../Organisms/PmOrderHistory'
import ShipstationOrderCard from '../Molecules/ShipstationOrderCard'
import usePickmasterHandles from '../hooks/usePickmasterHandles'

const OrderDetails = ({pmOrder}) => {

  const {navigatePmOrderEditTo} = usePickmasterHandles()

  const ssO = pmOrder.shipstationOrders

  const handleRedirect = () => navigatePmOrderEditTo("PMOrderShipstationOrdersProcess")

  return <>
    <Layout>
      <Layout.Section>
        <PmOrderHistory pmOrderSku={pmOrder.pmOrderSku}/>
      </Layout.Section>
      <Layout.Section secondary>
        <DisplayText size="small">
        {
          ssO?
          <TextStyle variation="positive">Shipstations Orders</TextStyle>
          :
          <TextStyle variation="negative">Not Shipstation Orders</TextStyle>
        }
        </DisplayText>
        {
            ssO?
            <Card sectioned>
            <Button primary size="large" fullWidth={true} onClick={handleRedirect}>View Labels</Button>
            </Card>:null
        }
        {
          ssO?Object.keys(ssO).map((key,i) =>
           <ShipstationOrderCard key={i}
           ssOrderNumber={ssO[key].ssOrderNumber}
           createdAt={ssO[key].createdAt}
           status={ssO[key].status}/>):null
        }
        {
            ssO?
            <Card sectioned>
            <Button primary size="large" fullWidth={true} onClick={handleRedirect}>View Labels</Button>
            </Card>:null
        }
      </Layout.Section>
    </Layout>
  </>
}

export default OrderDetails
