import { Stack } from '@shopify/polaris'
import IndexHeaderNavItem from '../Atoms/IndexHeaderNavItem'

const IndexHeader = ({navItems, handleClick, value}) =>
  <Stack distribution="fill" wrap={false} spacing="none">
    {
      navItems.map((nav,i) =>
        <IndexHeaderNavItem
          key={i}
          value={value}
          pageName={nav.pageName}
          pageKey={nav.pageKey}
          onClick={handleClick}
        />
      )
    }
  </Stack>

export default IndexHeader
