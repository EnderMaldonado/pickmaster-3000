import { Card, Stack, Button, DisplayText, Icon } from '@shopify/polaris'
import BadgeStatus from '../Atoms/BadgeStatus'
import PMEditingPageNameHeader from '../Atoms/PMEditingPageNameHeader'

const LabelEditorHeader = ({handlePaginationPrevious, ssOrderNumber, status, handleSaveLabel, canProcess,
  handleProcess}) => {

  const paginationBack = <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
  <path d={"M17 9H5.414l3.293-3.293a.999.999 0 1 0-1.414-1.414l-5 5a.999.999 0 0 0 0 1.414l5 5a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L5.414 11H17a1 1 0 1 0 0-2"} fillRule="evenodd">
  </path>
  </svg>

  const conditionsStatus = {
    "Packed":"attention",
    "Edited":"info",
    "Processed":"success",
    "Cancelled":"warning"
  }

return (
  <Card subdued sectioned>
    <Stack>
      <Stack.Item fill>
        <Stack>
          <Stack.Item>
            <Button onClick={handlePaginationPrevious} plain={true}><Icon source={paginationBack}/></Button>
          </Stack.Item>
          <Stack.Item>
            <PMEditingPageNameHeader title={"Editing Shipstation Order"}/>
          </Stack.Item>
          <Stack.Item>
            <DisplayText size="large">{ssOrderNumber}</DisplayText>
          </Stack.Item>
          <Stack.Item>
            <BadgeStatus status={status} conditions={conditionsStatus}/>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <Button onClick={handleSaveLabel}>Save</Button>
      </Stack.Item>
      <Stack.Item>
        <Button primary disabled={!canProcess} onClick={handleProcess}>Save and Process</Button>
      </Stack.Item>
    </Stack>
  </Card>
)
}
export default LabelEditorHeader
