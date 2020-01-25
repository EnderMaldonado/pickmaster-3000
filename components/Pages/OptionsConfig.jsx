import {useState, useContext, useEffect} from 'react'
import { Page } from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'
import OptionsConfigLayer from '../Templates/OptionsConfigLayer'
import SkeletonPageArmed from '../Templates/SkeletonPageArmed'
import {UPDATE_CONFIG_OPTIONS_SERVICES, UPDATE_CONFIG_OPTIONS_TAGLOCATION} from '../Context/actions.js'
import useFirebaseGet from '../hooks/useFirebaseGet'
import usePickmasterHandles from '../hooks/usePickmasterHandles.js'
import ConfigsContext from '../Context/Configs/ConfigsContext'
import {getConditionsServoceOptionsToArray} from '../hooks/PickmasterTools'

const OptionsConfig = ({handleChangePage}) => {

  const {saveOptions} = usePickmasterHandles()
  const [{}, dispatchConfig] = useContext(ConfigsContext)
  
  const [conditionsServiceOptionsCache, setConditionsServiceOptionsCache] = useState(null)
  const [tagLocationCache, setTagLocationCache] = useState(null)

  const [loadServices, setLoadServices] = useState(false)
  const [loadLocation, setLoadLocation] = useState(false)
  
  useFirebaseGet([
    {
      request:"config/conditionsServiceOptions",
      handleResponse: data => {
        if(data){
          let dataResult = getConditionsServoceOptionsToArray(data)
          setConditionsServiceOptionsCache(dataResult)
          dispatchConfig({type:UPDATE_CONFIG_OPTIONS_SERVICES, conditionsServiceOptions:dataResult})
        }
        setLoadServices(true)
      },
      handleError: error => console.log(error)
    },
    {
      request:"config/tagLocation",
      handleResponse: data => {
        if(data){
          setTagLocationCache(data)
          dispatchConfig({type:UPDATE_CONFIG_OPTIONS_TAGLOCATION, tagLocation:data})
        }
        setLoadLocation(true)
      },
      handleError: error => console.log(error)
    },
  ], refresh)

  const [refresh, setRefresh] = useState(false)

  const handleSaveOptions = () => {
    setLoadServices(false)
    setLoadLocation(false)

    let conditionsServiceOptionsAux = conditionsServiceOptionsCache

    if(conditionsServiceOptionsAux){
      conditionsServiceOptionsAux = checkVoids(conditionsServiceOptionsAux)
      setConditionsServiceOptionsCache(conditionsServiceOptionsAux)
      if(conditionsServiceOptionsAux["conditionsServiceOptionsDefault"] && conditionsServiceOptionsAux["conditionsServiceOptionsDefault"].length)
        conditionsServiceOptionsAux["conditionsServiceOptionsDefault"] = conditionsServiceOptionsAux["conditionsServiceOptionsDefault"].join(",")
    }

    saveOptions({
      conditionsServiceOptions:conditionsServiceOptionsAux,
      tagLocation:tagLocationCache
    })
      .then(()=>{
        setConditionsServiceOptionsCache(getConditionsServoceOptionsToArray(conditionsServiceOptionsAux))
        setRefresh(!refresh)
        setLoadServices(true)
        setLoadLocation(true)
    })
  }

  const addServicesOption = () => {
    let length = 0 
    if(conditionsServiceOptionsCache)
      Object.keys(conditionsServiceOptionsCache).forEach((c) => {
        length += c!=="conditionsServiceOptionsDefault"?1:0
      })
    setConditionsServiceOptionsCache({
      ...conditionsServiceOptionsCache,
      [`conditionsServiceOptions-${length}`]:{options:"", service:""}
    })
  }

  const checkVoids = conditionsServiceOptionsAux => {
    Object.keys(conditionsServiceOptionsAux).forEach(c => {
      if(conditionsServiceOptionsAux[c] &&
        c !== "conditionsServiceOptionsDefault" &&
        (conditionsServiceOptionsAux[c].options.length === 0 ||
        conditionsServiceOptionsAux[c].service.length === 0)){
        conditionsServiceOptionsAux = deleteOption(conditionsServiceOptionsAux, c)
        conditionsServiceOptionsAux = checkVoids(conditionsServiceOptionsAux)
      }
    })
    return conditionsServiceOptionsAux
  }

  const deleteOption = (conditionsServiceOptionsCache, index) => {
    let conditionsServiceOptionsCacheAux = {...conditionsServiceOptionsCache}
    delete conditionsServiceOptionsCacheAux[index]
    let conditionsServiceOptionsCacheResult = {}, count = 0

    if(conditionsServiceOptionsCacheAux.conditionsServiceOptionsDefault)
      conditionsServiceOptionsCacheResult = {conditionsServiceOptionsDefault:conditionsServiceOptionsCacheAux.conditionsServiceOptionsDefault}
    Object.keys(conditionsServiceOptionsCacheAux).forEach(c => {
      if(c!=="conditionsServiceOptionsDefault") {
        conditionsServiceOptionsCacheResult = {
          ...conditionsServiceOptionsCacheResult,
          [`conditionsServiceOptions-${count}`]:conditionsServiceOptionsCacheAux[c]
        }
        count++
      }
    })

    return conditionsServiceOptionsCacheResult
  }

  const deleteServicesOption = index => setConditionsServiceOptionsCache(deleteOption(conditionsServiceOptionsCache, index))

  return (
    <Page separator title="Options" primaryAction={loadServices && loadLocation ?{content: 'Save', onAction:handleSaveOptions}:null}
    breadcrumbs={[{content: 'Pickmaster Orders', onAction:()=>handleChangePage("OrdersToSend")}]}
    >
      <TitleBar title="Options" />
        {
          loadServices && loadLocation?
            <OptionsConfigLayer
              {...{conditionsServiceOptionsCache, setConditionsServiceOptionsCache, 
                  tagLocationCache, setTagLocationCache, addServicesOption, deleteServicesOption}}
            />
          :
            <SkeletonPageArmed/>
        }
    </Page>
  )
}

export default OptionsConfig
