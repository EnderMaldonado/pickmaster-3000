import {useEffect, useState} from 'react'
import { Tabs, Icon } from '@shopify/polaris'
import {ClockMajorMonotone} from '@shopify/polaris-icons';
const TabsOrdersToSend = ({shopifyOrdersList, pmOrdersInProcess, pmOrdersFinalized, pmOrdersCancelled,
  selected, onSelect}) => {

  const [lenghts, setLenghts] = useState({sfy:0, pr:0, fn:0, cn:0})

  useEffect(()=>{
    setLenghts(
      shopifyOrdersList && pmOrdersInProcess && pmOrdersFinalized && pmOrdersCancelled?
        {sfy:Object.keys(shopifyOrdersList).length,
        pr:Object.keys(pmOrdersInProcess).length,
        fn:Object.keys(pmOrdersFinalized).length,
        cn:Object.keys(pmOrdersCancelled).length}
      :
        {sfy:"..",
        pr:"..",
        fn:"..",
        cn:".."}
    )
  },[shopifyOrdersList, pmOrdersInProcess, pmOrdersFinalized, pmOrdersCancelled])

  const tabHistory = <span style={{display:"grid", gridTemplateColumns:"max-content max-content", gridGap:".5rem"}}>
    <Icon source={ClockMajorMonotone} color="inkLighter"/>
    History
  </span>

  return (
    <Tabs tabs={[
      {id:"shopify", content:"Shopify Orders To Send" + ` (${lenghts.sfy})`},
      {id:"process", content:"PM Orders in Process" + ` (${lenghts.pr})`},
      {id:"finalized", content:"PM Orders Finalized" + ` (${lenghts.fn})`},
      {id:"cancelled", content:"PM Orders Cancelled" + ` (${lenghts.cn})`},
      {id:"history", content:tabHistory}
    ]}
    selected={selected} onSelect={onSelect}>
    </Tabs>
  )
}

export default TabsOrdersToSend
