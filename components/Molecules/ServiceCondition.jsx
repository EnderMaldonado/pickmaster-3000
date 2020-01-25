import {useState} from 'react'
import { Card, Stack, TextField, Button } from '@shopify/polaris'
import OptionListPopover from '../Atoms/OptionListPopover'
import {CancelSmallMinor} from '@shopify/polaris-icons';

const ServiceCondition = ({conditionsServiceOptionsCache, setConditionsServiceOptionsCache, options,
  index, deleteServicesOption}) => {

  const handleSelectPropertyValue = value => {
    setConditionsServiceOptionsCache({
      ...conditionsServiceOptionsCache,
      [index]:{options:conditionsServiceOptionsCache[index].options, service:value[0]}
    })
  }

  const handleChangePropertyValue = value => {
    let optionValue = value.replace("\n",",").replace("\r",",")
    setConditionsServiceOptionsCache({
      ...conditionsServiceOptionsCache,
      [index]:{options:optionValue, service:conditionsServiceOptionsCache[index].service}
    })
  }

  return (
    <Card sectioned>
      <Stack alignment="trailing">
        <Stack.Item fill>
          <TextField label="Countries Code" placeholder="US, ES, BR, PR..."
            value={conditionsServiceOptionsCache[index].options}
            onChange={handleChangePropertyValue}
            multiline/>
        </Stack.Item>
        <Stack.Item>
        <OptionListPopover
          title={"Service"}
          selected={conditionsServiceOptionsCache?[conditionsServiceOptionsCache[index].service]: []}
          onChange={handleSelectPropertyValue}
          options={options}
          onlyOne={true}
          />
        </Stack.Item>
        <Stack.Item>
          <div style={{color: '#bf0711', height:"6rem"}}>
            <Button plain monochrome icon={CancelSmallMinor} onClick={()=> deleteServicesOption(index)} ></Button>
          </div>
        </Stack.Item>
      </Stack>
    </Card>
  )
}

export default ServiceCondition

