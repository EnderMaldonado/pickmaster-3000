import { TextStyle } from '@shopify/polaris'

const OrderPendingPlatforms = ({count}) => {

  const gNStyle= n => <span style={{fontWeight:n>0?"bold":"400"}}>{n}</span>
  const gPStyle = (n) => <TextStyle variation={typeof n === "number" && n>0?"strong":"subdued"}>{gNStyle(n)}</TextStyle>
  const total = () => {
    let t = 0
    Object.keys(count).forEach(key => t += count[key])
    return t
  }
  return <>
          <span>{gPStyle(count?count.shopify:"..")}</span>
          <span>{gPStyle(count?count.amazon:"..")}</span>
          <span>{gPStyle(count?count.ebayINTL:"..")}</span>
          <span>{gPStyle(count?count.ebayUSA:"..")}</span>
          <span>{gPStyle(count?total():"..")}</span>
      </>
}

export default OrderPendingPlatforms