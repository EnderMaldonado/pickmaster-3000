import {  Icon, TextStyle, Heading } from '@shopify/polaris'

const ShippingRateProcessed = ({rate}) => <>
   <Heading>Shipping Rate:&nbsp;
   {
     rate?
     <TextStyle variation="positive">$ {rate}</TextStyle>
     :
     <Icon source={<svg viewBox="0 0 24 24"><path fill="#000000" d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" /></svg>}/>
   }
   </Heading>
</>

export default ShippingRateProcessed
