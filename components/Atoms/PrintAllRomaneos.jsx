import React,{useState } from 'react'
import { Button,  Modal, Tooltip} from '@shopify/polaris'
import {LabelPrinterMajorMonotone} from '@shopify/polaris-icons'

const PrintAllRomaneos = ({showListSelect, currentListSelectedToPrint, updateListPrinted,
  handlePrintRomaneo, handleCleanPrintedList, handlePrintIframe}) => {

  const [active, setActive] = useState(false)

  const handlePrintRomaneos = async () => {
    setActive(true)
    let promises = []
    let romaneosToPrint = []
    if(currentListSelectedToPrint)
      romaneosToPrint = Object.keys(currentListSelectedToPrint).filter((key,i) => {
        if(currentListSelectedToPrint[key])
          return key
      })
    romaneosToPrint.forEach(order =>       
      promises.push(handlePrintRomaneo(order).then(r=>r))
    )
    Promise.all(promises).then(r=>{
      handlePrintIframe()
      if(showListSelect===0)
        updateListPrinted(r)
      setActive(false)
      handleCleanPrintedList()
    })
  }


  return  <>
    <Tooltip content="Print Romaneos Selected">
      <Button size="large" fullWidth icon={LabelPrinterMajorMonotone} color="white" enable={showListSelect===0 || showListSelect===1} primary onClick={handlePrintRomaneos}>
        &nbsp;P R I N T
      </Button>
    </Tooltip>
    <Modal sectioned open={active} loading>
    </Modal>
  </>
}

export default PrintAllRomaneos
