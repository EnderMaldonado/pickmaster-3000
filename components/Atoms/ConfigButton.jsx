import { Button, Icon, Tooltip} from '@shopify/polaris'
import {SettingsMajorMonotone} from '@shopify/polaris-icons'

const ConfigButton = ({onClick}) => <Tooltip content="Options">
  <Button onClick={onClick} icon={SettingsMajorMonotone}></Button>
</Tooltip>

export default ConfigButton
