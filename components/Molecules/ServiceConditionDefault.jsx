import {useState} from 'react'
import { Layout, Card, Stack } from '@shopify/polaris'
import OptionListPopover from '../Atoms/OptionListPopover'

const ServiceConditionDefault = ({conditionsServiceOptionsCache, setConditionsServiceOptionsCache, options}) => {

  const handleSelectPropertyValue = values => {
    //Set values in lists...
    setConditionsServiceOptionsCache({
      ...conditionsServiceOptionsCache,
      conditionsServiceOptionsDefault:values
    })
  }

  return (
    <Layout>
      <Layout.AnnotatedSection
        title="Default Options"
        description="Shipping services available for all orders from all countries."
      >
        <Card sectioned>
          <OptionListPopover
            title={"Services"}
            selected={conditionsServiceOptionsCache&&conditionsServiceOptionsCache.conditionsServiceOptionsDefault?conditionsServiceOptionsCache.conditionsServiceOptionsDefault: []}
            onChange={handleSelectPropertyValue}
            options={options}
            />
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  )
}

export default ServiceConditionDefault
