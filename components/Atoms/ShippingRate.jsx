import {useState, useEffect} from 'react'
import { Spinner, Stack, TextStyle, TextContainer, Heading } from '@shopify/polaris'
import {useShipstationGetShippingRates} from '../hooks/ShipstationPromises.js'

const ShippingRate = ({carrierCode, serviceCode, state,
  city, country_code, weight, size, residential, postalCode, setCanProcess}) => {

  useEffect(()=> {
    setRate(null)
    let timer = setTimeout(getRate, 1500)

    return () => {
      clearTimeout(timer)
      setRate(null)
    }
  },[state, city, country_code, weight, size, postalCode])

  const [rate, setRate] = useState("")

  const showShippingRate = () => {
    switch (typeof rate) {
      case "object":
        return <Spinner accessibilityLabel="Small spinner example" size="small" color="teal" />
      case "string":
        return <Stack>
                  <svg style={{width:"24px",height:"24px",marginBottom:"-5px"}} viewBox="0 0 24 24"><path fill="#000000" d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" /></svg>
                  {rate?<p><TextStyle variation="negative">&nbsp;{rate}</TextStyle></p>:null}
              </Stack>
      default:
        return  <TextStyle variation="positive">$ {rate}</TextStyle>
    }
  }

  const getRate = () => {
    useShipstationGetShippingRates({carrierCode, serviceCode, state,
                                      city, country_code, weight, size, residential, postalCode})
      .then(([res, body])=>{
        res.statusCode === 200 ?
          setRate(body[0]["shipmentCost"])
        :
          setRate(body.ExceptionMessage || "")

      if(setCanProcess)setCanProcess(res.statusCode === 200)
      })
      .catch(e=>{
        setRate("")
      })
  }

  

  return <>
    {showShippingRate()}
  </>


}

export default ShippingRate
