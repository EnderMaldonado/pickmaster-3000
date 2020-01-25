import {useState, useRef, useCallback} from 'react'
import { Stack, DisplayText, Spinner, Button, TextContainer,Tooltip,Modal,
        Card, Icon, TextStyle } from '@shopify/polaris'
import BadgeStatus from '../Atoms/BadgeStatus'
import DataOrderShipstationLabel from '../Organisms/DataOrderShipstationLabel'
import DataOrderShipstationLabelEdit from '../Organisms/DataOrderShipstationLabelEdit'
import {getDatePrety} from '../hooks/PickmasterTools'
import { RepeatOrderMajorMonotone, CircleCancelMajorMonotone, LabelPrinterMajorMonotone, CircleAlertMajorMonotone, ImportMinor, TransportMajorMonotone} from '@shopify/polaris-icons';

const DataOrderShipstation = ({status, createdAt,pmSsOrderId, ssOrderNumber, pmSsOrder,
  label, setLabel, canProcess, labelData,
    handleChangeLabelSimpleValue,
    handleChangeLabelItemsValue,
    handleChangeLabelSizeValue,
    handleChangeLabelServiceValue,
    handleChangeLabelShippingAddressValue,
    handleChangeLabelBillingAddressValue, handleAddCustomProduct,
    setCanProcess, handleHistory, handleProcess, handleRemake, handleCancel, handleDownloadSsLabel
  }) => {

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const conditionsStatus = {
    "Packed":"attention",
    "Processed":"success",
    "Cancelled":"warning",
    "Remake":"warning"
  }

  const handleProcessLabel = () => {
    setLoading(true)
    setErrorMessage("")
    handleProcess(label)
      .then(()=>{
        setLoading(false)
        handleChange()
      })
      .catch(erM => {
        setLoading(false)
        setErrorMessage(erM)
      })
  }

  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);


  const getActions = () => {
    if(loading)
      return [<Spinner key={label.pmSsOrderId+"Spinner"} accessibilityLabel="Loading... label"/>]

    let actions = []

    if(status==="Processed") {
      // actions.push(
        // <Tooltip key={label.pmSsOrderId+"Download"} content="Download the Label">
        //   <div style={{color:"#00848e"}}>
        //     <Button id={`download-${pmSsOrderId}`} plain monochrome={true} icon={ImportMinor}
        //     onClick={()=>{setLoading(true);handleDownloadSsLabel(label).then(()=>{handleChange();setLoading(false)})}}></Button>
        //   </div>
        // </Tooltip>
        //   )
      actions.push(
        <Tooltip key={label.pmSsOrderId+"Print"} content="Print the Label">
          <div style={{color:"#00848e"}}>
            <Button plain monochrome={true} icon={LabelPrinterMajorMonotone}
            onClick={handleChange}></Button>
          </div>
        </Tooltip>
          )
    }

    if(status==="Processed" || status==="Cancelled" || status==="Remake")
    actions.push(
        <Tooltip key={label.pmSsOrderId+"Remake"} content={status==="Cancelled"?"Make Another Label like it":"Cancel the Label and Make Another like it"}>
          <div style={{color:"#b02b13"}}>
            <Button  plain monochrome icon={RepeatOrderMajorMonotone}
              onClick={()=>handleRemake(pmSsOrderId)}></Button>
          </div>
        </Tooltip>)

    if(status==="Processed")
      actions.push(
        <Tooltip key={label.pmSsOrderId+"Cancel"} content="Cancel the Label">
          <div style={{color:"#bf0711"}}>
            <Button size="large"
            outline monochrome={true} icon={CircleCancelMajorMonotone}
            onClick={()=>{setLoading(true);handleCancel(pmSsOrderId).then(()=>setLoading(false))}}></Button>
          </div>
        </Tooltip>)

    if(status==="Packed")
      actions.push(
        <Tooltip key={label.pmSsOrderId+"Process"} content="Process The Label">
          <div style={{color:"#6371c7"}}>
            <Button size="large" outline monochrome={true} icon={TransportMajorMonotone}
            onClick={()=>handleProcessLabel()}></Button>
          </div>
        </Tooltip>)

    return actions
  }

  const title = <Stack alignment="center">
    <Stack.Item>
      <DisplayText size="small">Shipstation Order <b>{ssOrderNumber}</b></DisplayText>
    </Stack.Item>
    <Stack.Item>
      <span> created at {getDatePrety(createdAt)}</span>
    </Stack.Item>
    <Stack.Item>
      <BadgeStatus status={status} conditions={conditionsStatus}/>
    </Stack.Item>
  </Stack>

  return <>
    <Card>
      <Card.Header title={title}>
      {getActions()}
      </Card.Header>
      <Card.Section sectioned subdued>
        {
          errorMessage?
            <Card sectioned>
              <div style={{display:"grid", gridTemplateColumns:"max-content max-content"}}>
                <Icon source={CircleAlertMajorMonotone} color="redDark"/>
                <TextContainer>
                  <TextStyle variation="negative">&nbsp;&nbsp;{errorMessage}</TextStyle>
                </TextContainer>
              </div>
            </Card>:null
        }
        {
          status!=="Packed"?
          <DataOrderShipstationLabel {...{...label}}/>
          :
          <DataOrderShipstationLabelEdit
          {...{...label,label, setLabel, canProcess,
              handleChangeLabelSimpleValue,
              handleChangeLabelItemsValue,
              handleChangeLabelSizeValue,
              handleChangeLabelServiceValue,
              handleChangeLabelShippingAddressValue,
              handleChangeLabelBillingAddressValue,
              handleProcessLabel,loading,
              handleAddCustomProduct,
              setCanProcess}}/>
        }
      </Card.Section>
    </Card>
    <Modal
      open={active}
      onClose={handleChange}
      large
      title="Reach more shoppers with Instagram product tags"
    >
      <iframe style={{height:"60rem"}} width='100%' height='100%' src={`data:application/pdf;base64, ${encodeURI(labelData)} `}>
      </iframe>
    </Modal>
  </>

}

export default DataOrderShipstation