import React, {useState} from 'react'
import { Card, Stack, Thumbnail, TextStyle, DisplayText, TextContainer } from '@shopify/polaris'
import ThumbnailImage from '../Atoms/ThumbnailImage'
import * as PropTypes from 'prop-types'

const ProductCard = ({category, imageAltText, imageUrl, quantity,
                                  sku, name, location, productsScaned}) => {
  return (
    <div style={{
      maxWidth: "calc(100% - 2rem)",
      marginTop: "2rem",
      marginLeft: "2rem",
      boxShadow: `${productsScaned.isScanned?"0 0 3px 2px #108043":"none"}`
    }}
    className="Container-Polaris-Card"
    >
      <Card className={"marcado"} style={{height: "100%"}}>
        <Card.Section>
          <Stack wrap={false}>
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
                Quantity: {quantity}</p>
              </TextContainer>
            </Stack.Item>
            </div>
          </Stack>
          <Card.Subsection>
            <div style={{marginTop:".5em",textAlign:"center"}}>
              {
                productsScaned.scannedLess === 0 ?
                  <TextStyle variation="negative">
                    Unscanned
                  </TextStyle>
                :
                  productsScaned.scannedLess === quantity ?
                    <TextStyle variation="positive">
                      <DisplayText size="small">Scanned</DisplayText>
                    </TextStyle>
                  :
                    <TextStyle variation="negative">
                      {productsScaned.scannedLess} of {quantity} Scanned
                    </TextStyle>
              }
            </div>
          </Card.Subsection>
        </Card.Section>
      </Card>
    </div>
  )
}

ProductCard.prototype = {
  productsScaned: PropTypes.object
}

ProductCard.defaultProps = {
  productsScaned: {}
}
export default ProductCard
