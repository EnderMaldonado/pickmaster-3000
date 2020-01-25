import {useState} from 'react'
import { Button, Stack, Thumbnail, TextField} from '@shopify/polaris'
import {CircleDisabledMajorMonotone, AccessibilityMajorMonotone} from '@shopify/polaris-icons'

const ItemListEditing = ({imageAltText, imageUrl, sku, name, quantity, unitPrice,
   handleToggle, canInabled, handleChangeLabelItemsValue, totalItems}) => {

  const [active, setActive] = useState(true)
  const onToggle = () => {
    handleToggle(sku, !active)
    setActive(!active)
  }

  return <Stack distribution="fill" wrap={false} alignment="center">
    <div style={{display:"grid", gridTemplateColumns:"1fr 2fr 4fr 1fr 1fr 1fr", 
    gridGap:"1.6rem", justifyItems: "center", alignItems: "center"}}>
      <Thumbnail
        source={imageUrl}
        alt={imageAltText}
      />
      <TextField disabled={!active} value={sku} onChange={(value)=>handleChangeLabelItemsValue(value, sku, "sku")}/>
      <div style={{width:"100%"}}>
        <TextField disabled={!active} value={name} onChange={(value)=>handleChangeLabelItemsValue(value, sku, "name")}/>
      </div>
      <div style={{width:"10rem"}}>
        <TextField fullWidth disabled={!active} value={quantity} type="number" onChange={(value)=>handleChangeLabelItemsValue(value, sku, "quantity")}/>
      </div>
      <div style={{width:"10rem"}}>
        <TextField disabled={!active} value={unitPrice} type="number" onChange={(value)=>handleChangeLabelItemsValue(value, sku, "unitPrice")}/>
      </div>
    {
      totalItems && !canInabled?
        <div style={{width:"4rem"}}></div>:null
    }
    {
      canInabled?
        <Button icon={active ? CircleDisabledMajorMonotone:AccessibilityMajorMonotone} primary={!active} outline={active} onClick={onToggle}></Button>
      : null
    }
    </div>
  </Stack>
}

export default ItemListEditing
