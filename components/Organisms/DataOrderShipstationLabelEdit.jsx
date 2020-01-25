import { Stack, Tooltip, Button, Subheading, Spinner, Card, TextField, Layout} from '@shopify/polaris'
import SelectServiceShipping from '../Molecules/SelectServiceShipping'
import AddressEdit from '../Molecules/AddressEdit'
import ShippingRate from '../Atoms/ShippingRate'
import ItemsListEditing from '../Organisms/ItemsListEditing'
import { useEffect } from 'react'
import {TransportMajorMonotone, AddProductMajorMonotone} from '@shopify/polaris-icons';

const DataOrderShipstationLabelEdit = ({ shippingAddress,
  weight, size, items, loading,
  carrierCode, serviceCode, label, setLabel, setCanProcess,
  handleChangeLabelSimpleValue,handleChangeLabelItemsValue,
  handleChangeLabelSizeValue, handleChangeLabelServiceValue, handleChangeLabelShippingAddressValue,
  handleProcessLabel, handleAddCustomProduct}) => {

  useEffect(()=>{
    handleChangeLabelSimpleValue(4,"weight")
    Object.keys(items).forEach((sku,i) => {
      if(items[sku].type && items[sku].type === "Game")
        handleChangeLabelItemsValue(14.99, sku, "unitPrice")
      if(((items[sku].type && items[sku].type === "Funko") || (items[sku].category === "Funko")) && shippingAddress.country_code === "BR")
        handleChangeLabelItemsValue(7.99, sku, "unitPrice")
    })
  },[])

  return (
    <Card sectioned>
      <Card.Section>
        <Layout>
          <Layout.Section sectioned>

            <AddressEdit {...{...shippingAddress}} title={"Shipping Address"} handleChangeAddress={handleChangeLabelShippingAddressValue}/>

          </Layout.Section>
          <Layout.Section secondary>
            <Card title="Configure Shipping Service" subdued sectioned>
              <TextField label="Weight (oz)" type="number" value={weight} id="weight" onChange={handleChangeLabelSimpleValue}/>
              Size
              <Stack distribution="fill" wrap={false} alignment="center">
                  <span>L:</span><TextField type="number" value={size.l?size.l:0} id="l" onChange={handleChangeLabelSizeValue}/>
                  <span>W:</span><TextField type="number" value={size.w?size.w:0} id="w" onChange={handleChangeLabelSizeValue}/>
                  <span>H:</span><TextField type="number" value={size.h?size.h:0} id="h" onChange={handleChangeLabelSizeValue}/>
              </Stack>
              <div style={{height: "1.6rem"}}></div>
              <SelectServiceShipping
                {...{shippingAddress, weight, size, setCanProcess,
                  handleChangeLabelServiceValue}}
              />
              <div style={{height: "1.6rem"}}></div>
              {
                loading?
                <Spinner key={label.pmSsOrderId+"Spinner"} accessibilityLabel="Loading... label"/>
                :
                <Tooltip content="Process The Label">
                  <div style={{color:"#6371c7"}}>
                    <Button size="slim" fullWidth outline monochrome={true} icon={TransportMajorMonotone}
                    onClick={()=>handleProcessLabel()}></Button>
                  </div>
                </Tooltip>
              }
            </Card>
          </Layout.Section>
        </Layout>
      </Card.Section>
      <Card.Section>
        <Stack>
          <Stack.Item fill><Subheading>Items</Subheading></Stack.Item>
          <Stack.Item>
            <Tooltip content={"Add Custom Product"}>
              <div style={{color: '#9c6ade'}}>
                <Button plain monochrome onClick={handleAddCustomProduct} icon={AddProductMajorMonotone}>
                </Button>
              </div>
            </Tooltip>
          </Stack.Item>
        </Stack>
        <ItemsListEditing {...{items, label, setLabel, handleChangeLabelItemsValue}}/>
      </Card.Section>
    </Card>
  )

}

export default DataOrderShipstationLabelEdit
