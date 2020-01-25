import { Badge } from '@shopify/polaris'
const BadgeStatus = ({status, conditions}) =>
  <Badge status={conditions[status]}>{status}</Badge>

export default BadgeStatus
