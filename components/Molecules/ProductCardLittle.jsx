import React, {useState} from 'react'
import { Card, Stack, Thumbnail, TextStyle, DisplayText, TextContainer } from '@shopify/polaris'
import ThumbnailImage from '../Atoms/ThumbnailImage'

const ProductCardLittle = ({imageAltText, imageUrl, quantity, sku, name}) => {
  return   <Card sectioned>
          <Stack wrap={false}>
          <div style={{display: "grid", gridTemplateColumns: "min-content auto", gridGap: "1.6rem"}}>
            <Stack.Item>
              <Thumbnail size="large"
                source={imageUrl}
                alt={imageAltText}
              />
            </Stack.Item>
            <Stack.Item>
              <TextContainer spacing="loose">
                <h3><TextStyle variation="strong">{name}</TextStyle></h3>
                <p>SKU: {sku}<br/>
                Quantity: {quantity}</p>
              </TextContainer>
            </Stack.Item>
            </div>
          </Stack>
      </Card>
}

export default ProductCardLittle
