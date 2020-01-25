import { Card, Spinner } from '@shopify/polaris'
import CardWarning from '../Atoms/CardWarning'
import { useEffect } from 'react'

const ListCardsWarning = ({ pmOrdersWarning, handleClickPmOrder}) => {

  return pmOrdersWarning?
        Object.keys(pmOrdersWarning).map((key,i) => 
          <CardWarning key={i} {...{...pmOrdersWarning[key], handleClickPmOrder}}/>
        )
      :<Card sectioned>Nothing here...</Card>
}

export default ListCardsWarning