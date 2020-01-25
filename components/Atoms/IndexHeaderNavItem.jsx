import { Button, Stack } from '@shopify/polaris'

const IndexHeaderNavItem = ({pageKey, pageName, onClick, value}) => {
  return <Stack.Item><Button onClick={()=>onClick(pageKey)} fullWidth monochrome={true} disabled={value===pageKey}>
  {pageName}</Button></Stack.Item>
}

export default IndexHeaderNavItem
