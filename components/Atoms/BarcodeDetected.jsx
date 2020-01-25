import {useState} from 'react'
import { TextField, Form, FormLayout, Button, Tooltip } from '@shopify/polaris'
import * as PropTypes from 'prop-types'
import {document} from "global/document"
import {ReferralCodeMajorMonotone} from '@shopify/polaris-icons';

const BarCodeDetected = ({onDetect, onError, skuList}) => {
  const [barcodeScan, setBarcodeScan] = useState("")

  const handleSubmit = e => {
    e.preventDefault()

    if(skuList.includes(barcodeScan))
      onDetect(barcodeScan)
    else
      onError(barcodeScan)

    e.target[0].select()
  }

  const formStylee = {
    display: "grid"
  }

  return  <div style={formStylee}>
            <Form noValidate onSubmit={handleSubmit}>
              <span style={{display:"grid", width:"100%", gridTemplateColumns:"1fr auto"}}>
                <Tooltip active content="Focus de Input label and scan the bar code of the romaneos.">
                  <TextField
                    value={barcodeScan}
                    onChange={scan => setBarcodeScan(scan)}
                    autoFocus={true}
                    focused={true}
                    labelHidden={true}
                    placeholder="Bar Code"
                    autoComplete={false}
                  />
                </Tooltip>
                <Tooltip content="Scann">
                  <div style={{color:"#3f4eae"}}>
                    <Button submit monochrome outline icon={ReferralCodeMajorMonotone}></Button>
                  </div>
                </Tooltip>
              </span>
            </Form>
          </div>
}


BarCodeDetected.propTypes = {
  onError: PropTypes.func,
  skuList: PropTypes.array
}

BarCodeDetected.defaultProps = {
  onError: (s)=>null,
  skuList: []
}


export default BarCodeDetected
