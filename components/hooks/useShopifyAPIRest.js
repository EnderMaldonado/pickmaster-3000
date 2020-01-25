import {useEffect, useContext, useState} from 'react'
import axios from 'axios'
import {dateQueryFormat} from './PickmasterTools'

const useShopifyAPIRest = (dateUpdateMin) => {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const fetchData = async () => {
    let lastId = 0
    let auxData = []
    let ordersResponse = []

    try {

      do {
        let response = await axios(`api/orders.json?created_at_min=${dateQueryFormat(dateUpdateMin.start)}&created_at_max=${dateQueryFormat(new Date(dateUpdateMin.end).getTime() + 86400000)}&limit=250&financial_status=paid&fulfillment_status=unfulfilled&since_id=${lastId}`)
      if(response.status===200 && response.statusText==="OK") {
          ordersResponse = response.data.data.orders
          
          if(ordersResponse.length) {
            auxData.push(...ordersResponse)
            lastId = ordersResponse[ordersResponse.length-1].id
          }

        }
        else {
          setError(response)
          ordersResponse = []
        }
        
      } while (ordersResponse.length)

      setData(auxData)
      setLoading(false)

    } catch (err) {
      console.log(err)
      setError(err)
    }
  }

  useEffect(()=>{
    fetchData()
  },[dateUpdateMin])


  return {data, loading, error}
}

export default useShopifyAPIRest
