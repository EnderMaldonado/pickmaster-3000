import {useState, useEffect} from 'react'
import { Spinner, Button } from '@shopify/polaris'

const ButtonPrintRomaneo = ({sku, isPmOrder, handlePrintRomaneo}) => {

  const [loading, setLoading] = useState(false)
  const handleClick = () => {
    setLoading(true)
    handlePrintRomaneo(sku)
    .then(res => setLoading(false))
  }

  useEffect(()=>{
    setLoading(false)
    return () => setLoading(false)
  },[sku])

  const icon=<svg style={{width:"1.5em",height:"1.5em"}} viewBox="0 0 20 20">
    <path d="M18 10H6A2 2 0 0 0 4 12V19H20V12A2 2 0 0 0 18 10M18 14H14V12H18M17 9H7V4H17Z"/>
  </svg>

  return loading && !isPmOrder?
    <Spinner accessibilityLabel="Spinner example" size="small" color="teal" />
    :
    <div style={{color:`${isPmOrder?"#108043":"#000000"}`}}>
      <Button plain monochrome icon={icon} onClick={()=>handleClick()}>
      </Button>
    </div>
    
}

export default ButtonPrintRomaneo
