import {useState, useCallback} from 'react'
import { Button, Tooltip, TextField, Form, ActionList, Popover, Icon} from '@shopify/polaris'
import {CapturePaymentMinor, EditMinor} from '@shopify/polaris-icons'

const SetNumberRecords = ({dataQuantity, handleChangeDataUpdateQuantity}) => {

  const [customNumber, setCustomNumber] = useState("")

  const handleSelectActionList = value => {
    setPopoverActive(false)
    handleChangeDataUpdateQuantity(value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    setPopoverActive(false)
    handleChangeDataUpdateQuantity(customNumber>1000?1000:customNumber)
  }

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const activator = <Tooltip content="Number of records to display">
      <Button disclosure onClick={togglePopoverActive}>{dataQuantity}</Button>
    </Tooltip>

      return (               
      <Popover
        active={popoverActive}
        activator={activator}
        onClose={togglePopoverActive}
      >
        <Popover.Pane>
          <ActionList
            items={[
              {icon:CapturePaymentMinor, content: '10', onAction:()=>handleSelectActionList(10)},
              {icon:CapturePaymentMinor, content: '20', onAction:()=>handleSelectActionList(20)},
              {icon:CapturePaymentMinor, content: '30', onAction:()=>handleSelectActionList(30)},
              {icon:CapturePaymentMinor, content: '50', onAction:()=>handleSelectActionList(50)},
              {icon:CapturePaymentMinor, content: '100', onAction:()=>handleSelectActionList(100)}
            ]}
          />
        </Popover.Pane>
        <Popover.Pane fixed>
          <div style={{maxWidth:"12rem"}}>
            <Form onSubmit={handleSubmit} implicitSubmit autoComplete={false}>
              <TextField prefix={<Icon source={EditMinor}/>} type="number" value={customNumber} onChange={setCustomNumber}/>
              <div style={{display:"none"}}><Button submit></Button></div>
            </Form>
          </div>
        </Popover.Pane>
      </Popover>
  );
}

export default SetNumberRecords