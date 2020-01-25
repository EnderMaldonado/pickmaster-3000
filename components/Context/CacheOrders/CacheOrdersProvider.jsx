import React,{useReducer} from 'react'
import CacheOrdersContext from './CacheOrdersContext'
import {SET_CURRENT_PM_ORDER, SET_CURRENT_SHIPSTATION_ORDER,
        RESET_CURRENT_PM_ORDER, RESET_CURRENT_SHIPSTATION_ORDER, RESET_CURRENTS,
        ADD_PM_ROMANEO_ORDER_DATA_TO_LIST_PRINT} from '../actions.js'

const initialState = {
  currentPMOrderSku:null,
  currentShipStationOrderId:null
}

const cacheOrdersReducer = (state, {type, currentPMOrderSku, currentShipStationOrderId}) => {
  switch (type) {
    case SET_CURRENT_PM_ORDER:
      return {...state, currentPMOrderSku}
    case SET_CURRENT_SHIPSTATION_ORDER:
      return {...state, currentShipStationOrderId}
    case RESET_CURRENT_PM_ORDER:
      return {...state, currentPMOrderSku:null}
    case RESET_CURRENT_SHIPSTATION_ORDER:
      return {...state, currentShipStationOrderId:null}
    case RESET_CURRENTS:
      return {...state, currentPMOrderSku:null, currentShipStationOrderId:null}
    default:
    return state
  }
}

const CacheOrdersProvider = ({children}) => {
  const [state, dispatch] = useReducer(cacheOrdersReducer, initialState)
  return (
    <CacheOrdersContext.Provider value={[state, dispatch]}>
      {children}
    </CacheOrdersContext.Provider>
  )
}

export default CacheOrdersProvider
