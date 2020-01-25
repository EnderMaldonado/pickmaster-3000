import React,{useState, useEffect} from 'react'
import { Checkbox } from '@shopify/polaris'

const CheckboxSelectAll = ({allCheckbos, handleSelectAll}) => {

  const [active, setActive] = useState(false)

  useEffect(()=>{
    if(allCheckbos && Object.keys(allCheckbos).length > 0){
      setActive(!Object.keys(allCheckbos).some(key => !allCheckbos[key]))
    } else
      setActive(false)

  },[allCheckbos])

  return <Checkbox label="" checked={active} onChange={(value, id)=>handleSelectAll(value, id)} />
}

export default CheckboxSelectAll
