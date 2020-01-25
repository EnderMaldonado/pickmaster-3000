import { useState, useEffect} from 'react'
import { Layout, Card, Button } from '@shopify/polaris'

import PackageProducts from '../Organisms/PackageProducts'
import PackageDistributionHeader from '../Molecules/PackageDistributionHeader'
import {getItemsPMAccum} from '../hooks/PickmasterTools.js'
import usePickmasterHandles from '../hooks/usePickmasterHandles'
import {AddMajorMonotone} from '@shopify/polaris-icons';
const PackageDistributionLayer = ({pmOrder}) => {

  const [packages, setPackages] = useState(null)
  const [packagesQuantity, setPackagesQuantity] = useState(1)
  const [update, setUpdate] = useState(true)

  const [loadPage, setLoadPage] = useState(false)

  const {handleCreate_GoToPMOrderShipstationOrdersProcess} = usePickmasterHandles()

  const handleClickActionList = async (packageSender, direction, quantityInPackage, quantityToSend, sku) => {
    let auxPackages = [], packageToSend = packageSender + direction
    if(direction>0 && packagesQuantity <= packageSender+1)
      auxPackages = await addPackage()
    else
      auxPackages = packages

    auxPackages[packageToSend]={
      ...auxPackages[packageToSend],
      [sku]:{quantityInPackage:auxPackages[packageToSend][sku].quantityInPackage + quantityToSend},
      packageItemsTotalQuantity:auxPackages[packageToSend].packageItemsTotalQuantity + quantityToSend
    }
    auxPackages[packageSender]={
      ...auxPackages[packageSender],
      [sku]:{quantityInPackage:quantityInPackage - quantityToSend},
      packageItemsTotalQuantity:auxPackages[packageSender].packageItemsTotalQuantity - quantityToSend
    }
    if(direction<0 && auxPackages[packageSender].packageItemsTotalQuantity === 0 && packagesQuantity === packageSender+1)
      auxPackages = await deletePackage(packageSender)
    setPackages(...[auxPackages])
    setUpdate(!update)
  }

  const addPackage = () => new Promise((resolve,rreject) => {
    console.log("add");
    let items = {}
    Object.keys(pmOrder.orderData.items).forEach((key,i) => {
      items = {
        ...items,
        [key]:{quantityInPackage:0}
      }
    })
    setPackagesQuantity(packagesQuantity+1)
    resolve([
      ...packages,
      {
        ...items,
        packageItemsTotalQuantity:0
      }
    ])
  })

  const deletePackage = (packageIndex) => new Promise((resolve, reject) => {
    let totalQuantity = 0
    let items = {}
    Object.keys(pmOrder.orderData.items).forEach((key,i) => {
      items = {
        ...items,
        [key]:{quantityInPackage:packages[0][key].quantityInPackage + packages[packageIndex][key].quantityInPackage}
      }
      totalQuantity += (packages[0][key].quantityInPackage + packages[packageIndex][key].quantityInPackage)
    })
    let auxPackages = packages
    auxPackages[0] = {...items, packageItemsTotalQuantity:totalQuantity}
    setPackagesQuantity(packagesQuantity-1)
    resolve(auxPackages.filter((v,i) => i!==packageIndex))
  })

  const handleCreateShipstationOrder = packages => {
    handleCreate_GoToPMOrderShipstationOrdersProcess(pmOrder, packages)
  }


  useEffect(()=>{
    setLoadPage(false)
    let pack1 = {}
    Object.keys(pmOrder.orderData.items).forEach((key,i) => {
      pack1 = {
        ...pack1,
        [key]:{quantityInPackage:pmOrder.orderData.items[key].quantity}
      }
    })
    pack1 = {...pack1, packageItemsTotalQuantity:getItemsPMAccum(pmOrder.orderData.items)}
    setPackages([pack1])
    if(pack1.packageItemsTotalQuantity===1)
      handleCreateShipstationOrder([pack1])
    else
      setLoadPage(true)
  },[])

  return loadPage?
    <>
      <Layout>
        <Layout.Section>
          <PackageDistributionHeader packages={packages} handleClick={handleCreateShipstationOrder}/>
        </Layout.Section>
      </Layout>
      <div style={{height: "15px"}}></div>
      <Layout>
        {
          packages.map((pack,i) => {
            return <Layout.Section oneHalf
              key={i}>
                  <PackageProducts
                  pmOrderData={pmOrder.orderData}
                  pack={pack}
                  packIndex={i}
                  packages={packages}
                  handleClickActionList={handleClickActionList}
                  />
              </Layout.Section>
          })
        }
      </Layout>
    </>
  :
  <p>Load Package Distribution . . .</p>
}

export default PackageDistributionLayer
