import { Stack, Heading, Tooltip, Button} from '@shopify/polaris'
import ItemListEditing from '../Molecules/ItemListEditing'
const ItemsListEditing = ({items, label, setLabel, handleChangeLabelItemsValue}) => {

  const handleToggle = (sku, active) => {
    if(!active)
      setLabel({...label, items:{...label.items, [sku]:{...label.items[sku], enabled:false} }})
     else
      setLabel({...label, items:{...label.items, [sku]:{...label.items[sku], enabled:true} }})
  }

return <>
    <Stack distribution="fill" wrap={false} alignment="center">
      <div style={{display:"grid", gridTemplateColumns:"1fr 2fr 4fr 1fr 1fr 1fr", 
      gridGap:"1.6rem", justifyItems: "center", alignItems: "center", marginBottom:"1rem"}}>
        <Heading>Image</Heading>
        <Heading size="small">SKU</Heading>
        <Heading size="small">Title</Heading>
        <Heading size="small">Quantity</Heading>
        <Heading size="small">Price</Heading>
      </div>
    </Stack>
    {
      Object.keys(items).map((key,i) => <ItemListEditing key={i} {...{...items[key], label,
        setLabel, handleChangeLabelItemsValue, handleToggle}} totalItems={Object.keys(items).length}
         canInabled={i!==0} />)
    }
  </>
}

export default ItemsListEditing
