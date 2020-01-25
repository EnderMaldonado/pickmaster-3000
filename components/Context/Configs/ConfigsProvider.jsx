import React,{useReducer} from 'react'
import ConfigsContext from './ConfigsContext'
import {UPDATE_CONFIG_OPTIONS_SERVICES, UPDATE_CONFIG_OPTIONS_TAGLOCATION, 
        UPDATE_CONFIG_OPTIONS_FRONTEND} from '../actions.js'

const initialState = {
  conditionsServiceOptions:{
    conditionsServiceOptionsDefault:[]
  },
  tagLocation:"",
  locationId:null,
  shopOrigin:null,
  dataUpdateQuantity:null,
  dateUpdateMin:null,
  shippingServices:null
}

const configsReducer = (state, {type, conditionsServiceOptions, tagLocation, locationId, shopOrigin, dataUpdateQuantity,
  dateUpdateMin, shippingServices, region, platform, queryValue}) => {
  switch (type) {
    case UPDATE_CONFIG_OPTIONS_SERVICES:
      return {...state, conditionsServiceOptions}
    case UPDATE_CONFIG_OPTIONS_TAGLOCATION:
      return {...state, tagLocation}
    case UPDATE_CONFIG_OPTIONS_FRONTEND:
      let locationIdaux = locationId?locationId:state.locationId,
          shopOriginaux = shopOrigin?shopOrigin:state.shopOrigin,
          dataUpdateQuantityaux = dataUpdateQuantity?dataUpdateQuantity:state.dataUpdateQuantity,
          dateUpdateMinaux = dateUpdateMin?dateUpdateMin:state.dateUpdateMin,
          shippingServicesaux = shippingServices?shippingServices:state.shippingServices
      return {...state, locationId:locationIdaux, shopOrigin:shopOriginaux, dataUpdateQuantity:dataUpdateQuantityaux,
              dateUpdateMin:dateUpdateMinaux, shippingServices:shippingServicesaux}
    default:
    return state
  }
}


const ConfigsProvider = ({children}) => {
  const [state, dispatch] = useReducer(configsReducer, initialState)
  return (
    <ConfigsContext.Provider value={[state, dispatch]}>
      {children}
    </ConfigsContext.Provider>
  )
}

export default ConfigsProvider
