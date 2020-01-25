import React,{useReducer} from 'react'
import RomaneosContext from './RomaneosContext'
import {ADD_ROMANEO_TO_LIST_PRINT, CLEAN_ROMANEO_LIST} from '../actions'

const initialState = {
  romaneosPMOrdersData:null
}

const romaneosReducer = (state, {type, romaneoOrderData}) => {
  switch (type) {
    case ADD_ROMANEO_TO_LIST_PRINT:
      return  {
        ...state,
        romaneosPMOrdersData:{...state.romaneosPMOrdersData, [romaneoOrderData.orderSku]:{...romaneoOrderData}},
      }
    case CLEAN_ROMANEO_LIST:
      return {...state, romaneosPMOrdersData:null}
    default:
      return state
  }
}

const RomaneosProvider = ({children}) => {
  const [state, dispatch] = useReducer(romaneosReducer, initialState)
  return (
    <RomaneosContext.Provider value={[state, dispatch]}>
      {children}
    </RomaneosContext.Provider>
  )
}

export default RomaneosProvider
