import {useState} from 'react'
import useFirebaseGet from '../hooks/useFirebaseGet'
import { Spinner } from '@shopify/polaris'
import BadgeStatus from './BadgeStatus'

const OrderStatusToListBadge = ({sku}) => {

  const [status, setStatus] = useState("")

  useFirebaseGet([{
      request:`PMOrders/${sku}/status`,
      handleResponse: data => {
        setStatus(data)},
      handleError: error => console.log(err)
    }
  ])

  const conditionsStatus = {
    "In Process (1/4)":"info",
    "In Process (2/4)":"info",
    "In Process (3/4)":"info",
    "In Process (4/4)":"info",
    "FINALIZED":"success",
    "CANCELLED":"warning",
    "REMAKE":"warning"
  }

  return status?
    <BadgeStatus status={status} conditions={conditionsStatus}/>:
    <Spinner accessibilityLabel="Spinner example" size="small" color="inkLightest" />
}

export default OrderStatusToListBadge
