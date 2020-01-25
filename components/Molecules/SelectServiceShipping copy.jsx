import {useState, useEffect, useContext} from 'react'
import { Select } from '@shopify/polaris'
import ConfigsContext from '../Context/Configs/ConfigsContext'
import { getServiceCode, getCarrierCode } from '../hooks/PickmasterTools'

const SelectServiceShipping = ({handleChangeLabelServiceValue, serviceCode}) => {

  const [{conditionsServiceOptions, shippingServices}] = useContext(ConfigsContext)

  const servicesOptionsShipstation = conditionsServiceOptions && conditionsServiceOptions.conditionsServiceOptionsDefault.length?conditionsServiceOptions.conditionsServiceOptionsDefault: shippingServices

  const [optionsService, setOptionsService] = useState([])

  const [serviceSelected, setServiceSelected] = useState("")

  const handleSelectService = value => {
    setServiceSelected(value)
    handleChangeLabelServiceValue(getCarrierCode(value), getServiceCode(value))
  }

  useEffect(()=>{
    setOptionsService(servicesOptionsShipstation.map(serv => {
      return {label:serv.substring( serv.lastIndexOf("|")+1, serv.length), value:serv}
    }))
    setServiceSelected(serviceSelected?serviceSelected:servicesOptionsShipstation.filter(serv =>
      serv.includes(serviceCode===""?null:serviceCode)
    )[0])
  },[serviceSelected])

  return (
    <>
      <Select label="Service" onChange={handleSelectService}
        value={serviceSelected} placeholder="Select Service"
        options={optionsService}
        error={serviceSelected?false:"Service is required"}
      />
    </>
  )
}

export default SelectServiceShipping
