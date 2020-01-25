import {useContext, useEffect, useState} from 'react'
import { FooterHelp, Link, Frame } from '@shopify/polaris'

import WarningNotifications from '../components/Organisms/WarningNotifications'
import OrdersToSend from '../components/Pages/OrdersToSend'
import PickmasterOrderEditing from '../components/Pages/PickmasterOrderEditing'
import OptionsConfig from '../components/Pages/OptionsConfig'

import {SET_ORDER_PAGE} from '../components/Context/actions.js'
import NavigationContext from '../components/Context/Navigation/NavigationContext'
import usePickmasterHandles from '../components/hooks/usePickmasterHandles'

const Index = () => {

  const [{page}, dispatch] = useContext(NavigationContext)

  const [loadPage, setLoadPage] = useState(false)

  const [refresh, setRefresh] = useState(false)
  const handleRefresh = () => setRefresh(!refresh)

  const {initializeConfig} = usePickmasterHandles()

  const returnPageSelected = () => {
    switch (page) {
      case "OrdersToSend":
        return <OrdersToSend key={refresh+"ots"} {...{handleRefresh}}/>
      case "Options":
         return <OptionsConfig handleChangePage={handleClick}/>
      case "PickmasterOrderEditing":
        return <PickmasterOrderEditing handleChangePage={handleClick}/>
      default:
        return <div>"Error :(</div>
    }
  }

  const handleClick = p => dispatch({type:SET_ORDER_PAGE, page:p})

  useEffect(()=>{
    setLoadPage(false)
    initializeConfig()
    .then(() => setLoadPage(true))
    .catch(err => console.log(err))
    return () => {
      setLoadPage(false)
    }
  },[])

  return loadPage?
    <Frame>
      <WarningNotifications/>
      {returnPageSelected()}
      <FooterHelp>
        Created by{' '}
        <Link external url="https://miamidist.com/">
          Miamidist
        </Link>
      </FooterHelp>
    </Frame>
  :
    <p>Loadin Pickmaster 3000...</p>
}


export default Index
