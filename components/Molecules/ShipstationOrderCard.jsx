import { TextContainer, Heading, DisplayText, Card} from '@shopify/polaris'
import BadgeStatus from '../Atoms/BadgeStatus'
import {getDatePrety} from '../hooks/PickmasterTools'
const ShipstationOrderCard = ({ssOrderNumber, createdAt, status}) => {

  const conditionsStatus = {
    "Packed":"attention",
    "Processed":"success",
    "Cancelled":"warning",
    "Remake":"warning"
  }

return  <Card sectioned>
          <TextContainer spacing="tight">
            <Heading><BadgeStatus status={status} conditions={conditionsStatus}/></Heading>
            <DisplayText size="small">Shipstation Order <b>{ssOrderNumber}</b></DisplayText>
            <span> created at {getDatePrety(createdAt)}</span>
          </TextContainer>
        </Card>
}

export default ShipstationOrderCard
