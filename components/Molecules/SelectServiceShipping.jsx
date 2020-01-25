import {useState, useEffect, useContext} from 'react'
import {  Stack, Card, OptionList, Spinner } from '@shopify/polaris'
import ConfigsContext from '../Context/Configs/ConfigsContext'
import { getServiceCode, getCarrierCode, getServicesOptionsShipstation, getServiceName } from '../hooks/PickmasterTools'
import ShippingRate from '../Atoms/ShippingRate'

const SelectServiceShipping = ({handleChangeLabelServiceValue,
  shippingAddress, weight, size, setCanProcess}) => {

  const {state, city, country_code, postalCode} = shippingAddress

  const [{conditionsServiceOptions, shippingServices}] = useContext(ConfigsContext)

  const servicesOptionsShipstation = getServicesOptionsShipstation(conditionsServiceOptions, shippingServices, shippingAddress.country_code)

  const [optionsService, setOptionsService] = useState([])

  const [serviceSelected, setServiceSelected] = useState([])

  const handleSelectService = value => {
    setServiceSelected(value)
    handleChangeLabelServiceValue(getCarrierCode(value[0]), getServiceCode(value[0]))
  }

  useEffect(()=>{
    setOptionsService(servicesOptionsShipstation.map((serv,i) => {
      return {label:getLabel(serv, i), value:serv}
    }))

    if(conditionsServiceOptions)
      Object.keys(conditionsServiceOptions).some(c => {
        if(c!=="conditionsServiceOptionsDefault" && 
        conditionsServiceOptions[c].options.toLowerCase().includes(shippingAddress.country_code.toLowerCase())){
          handleSelectService([conditionsServiceOptions[c].service])
          return;
        }
      })
    return () => {
      setOptionsService([])
      setServiceSelected([])
    }
  },[state, city, country_code, postalCode])

  const getLabel = (serv, i) => <Stack key={i}>
    <Stack.Item fill>
      {serv.substring( serv.lastIndexOf("|")+1, serv.length)}
    </Stack.Item>
    <Stack.Item>
      <ShippingRate carrierCode={getCarrierCode(serv)} serviceCode={getServiceCode(serv)}
        {...{...shippingAddress, weight, size, setCanProcess}}/>
    </Stack.Item>
  </Stack>

  return <div style={{maxHeight:"30rem", overflowY:"auto"}}>
    <Card>
      <OptionList
        title={serviceSelected.length?<span>Srevice Selected: <span style={{color:"#108043"}}>{" "+getServiceName(serviceSelected[0])}</span></span> : <span style={{color:"#bf0711"}}>Select Srevice</span>}
        onChange={handleSelectService}
        options={optionsService}
        selected={serviceSelected}
      />
    </Card>
  </div>
}

export default SelectServiceShipping
