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
          </Layout.Section>
        </Layout>
      </Card.Section>
    </Card>
  )

}

export default DataPmOrderEdit
