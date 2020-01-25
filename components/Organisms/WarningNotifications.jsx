import {useState, useContext} from 'react'
import BellNotifications from '../Molecules/BellNotifications'
import useFirebaseGet from '../hooks/useFirebaseGet'
import usePickmasterHandles from '../hooks/usePickmasterHandles'
import CacheOrdersContext from '../Context/CacheOrders/CacheOrdersContext'

const WarningNotifications = () => {

    const [pmOrdersWarning, setPmOrdersWarning] = useState(null)

    const [{currentPMOrderSku}] = useContext(CacheOrdersContext)
    const {setCurrentPmOrderEdit, navigatePmOrderEditTo} = usePickmasterHandles()

    useFirebaseGet([{
        request:'PMOrdersWarning',
        handleResponse: data => {
          let result = null
          Object.keys(data).forEach(k => {
            if(data[k].warningMessage)
              result = {...result, [k]:data[k]}
          })
          setPmOrdersWarning(result)
        },
        handleError: error => console.log(error)
      }
    ])

    const handleClickPmOrder = pmOrderSku => {
      if(currentPMOrderSku!==pmOrderSku)
        setCurrentPmOrderEdit(pmOrderSku)
      navigatePmOrderEditTo("OrderDetails") 
    }

    return pmOrdersWarning?<BellNotifications {...{handleClickPmOrder, pmOrdersWarning}}/>:null

}

export default WarningNotifications