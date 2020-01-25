import {useState} from 'react'
import { Card, Stack, Button, Spinner } from '@shopify/polaris'
import PMEditingPageNameHeader from '../Atoms/PMEditingPageNameHeader'

const PackageDistributionHeader = ({packages, handleClick}) => {
  const [loading, setLoading] = useState(false)

return (
  <Card subdued sectioned>
    <Stack>
      <Stack.Item fill>
        <PMEditingPageNameHeader title={"Package Distribution"}/>
      </Stack.Item>
      <Stack.Item>
      {
        loading?
        <Spinner accessibilityLabel="Loading... reedit order"/>
        :
        <Button primary
        onClick={()=>{setLoading(true);handleClick(packages)}}>Save and Continue</Button>
      }
      </Stack.Item>
    </Stack>
  </Card>
)
}
export default PackageDistributionHeader
