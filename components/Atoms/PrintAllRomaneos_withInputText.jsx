import React,{useState, useEffect, useContext } from 'react'
import { TextField, Button, Stack, Modal} from '@shopify/polaris'

const PrintAllRomaneos = ({shopifyOrdersList, pmOrdersInProcess, showListSelect, handlePrintRomaneo}) => {

  const [romaneosToPrint, setRomaneosToPrint] = useState(0);
  const [active, setActive] = useState(false)

  const handlePrintRomaneos = async () => {
    setActive(true)
    let currentShowerListLength = showListSelect==="shopify"?
        Object.keys(shopifyOrdersList).length : Object.keys(pmOrdersInProcess).length

    let count = romaneosToPrint > currentShowerListLength ? currentShowerListLength : romaneosToPrint
    let currentShowerList = Object.keys(showListSelect==="shopify"?shopifyOrdersList : pmOrdersInProcess)
    let romaneos = []
    let promises = []
    currentShowerList.some(order => {
      if(count === 0) return true
      promises.push(handlePrintRomaneo(order).then(r=>r))
      count--
    })

    console.log(promises);
    let rom = await Promise.all(promises)
    console.log(rom);
    setActive(false)
  }

  return  <>
  <Stack distribution="trailing">
    <Stack.Item>
      <TextField
        type="number"
        value={romaneosToPrint}
        onChange={v=>setRomaneosToPrint(parseInt(v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'),10))}
        autoComplete={false}
      />
    </Stack.Item>
    <Stack.Item>
      <Button enable={showListSelect==="shopify" || showListSelect==="process"} primary onClick={handlePrintRomaneos}>Print Romaneos</Button>
    </Stack.Item>
  </Stack>
  <Modal sectioned open={active} loading>
  </Modal>
  </>
}

export default PrintAllRomaneos
