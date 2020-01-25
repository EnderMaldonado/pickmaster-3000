import { Card, Stack, TextStyle, TextContainer, Button, ButtonGroup } from '@shopify/polaris'
import ThumbnailImage from '../Atoms/ThumbnailImage'
import {PackageMajorMonotone} from '@shopify/polaris-icons';
import {CircleLeftMajorMonotone, CircleRightMajorMonotone} from '@shopify/polaris-icons'
const ProductCardInPackage = ({category, imageAltText, imageUrl, quantityInPackage,
                                  sku, name, packages, packIndex, handleClickActionList}) => {

  const onClickActionList = (direction) => {
    handleClickActionList(packIndex, direction, quantityInPackage, 1, sku)
  }

  const getPakcages = () => {
    let items = []
    packages.map((p,i) => {
      if(i !== packIndex)
        items.push({content:`Pack ${i+1}`, onAction:() => onClickActionList(i), icon:PackageMajorMonotone})
    })
    return items
  }

  return (
    <div style={{
      maxWidth: "calc(100% - 2rem)",
      marginTop: "2rem",
      marginLeft: "2rem"
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
              <p>SKU: {sku}<br/>
              {category}<br/>
              Quantity in Package: {quantityInPackage}</p>
            </TextContainer>
          </Stack.Item>
          </div>
        </Stack>
          <Card.Subsection>
            <div style={{marginTop:".5em",textAlign:"center"}}>
                <Stack distribution="center">
                  {
                    packIndex>0?
                    <div style={{color:"#212b36"}}>
                      <Button icon={CircleLeftMajorMonotone} size="large" onClick={()=>onClickActionList(-1)} outline monochrome></Button>
                    </div>:null
                  }
                  <div style={{color:"#212b36"}}>
                    <Button icon={CircleRightMajorMonotone} size="large" onClick={()=>onClickActionList(1)} outline monochrome></Button>
                  </div>
                </Stack>
            </div>
          </Card.Subsection>
        </Card.Section>
      </Card>
    </div>
  )
}

export default ProductCardInPackage
