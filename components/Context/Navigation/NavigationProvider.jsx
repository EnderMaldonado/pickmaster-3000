import React,{useReducer} from 'react'
import NavigationContext from './NavigationContext'
import {SET_ORDER_PAGE, RESET_ORDER_PAGE, SET_ORDER_EDITING_PM_ORDER_PAGE} from '../actions'

const initialState = {
  page:"OrdersToSend",
  editingPMOrderPage:"ItemsInformation"
}

const navigationReducer = (state, {type, page, editingPMOrderPage}) => {
  switch (type) {
    case SET_ORDER_PAGE:
      return {...state, page}
    case SET_ORDER_EDITING_PM_ORDER_PAGE:
      return {...state, page:"PickmasterOrderEditing", editingPMOrderPage}
    case RESET_ORDER_PAGE:
      return {...state, page:"OrdersToSend", editingPMOrderPage:"ItemsInformation"}
    default:
      return state
  }
}

const NavigationProvider = ({children}) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState)
  return (
    <NavigationContext.Provider value={[state, dispatch]}>
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider
