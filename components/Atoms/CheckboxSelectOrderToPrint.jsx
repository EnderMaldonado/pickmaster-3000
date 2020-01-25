import React,{useState, useEffect, useContext } from 'react'
import { Checkbox } from '@shopify/polaris'

const CheckboxSelectOrderToPrint = ({orderSelectToPrint, onChange, sku, currentListSelectedToPrint}) =>{

  useEffect( ()=> {
    if(currentListSelectedToPrint && currentListSelectedToPrint[sku])
      setChecked(currentListSelectedToPrint[sku])
    else
      setChecked(false)
  },[currentListSelectedToPrint])

  const [checked, setChecked] = useState(false)

  return  <>
   <Checkbox id={sku} label="" checked={checked} onChange={(value, id)=>onChange(value, id)} />
  </>
}
export default CheckboxSelectOrderToPrint
