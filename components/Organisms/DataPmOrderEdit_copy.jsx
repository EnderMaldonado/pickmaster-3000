import { Stack, Heading, Checkbox, DisplayText, TextStyle, Button, Card, TextField, Select, Layout} from '@shopify/polaris'
import ThumbnailImage from '../Atoms/ThumbnailImage'
import AddressEdit from '../Molecules/AddressEdit'

const DataPmOrderEdit = ({customerName, shippingAddress, billingAddress,
                          pmOrderNumber, note, items, orderDate, paymentDate,
                          pmOrder, setPmOrder, region,
                          handleChangePmOrderSimpleValue,
                          handleChangePmOrderOrderDataValue,
                          handleChangePmOrderItemsValue,
                          handleChangePmOrderDataShippingAddressValue,
                          handleChangePmOrderDataBillingAddressValue}) => {

  return (
    <Card sectioned>
      <Card.Section>
        <Layout>
          <Layout.Section sectioned>

            <AddressEdit {...{...shippingAddress}} title={"Shipping Address"} handleChangeAddress={handleChangePmOrderDataShippingAddressValue}/>
            <AddressEdit {...{...billingAddress}} title={"Billing Address"} handleChangeAddress={handleChangePmOrderDataBillingAddressValue}/>

            <Card title="Customer Note" subdued sectioned>
              <TextField label="Note" labelHidden value={note} id="note" multiline onChange={handleChangePmOrderOrderDataValue}/>
            </Card>

          </Layout.Section>
          <Layout.Section secondary>
            <Card title="Configure Shipping Service" subdued sectioned>
                <Card sectioned title="Order Sumamry">
                  <TextField label="Shipstation Order" value={pmOrderNumber} id="pmOrderNumber" onChange={handleChangePmOrderSimpleValue}/>
                  <TextField label="Order Create Date" value={orderDate} id="orderDate" onChange={handleChangePmOrderOrderDataValue}/>
                  <TextField label="Order Payment Date" value={paymentDate} id="paymentDate" onChange={handleChangePmOrderOrderDataValue}/>
                </Card>
            </Card>
          </Layout.Section>
        </Layout>
      </Card.Section>
      <Card.Section title="Items">
        <Stack distribution="fill" wrap={false} alignment="center">
          <Stack.Item>
            <Heading size="small">Image</Heading>
          </Stack.Item>
          <Stack.Item>
            <Heading size="small">SKU</Heading>
          </Stack.Item>
          <Stack.Item>
            <Heading size="small">Title</Heading>
          </Stack.Item>
          <Stack.Item>
            <Heading size="small">Quantity</Heading>
          </Stack.Item>
          <Stack.Item>
            <Heading size="small">Price</Heading>
          </Stack.Item>
        </Stack>
        {
          Object.keys(items).map((key,i) => {
            return (
              <Stack key={i} distribution="fill" wrap={false} alignment="center">
                <Stack.Item>
                  <ThumbnailImage
                  source={items[key].imageUrl}
                  alt={items[key].imageAltText}/>
                </Stack.Item>
                <Stack.Item>
                  <TextField value={items[key].sku} onChange={(value)=>handleChangePmOrderItemsValue(value, key, "sku")}/>
                </Stack.Item>
                <Stack.Item>
                  <TextField value={items[key].name} onChange={(value)=>handleChangePmOrderItemsValue(value, key, "name")}/>
                </Stack.Item>
                <Stack.Item>
                  <TextField value={items[key].quantity} type="number" onChange={(value)=>handleChangePmOrderItemsValue(value, key, "quantity")}/>
                </Stack.Item>
                <Stack.Item>
                  <TextField value={items[key].unitPrice} type="number" onChange={(value)=>handleChangePmOrderItemsValue(value, key, "unitPrice")}/>
                </Stack.Item>
              </Stack>
            )
          })
        }
      </Card.Section>
    </Card>
  )

}

export default DataPmOrderEdit
