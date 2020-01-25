import {useContext} from 'react'
import { Layout, Heading, DisplayText, TextStyle, Button, Card, Icon, Link, Collapsible, ActionList, Popover} from '@shopify/polaris'
import ConfigsContext from '../Context/Configs/ConfigsContext'

import ShippingRateProcessed from '../Atoms/ShippingRateProcessed'
import ShippingCard from '../Organisms/ShippingCard'
import ItemsCard from '../Organisms/ItemsCard'
import DataCard from '../Molecules/DataCard'

import {getItemsPMAccum, getDate, getDatePrety, getQuantity,getServiceNameToCode,
  getTotalPriceLabel, getDescriptionLabel, getTotalQuantityLabel} from '../hooks/PickmasterTools.js'

import BadgeStatus from '../Atoms/BadgeStatus'

const DataOrderShipstationLabel = ({ shippingAddress, weight, size, serviceCode, trackingNumber,
                                     items, remakeParent, remakeReason, remakes,
                                     shippingRate, shippedDate}) => {

  const [{shippingServices}] = useContext(ConfigsContext)
  
  const getPMShipstationLabelDetails = () => {
    let data = []
    if(remakeParent)
      data.push({label:"It's Remake from", description:remakeParent})
    if(remakeReason)
      data.push({label:"Remake reason", description:remakeReason})
    if(remakes) {
      let rmks = Object.keys(remakes).map((key,i) => remakes[key])
      data.push({label:"Remakes", description:rmks.join(", ")})
    }
    data = [...data,
      {label:"Description", description:getDescriptionLabel(items)},
      {label:"Quantity", description:getTotalQuantityLabel(items)},
      {label:"Total Price", description:"$ "+getTotalPriceLabel(items)},
      {label:"Weight", description:weight?weight:"unspecified"},
      {label:"Size", description:<><b>L:</b> {size.l?size.l:"unspecified"} / <b>W:</b> {size.w?size.w:"unspecified"} / <b>H:</b> {size.h?size.h:"unspecified"}</>},
      {label:"Shipping Service", description:serviceCode?getServiceNameToCode(shippingServices, serviceCode):"unspecified"},
      {label:"Tracking Number", description:trackingNumber?<b>{trackingNumber}</b>:"unspecified"}
    ]
    if(shippedDate)
      data.push({label:"Shipped Date", description:getDatePrety(shippedDate)})
    return data
  }

  return <>
      <Layout>
        <Layout.Section oneThird>
          <DataCard title={"Shipstation Label Details"} data={getPMShipstationLabelDetails()}/>
          <br/>
          <ShippingRateProcessed rate={shippingRate}/>
        </Layout.Section>
        <Layout.Section oneThird>
          <ShippingCard title={"Shipping Address"} {...{...shippingAddress}}/>
        </Layout.Section>
        <Layout.Section oneThird>
          <ItemsCard size={"slim"} title={"Items"} items={items}/>
        </Layout.Section>
      </Layout>
    </>

}

export default DataOrderShipstationLabel
