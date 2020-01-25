import { useEffect, useState } from 'react'
import usePickmasterHandles from '../hooks/usePickmasterHandles'
import OrderPendingPlatforms from '../Molecules/OrderPendingPlatforms'
import { Card } from '@shopify/polaris'

const OrdersPending = () => {

  const {getOrdersPendingDays} = usePickmasterHandles()
  const [counts, setCounts] = useState([])

  useEffect(()=>{
    getOrdersPendingDays()
    .then(res => {
      setCounts(res)})
    .catch(err => console.log(err))
    return  () => {
      setCounts([])
    }
  },[])

  return <>
      <p style={{fontWeight:"bold", justifyDelf: "left"}}>Orders Pending:</p>
      <OrderPendingPlatforms count={counts[0]}/>
    </>
}

export default OrdersPending