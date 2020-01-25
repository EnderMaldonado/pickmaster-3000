import {useState, useEffect, useCallback} from 'react'
import { Layout, SkeletonDisplayText, SkeletonBodyText, Toast } from '@shopify/polaris'
import OrderDetailsHeader from '../Organisms/OrderDetailsHeader'
import OrderDetailsProductsList from '../Organisms/OrderDetailsProductsList'
import {SET_ORDER_EDITING_PM_ORDER_PAGE} from '../Context/actions.js'
import ModalConfirm from '../Organisms/ModalConfirm'
import usePickmasterHandles from '../hooks/usePickmasterHandles'
import {getItemsPMAccum} from '../hooks/PickmasterTools.js'

const OrderScannProductsLayer = ({pmOrder}) => {


  const items = pmOrder.orderData.items

  const [productsScaned, setProductsScaned] = useState({})
  const [loadPage, setLoadPage] = useState(false)

  const [activeModal, setActiveModal] = useState(false)

  const {handleGoToPackPmOrder} = usePickmasterHandles()

  const getSkuItems = () => {
    let sku = []
    Object.keys(items).map(key =>sku.push(key))
    return sku
  }

  const handleScaneDetect = skuItem =>{
    let totalScanned = productsScaned[skuItem].isScanned ? productsScaned.totalScanned  : productsScaned.totalScanned + 1
    setProductsScaned(
      {
        ...productsScaned,
        totalScanned,
        [skuItem]:{
          ...productsScaned[skuItem],
          scannedLess:productsScaned[skuItem].scannedLess>=productsScaned[skuItem].quantity?productsScaned[skuItem].quantity:productsScaned[skuItem].scannedLess + 1,
          isScanned:productsScaned[skuItem].scannedLess + 1 >= productsScaned[skuItem].quantity
        }
      }
    )
    if(totalScanned===getItemsPMAccum(items))
      handleClickPack()
  }

  const handleClickPack = () => handleGoToPackPmOrder(pmOrder.pmOrderSku).catch(e => console.log(e))

  useEffect(()=>{
    setLoadPage(false)
    let products = {}
    Object.keys(items).map((key,i) =>{
      products = {...products,
        totalScanned:0,
        [key]:{quantity:items[key].quantity, scannedLess:0, isScanned:false}
      }
    })
    setProductsScaned(products)
    setLoadPage(true)
  },[])

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="SKU Doesn't Match" error onDismiss={toggleActive} duration={1000} />
  ) : null;

  return loadPage?
    <>
      <Layout>
        <Layout.Section>
          <OrderDetailsHeader
            skuList={getSkuItems()}
            onDetect={handleScaneDetect}
            productsScaned={productsScaned}
            handleClickPack={(isReady)=>{if(isReady) handleClickPack() ;else setActiveModal(true);}}
            pmOrder={pmOrder}
            onScannError={toggleActive}
          />
        </Layout.Section>
      </Layout>
      <div style={{height: "15px"}}></div>
      <Layout>
        <OrderDetailsProductsList
        pmOrder={pmOrder}
        productsScaned={productsScaned}/>
      </Layout>
      <ModalConfirm {...{activeModal, setActiveModal}}
        title={"Scann Incomplete"}
        description={"All products weren't scanned. Do you want continue?"}
        handleAction={handleClickPack}/>
      {toastMarkup}
    </>
  :
    <>
      <SkeletonDisplayText size="extraLarge" />
      <SkeletonBodyText />
    </>
}

export default OrderScannProductsLayer
