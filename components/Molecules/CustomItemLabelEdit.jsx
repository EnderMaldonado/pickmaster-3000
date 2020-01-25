import {useState, useEffect} from 'react'
import { Card, Select, Button, TextField, Stack } from '@shopify/polaris'

const CustomItemLabelEdit = ({setLabel, label}) => {

  const [enableIO, setEnableIO] = useState(false)
  const handleEnableIO = () => setEnableIO(!enableIO)
  const [customItem, setCustomItem] = useState({
    "sku": "",
    "name": "",
    "quantity": 0,
    "unitPrice": 0,
    "imageUrl": ""
  })

  const handleChangeCustomItem = (value, key) =>
    setCustomItem({...customItem, [key]:value})

  useEffect(()=>{
    setLabel({...label, customItem:enableIO?customItem:null})
  },[customItem, enableIO])

  return (
    <Card subdued sectioned>
      <Stack wrap={false} alignment="center">
        <Stack.Item fill>
          <h2 className="Polaris-Heading">Custom Label Description</h2>
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
          <TextField disabled={!enableIO} label="Custom SKU" value={customItem.sku} id="sku" onChange={handleChangeCustomItem}/>
          <TextField disabled={!enableIO} multiline label="Custom Description" value={customItem.name} id="name" onChange={handleChangeCustomItem}/>
          <Stack distribution="fill" wrap={false} alignment="center">
            <TextField disabled={!enableIO} type="number" label="Custom Quantity" value={customItem.quantity} id="quantity" onChange={handleChangeCustomItem}/>
            <TextField disabled={!enableIO} type="number" prefix="$" label="Custom Price" value={customItem.unitPrice} id="unitPrice" onChange={handleChangeCustomItem}/>
          </Stack>
        </Card>
      </Card.Subsection>
    </Card>
  )
}

export default CustomItemLabelEdit
