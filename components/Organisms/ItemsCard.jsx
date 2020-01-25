import { Card } from '@shopify/polaris'
import ProductCardLittle from '../Molecules/ProductCardLittle'

const ItemsCard = ({title, items}) => {

  return <Card title={title} sectioned>
    {
      Object.keys(items).map((key,i) => <ProductCardLittle key={i} {...{...items[key]}} />)
    }
    </Card>
}

export default ItemsCard
