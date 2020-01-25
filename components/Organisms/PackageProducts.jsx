import {useContext, useState, useEffect} from 'react'
import { Layout, Stack,  Card, Heading, Button, TextContainer } from '@shopify/polaris'
import ProductCardInPackage from '../Molecules/ProductCardInPackage'
import CacheOrdersContext from '../Context/CacheOrders/CacheOrdersContext'

const PackageProducts = ({pmOrderData, pack, packages, packIndex, handleClickActionList})=> {

  useEffect(()=>{},[packages])
  return (
    <Card sectioned title={`Pack ${packIndex+1}`}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px,3fr))",
        justifyContent: "stretch",
        width:"100%"
      }}>
        {
          Object.keys(pmOrderData.items).map((key,i) => {
            return pack[key].quantityInPackage > 0 ?
                <ProductCardInPackage
                  {...{...pmOrderData.items[key]}}
                  key={i}
                  packages={packages}
                  packIndex={packIndex}
                  quantityInPackage={pack[key].quantityInPackage}
                  handleClickActionList={handleClickActionList}
                />
              :
                null
          })
        }
      </div>
      <Card.Section subdued>
        <Stack distribution="trailing">
          <TextContainer>
            Total Items in Package {pack.packageItemsTotalQuantity}
          </TextContainer>
        </Stack>
      </Card.Section>
    </Card>
  )
}

export default PackageProducts
