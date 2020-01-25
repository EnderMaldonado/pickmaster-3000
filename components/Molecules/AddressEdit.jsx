import { Stack, Card, TextField, FormLayout} from '@shopify/polaris'

const AddressEdit = ({title, customerName, company, address1, address2,
  city, state, country_code, phone, postalCode, residential, handleChangeAddress}) =>
  <Card title={title} subdued sectioned>
    <FormLayout>
    <FormLayout.Group>
      <TextField label="Name" value={customerName} id="customerName" onChange={handleChangeAddress}/>
        <TextField label="Company" value={company} id="company" onChange={handleChangeAddress}/>
        <TextField label="Address 1" value={address1} id="address1" onChange={handleChangeAddress}/>
        <TextField label="Address 2" value={address2} id="address2" onChange={handleChangeAddress}/>
      </FormLayout.Group>
      <FormLayout.Group condensed>
        <TextField label="City" value={city} id="city" onChange={handleChangeAddress}/>
        <TextField label="State" value={state} id="state" onChange={handleChangeAddress}/>
        <TextField label="Contry" value={country_code} id="country_code" onChange={handleChangeAddress}/>
        <TextField label="Phone" type="tel" value={phone} id="phone" onChange={handleChangeAddress}/>
        <TextField label="Postal code" type="text" value={postalCode} id="postalCode" onChange={handleChangeAddress}/>
      </FormLayout.Group>
    </FormLayout>
  </Card>


export default AddressEdit
