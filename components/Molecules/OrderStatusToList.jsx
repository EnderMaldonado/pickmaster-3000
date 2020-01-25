import {useEffect} from 'react'
import { TextStyle } from '@shopify/polaris'
import useFirebaseGet from '../hooks/useFirebaseGet'
import OrderStatusToListBadge from '../Atoms/OrderStatusToListBadge'

const OrderStatusToList = ({pmOrderSku, showListSelect}) => {

  useEffect(()=>{}, [pmOrderSku, showListSelect])

  return <OrderStatusToListBadge key={`${pmOrderSku}-${showListSelect}`} sku={pmOrderSku}/>
}

export default OrderStatusToList
