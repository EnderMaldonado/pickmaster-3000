import {useContext, useEffect} from 'react'
import { DisplayText, Button, Layout, Card } from '@shopify/polaris'
import ServiceConditionDefault from '../Molecules/ServiceConditionDefault'
import ServiceCondition from '../Molecules/ServiceCondition'
import ConfigsContext from '../Context/Configs/ConfigsContext'
import {getServicesListFormat} from '../hooks/PickmasterTools'
import {AddCodeMajorMonotone} from '@shopify/polaris-icons';

const ConditionsServiceOptions = ({conditionsServiceOptionsCache, setConditionsServiceOptionsCache, 
  addServicesOption, deleteServicesOption}) => {

  const [{shippingServices}] = useContext(ConfigsContext)
  const options = getServicesListFormat(shippingServices)
  
  return (
    <>
      <DisplayText size="small">Conditions for Service Options</DisplayText>
      <ServiceConditionDefault
        options={options}
        conditionsServiceOptionsCache={conditionsServiceOptionsCache} 
        setConditionsServiceOptionsCache={setConditionsServiceOptionsCache}/>
      <Layout>
        <Layout.AnnotatedSection
          title="Custom Options"
          description="Shipping service default selected for some countries code."> 
          <Card sectioned subdued>
            {
              conditionsServiceOptionsCache? Object.keys(conditionsServiceOptionsCache).map((key,i) => {
                if(key !== "conditionsServiceOptionsDefault")
                  return <ServiceCondition key={i} {...{options, conditionsServiceOptionsCache, 
                    setConditionsServiceOptionsCache, deleteServicesOption}} index={key}/>
                else
                  return null
              })
              : null
            }
            <div style={{height:"1.6rem"}}></div>
            <Button icon={AddCodeMajorMonotone} fullWidth onClick={addServicesOption} /> 
            <div style={{height:"2rem"}}></div>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </>
  )
}

export default ConditionsServiceOptions
