import React from 'react'
import {useContext, useEffect} from 'react'
import { useQuery } from '@apollo/react-hooks';
import {GET_ORDERS} from '../Context/graphql_querys.js'
import {SAVE_QUERY_ORDERS, SET_QUERY_STATUS_ERROR} from '../Context/actions.js'
import OrdersContext from '../Context/Orders/OrdersContext'
import ConfigsContext from '../Context/Configs/ConfigsContext'

const QueryOrders = () => {
  const [{_update}, dispatch] = useContext(OrdersContext)
  const { data, loading, error } = useQuery(GET_ORDERS)
  const [{tagLocation}] = useContext(ConfigsContext)

  useEffect(()=>{
    if (error)
      dispatch({type:SET_QUERY_STATUS_ERROR, _errorMessage:error})

    if(data && _update && !loading){
      dispatch({
        type:SAVE_QUERY_ORDERS,
        data,
        locationConfig:tagLocation?tagLocation:""
      })
    }
  },[error, data , _update, loading])  

  return null
}

export default QueryOrders
