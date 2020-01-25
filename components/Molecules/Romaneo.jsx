import {useContext, useEffect} from 'react'
import BarCodeCanvas from '../Atoms/BarCodeCanvas'
import CacheOrdersContext from '../Context/CacheOrders/CacheOrdersContext'

const Romaneo = ({order, keyBar}) => {

  const romaneoStyle = {
    display: "grid",
    width: "200px",
    fontSize: "12px",
    fontFamily: "monospace",
    border: "0",
    borderTop: "3px solid",
    borderStyle: "dotted",
    marginTop: "1em"
  }
  const orderNumberStyle = {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "2em"
  }
  const skuStyle = {
    textAlign: "center",
    fontSize: "1.2em",
    fontWeight: "bold",
    marginBottom: ".2em",
  }
  const itemsQtyStyle = {
    display: "grid",
    gridTemplateColumns: "max-content 1fr max-content"
  }
  const itmeStyle = {
    display: "grid",
    border: "0",
    borderTop: "1px solid",
    borderStyle: "dashed"
  }
  const itemTitleStyle = {
    fontWeight: "bold",
    textAlign: "center"
  }
  const itemSpesificsStyle = {
    display: "grid",
    gridTemplateColumns: "auto auto"
  }
  const customerStyle = {
    fontSize: "1.1em",
    fontWeight: "bold",
    marginBottom: ".2em",
  }
  return <>
    <div style={romaneoStyle}>
      <span style={orderNumberStyle}>ORDER {order.number}</span>
      <BarCodeCanvas sku={order.orderSku} prefix={"romaneo"} sufix={keyBar}/>
      <span style={skuStyle}>{order.orderSku}</span>
      <span style={customerStyle}>- {order.shippingAddressName || order.customerName}
      {order.customerId?<span><br/>- {order.customerId}</span>:null}
      </span>
      <div style={itemsQtyStyle}>
        <span style={{textAlign:"left"}}>Items Qtd: {order.totalItems}</span>
        <span style={{textAlign:"center"}}>|</span>
        <span style={{textAlign:"right"}}>Different Items: {order.differentItems}</span>
      </div>
      <span style={{textAlign:"center",marginTop: ".5em"}}>ITEMS</span>
      {
        Object.keys(order.items).map((key,i) => {
          let item = order.items[key]
          return (
            <div style={itmeStyle} key={`${i}-${item.sku}`}>
              <span style={itemTitleStyle}>{item.title}</span>
              <div style={itemSpesificsStyle}>
                <span style={{textAlign:"left"}}>SKU:</span><span style={{textAlign:"right"}}>{item.sku}</span>
              </div>
              <div style={itemSpesificsStyle}>
                <span style={{textAlign:"left"}}>Location:</span><span style={{textAlign:"right"}}>{item.location}</span>
              </div>
              <div style={itemSpesificsStyle}>
                <span style={{textAlign:"left"}}>Qty:</span><span style={{textAlign:"right"}}>{item.quantity>1?"****** ":""}{item.quantity}</span>
              </div>
              <div style={itemSpesificsStyle}>
                <span style={{textAlign:"left"}}>Category:</span><span style={{textAlign:"right"}}>{item.category}</span>
              </div>
            </div>
          )
        })
      }
    </div>
  </>
}
export default Romaneo
