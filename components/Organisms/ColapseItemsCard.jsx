import {useState} from 'react'
import { Collapsible, Card, Button, TextContainer, TextStyle, Stack } from '@shopify/polaris'
import ThumbnailImage from '../Atoms/ThumbnailImage'

const ColapseItemsCard = ({title, items, initialActive, size}) => {

  const [active, setActive] = useState(true);
  const handleToggle = () => setActive(!active)

  return (
    <>
      <Card.Section >
        <Button
          onClick={handleToggle}
          ariaExpanded={active}
          ariaControls="basic-collapsible"
          fullWidth
          plain
          disclosure={!active}
          size={size || "medium"}
        >
         {title}
        </Button>
      </Card.Section>
      <Collapsible open={active} id="basic-collapsible">
        <Card.Section>
          {
            Object.keys(items).map((key,i) => {
              let {imageUrl, imageAltText, unitPrice, name, location, sku, category, quantity} = items[key]
              return (
                <Stack wrap={false} key={i}>
                  <div style={{display: "grid", gridTemplateColumns: "min-content auto", gridGap: "1.6rem"}}>
                    <Stack.Item>
                      <ThumbnailImage
                        source={imageUrl}
                        alt={imageAltText}
                      />
                    </Stack.Item>
                    <Stack.Item>
                      <TextContainer spacing="loose">
                        <h3><TextStyle variation="strong">{name}</TextStyle></h3>
                        <p>Location: {location}<br/>
                        SKU: {sku}<br/>
                        {category}<br/>
                        Quantity: {quantity}<br/>
                        Unit price: {unitPrice}</p>
                      </TextContainer>
                    </Stack.Item>
                  </div>
                </Stack>
              )
            })
          }
        </Card.Section>
      </Collapsible>
    </>
  )
}

export default ColapseItemsCard
