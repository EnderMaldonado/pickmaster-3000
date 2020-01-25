import { useEffect, useState } from 'react'
import usePickmasterHandles from '../hooks/usePickmasterHandles'
import OrderPendingPlatforms from '../Molecules/OrderPendingPlatforms'

const PMOrdersProcessed = () => {

  const {pmOrdersFinalized} = usePickmasterHandles()
  const [counts, setCounts] = useState({})
  
  useEffect(()=>{
    pmOrdersFinalized()
    .then(res => {
      setCounts(res)})
    .catch(err => console.log(err))
    return  () => {
      setCounts([])
    }
  },[])

  return <>
      <p style={{fontWeight:"bold", justifyDelf: "left"}}>Orders Processed:&nbsp;</p>
      <OrderPendingPlatforms count={counts}/>
  </>
}

export default PMOrdersProcessed