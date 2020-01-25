import ConditionsServiceOptions from '../Organisms/ConditionsServiceOptions'
import EditTagLocation from '../Organisms/EditTagLocation'

const OptionsConfigLayer = ({conditionsServiceOptionsCache, setConditionsServiceOptionsCache, 
  tagLocationCache, setTagLocationCache, addServicesOption, deleteServicesOption}) => <>
    <ConditionsServiceOptions {...{conditionsServiceOptionsCache, setConditionsServiceOptionsCache, 
      addServicesOption, deleteServicesOption}}/>
    <EditTagLocation {...{tagLocationCache, setTagLocationCache}}/>
  </>

export default OptionsConfigLayer
