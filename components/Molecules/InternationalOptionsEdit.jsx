import {useState, useEffect} from 'react'
import { Card, Select, Button, TextField, Stack } from '@shopify/polaris'

const InternationalOptionsEdit = ({setLabel, label}) => {

  const [enableIO, setEnableIO] = useState(false)
  const handleEnableIO = () => setEnableIO(!enableIO)
  const [internationalOptions, setInternationalOptions] = useState({
    contents: "merchandise",
    customsItems: [
      {
        customsItemId: "",
        description: "",
        quantity: 0,
        value: 0,
        harmonizedTariffCode: "",
        countryOfOrigin: "US"
      }
    ],
    nonDelivery: "return_to_sender"
  })

  const optionsContents = [
    {label:"Merchandise", value:"merchandise"},
    {label:"Documents", value:"documents"},
    {label:"Gift", value:"gift"},
    {label:"Returned Goods", value:"returned_goods"},
    {label:"Sample", value:"sample"}
  ]
  const handleChangeContens = value => setInternationalOptions({...internationalOptions, contents:value})

  const optionsNonDelivery = [
    {label:"Return to Sender", value:"return_to_sender"},
    {label:"Ttreat as Abandoned", value:"treat_as_abandoned"}
  ]
  const handleChangeNonDelivery = value => setInternationalOptions({...internationalOptions, nonDelivery:value})

  const handleChangeCustomItem = (value, key) =>
    setInternationalOptions({...internationalOptions, customsItems:[{...internationalOptions.customsItems[0], [key]:value}]})

  useEffect(()=>{
    setLabel({...label, internationalOptions:enableIO?internationalOptions:null})
  },[internationalOptions, enableIO])

  return (
    <Card subdued sectioned>
      <Stack wrap={false} alignment="center">
        <Stack.Item fill>
          <h2 className="Polaris-Heading">Custom Options</h2>
        </Stack.Item>
        <Stack.Item>
        {
          enableIO?
          <Button onClick={handleEnableIO} outline>Disable</Button>:
          <Button onClick={handleEnableIO} primary>Enable</Button>
        }
        </Stack.Item>
      </Stack>
      <br/>
      <Card.Subsection>
        <Card sectioned>

          <Select label="Contents" onChange={handleChangeContens}
            value={internationalOptions.contents} placeholder="Select Service"
            options={optionsContents} disabled={!enableIO}/>

            <br/>
          <h2 className="Polaris-Heading">Custom Item</h2>
          <TextField disabled={!enableIO} label="Custom SKU" value={internationalOptions.customsItems[0].customsItemId} id="customsItemId" onChange={handleChangeCustomItem}/>
          <TextField disabled={!enableIO} multiline label="Custom Description" value={internationalOptions.customsItems[0].description} id="description" onChange={handleChangeCustomItem}/>
          <Stack distribution="fill" wrap={false} alignment="center">
            <TextField disabled={!enableIO} type="number" label="Custom Quantity" value={internationalOptions.customsItems[0].quantity} id="quantity" onChange={handleChangeCustomItem}/>
            <TextField disabled={!enableIO} type="number" prefix="$" label="Custom Value" value={internationalOptions.customsItems[0].value} id="value" onChange={handleChangeCustomItem}/>
          </Stack>
          <TextField disabled={!enableIO} label="Harmonized Tariff Code" value={internationalOptions.customsItems[0].harmonizedTariffCode} id="harmonizedTariffCode" onChange={handleChangeCustomItem}/>
          <TextField disabled={!enableIO} label="Country of Origin" value={internationalOptions.customsItems[0].countryOfOrigin} id="countryOfOrigin" onChange={handleChangeCustomItem}/>

          <br/>
          <Select label="Non Delivery" onChange={handleChangeNonDelivery}
            value={internationalOptions.nonDelivery} placeholder="Select Service"
            options={optionsNonDelivery} disabled={!enableIO}/>
        </Card>
      </Card.Subsection>
    </Card>
  )
}

export default InternationalOptionsEdit
