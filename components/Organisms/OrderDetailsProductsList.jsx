import React,{useContext} from 'react'
import ProductCard from '../Molecules/ProductCard'
import CacheOrdersContext from '../Context/CacheOrders/CacheOrdersContext'
import * as PropTypes from 'prop-types'

const OrderDetailsProductsList = ({productsScaned, pmOrder}) => {

  const items = pmOrder.orderData.items

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px,3fr))",
      justifyContent: "stretch",
      width:"100%"
    }}>
      {
        Object.keys(items).map((key,i) => {
          return (<ProductCard
            {...{...items[key]}}
            productsScaned={productsScaned[key]}
            key={i}
          />)
        })
      }
    </div>
  )
}

OrderDetailsProductsList.prototype = {
  productsScaned: PropTypes.object
}

OrderDetailsProductsList.defaultProps = {
  productsScaned: {}
}

export default OrderDetailsProductsList
