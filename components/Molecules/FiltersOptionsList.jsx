import {useState, useEffect} from 'react'
import { Checkbox, RadioButton, Stack } from '@shopify/polaris'

const FiltersOptionsList = ({onChange, choices, name, defaultValue}) =>  {

  const [s, setS] = useState(defaultValue?[defaultValue]:[])

  useEffect(()=>{
    onChange(s)
  },[s])

  const handleChangeRadiobutton = (value, id) => setS(id.substr(0, id.indexOf(name)))

  return <>
    <div style={{width:"100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(1.6rem, min-content))", 
      gridTemplateRows: "1fr", justifyContent: "space-evenly"}}>
      {
        choices.map((c,i) =>
            <RadioButton
              key={i+name}
              id={c["value"]+name}
              label={c["label"]}
              checked={s.includes(c["value"])}
              onChange={handleChangeRadiobutton}
              name={name}
            />
        )
      }
    </div>
  </>
}

export default FiltersOptionsList
