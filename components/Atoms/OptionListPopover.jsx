import {useState} from 'react'
import { Button, Popover, OptionList } from '@shopify/polaris'

const OptionListPopover = ({title, selected, onChange, options, onlyOne}) => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = () => setPopoverActive(!popoverActive)

  const activator = <Button fullWidth={!onlyOne} onClick={togglePopoverActive} disclosure> {!onlyOne?title:selected[0]?selected[0].substring(selected[0].lastIndexOf("|")+1, selected[0].length):title} </Button>

  return (
    <Popover active={popoverActive} activator={activator} onClose={togglePopoverActive}>
    {
      options?
      Object.keys(options).map((carrierCode, i) => <OptionList key={i} title={options[carrierCode].name}
        onChange={onChange}
        options={Object.keys(options[carrierCode]["services"]).map((serviceCode,i)=>{
          return {value:`${carrierCode}|${options[carrierCode].name}|-|${serviceCode}|${options[carrierCode]["services"][serviceCode].name}`,
                  label:options[carrierCode]["services"][serviceCode].name}
        })}
       selected={selected} allowMultiple={!onlyOne} />)
       :
       null
    }
    </Popover>
  )
}

export default OptionListPopover
