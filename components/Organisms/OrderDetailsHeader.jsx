import React, {useState, useContext} from 'react'
import { Stack, Card, DisplayText, TextStyle, Button} from '@shopify/polaris'
import CacheOrdersContext from '../Context/CacheOrders/CacheOrdersContext'
import BarCodeDetected from '../Atoms/BarcodeDetected'
import {SET_ORDER_PAGE} from '../Context/actions.js'
import * as PropTypes from 'prop-types'
import PMEditingPageNameHeader from '../Atoms/PMEditingPageNameHeader'
import {getItemsPMAccum} from '../hooks/PickmasterTools.js'

const OrderDetailsHeader = ({pmOrder, skuList, onDetect, productsScaned, handleClickPack, onScannError}) => {

  const {pmOrderNumber, pmOrderSku} = pmOrder
  const {customerName, region, paymentDate, items} = pmOrder.orderData
  const {country} = pmOrder.orderData.shippingAddress

  return (
    <Card subdued sectioned>
      <Stack>
        <Stack.Item fill>
          <Stack>
            <Stack.Item>
              <center>
                <div style={{display:"grid", justifyItems:"center"}}>
                  <PMEditingPageNameHeader title={"Items Scanning"}/>
                  <div style={{
                    marginTop:"10px",
                    height: "50px",
                    width: "70px",
                    background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)",
                    backgroundSize: "6px"
                  }}></div>
                  {pmOrderSku}
                </div>
              </center>
            </Stack.Item>
            <Stack.Item>
              <BarCodeDetected {...{skuList, onDetect}} onError={onScannError}/><br/>
            </Stack.Item>
            <Stack.Item>
              <Stack>
                <Stack.Item fill>
                  Total Products:<br/>
                  Differents Items:<br/>
                  Products Scanned:
                </Stack.Item>
                <Stack.Item>
                  <TextStyle variation="strong">{getItemsPMAccum(items)}</TextStyle><br/>
                  <TextStyle variation="strong">{Object.keys(items).length}</TextStyle><br/>
                  <TextStyle variation="strong">
                    <TextStyle variation={productsScaned.totalScanned===getItemsPMAccum(items)?"positive":"negative"}>{productsScaned.totalScanned} of {getItemsPMAccum(items)}</TextStyle>
                  </TextStyle>
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <Stack>
            <Stack.Item>
              <DisplayText size="small">
                <TextStyle variation={productsScaned.totalScanned===getItemsPMAccum(items)?"positive":"subdued"}>{productsScaned.totalScanned===getItemsPMAccum(items)?"Confirmed":"Pending"}</TextStyle>
              </DisplayText>
            </Stack.Item>
            <Stack.Item>
              <Button primary onClick={()=>handleClickPack(productsScaned.totalScanned===getItemsPMAccum(items))}>Pack</Button>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Card>
  )
}


OrderDetailsHeader.prototype = {
  productsScaned: PropTypes.object
}

OrderDetailsHeader.defaultProps = {
  productsScaned: {}
}

export default OrderDetailsHeader
