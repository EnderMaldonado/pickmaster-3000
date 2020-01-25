import {useCallback, useState, useEffect} from 'react'

import { DataTable, Link, TextStyle } from '@shopify/polaris'
import {getDatePrety} from '../hooks/PickmasterTools'

import parse from "html-react-parser"

import usePickmasterHandles  from '../hooks/usePickmasterHandles'

const HistoryList = ({data}) => {

  const {redirectToPmOrder} = usePickmasterHandles()

  const addColorTextTag = (text, tag, color) => {
    let textResult = text.replace(`<${tag}>`, `<span style="color:${color}">`)
    return textResult.replace(`</${tag}>`, `</span>`)
  }

  const searchTags = text => {
    let textReturn = text
    if(text.includes("created"))
      textReturn = addColorTextTag(textReturn, "created", "#00848e")
      if(text.includes("redone"))
      textReturn = addColorTextTag(textReturn, "redone", "#af0f00")
      if(text.includes("cancel"))
      textReturn = addColorTextTag(textReturn, "cancel", "#af0f00")
      if(text.includes("finalized"))
      textReturn = addColorTextTag(textReturn, "finalized", "#265fff")
      if(text.includes("cmry"))
      textReturn = addColorTextTag(textReturn, "cmry", "#e89000")
      if(text.includes("mkrR"))
      textReturn = addColorTextTag(textReturn, "mkrR", "#561")
    return textReturn
  }

  const getDataFormat = () => {
    let array = []
      Object.keys(data).forEach((key,i)=>{
        if(data[key].timeLineDate){
          let {textTimeline, pmOrderNumber, pmOrderSku, timeLineDate} = data[key]

          let text = searchTags(textTimeline)

          if(text.includes("<pmOrderNumber>")){
            let textB = text.substring(0, text.indexOf("<pmOrderNumber>"))
            let textA = text.substring(text.indexOf("<pmOrderNumber>")+"<pmOrderNumber>".length, text.length)

            array.push([
              <span key={Date.parse(timeLineDate)}>{getDatePrety(timeLineDate)}</span>,
              <span key={i}>{parse(textB)}<Link onClick={()=>redirectToPmOrder(pmOrderSku)}>{pmOrderNumber}</Link>{parse(textA)}</span>
            ])
          }else {
            array.push([
              <span key={Date.parse(timeLineDate)}>{getDatePrety(timeLineDate)}</span>,
              parse(text)
            ])
          }
        }
      })
    return array
  }

  const [sortedRows, setSortedRows] = useState(null);
  const rows = sortedRows ? sortedRows : getDataFormat().reverse();

  const handleSort = (index, direction) => setSortedRows(sortCurrency(rows, index, direction))

  const sortCurrency = (rows, index, direction) => {
    return [...rows].sort((rowA, rowB) => {
      let amountA = rowA[index].key
      let amountB = rowB[index].key
      return direction === 'descending' ? amountB >= amountA?1:-1 : amountA >= amountB?1:-1
    })
  }

  useEffect(()=>{},[data])

  return (
        <DataTable
          columnContentTypes={['text', 'text']}
          headings={['Date', 'Comentary']}
          rows={rows}
          sortable={[true, false]}
          initialSortColumnIndex={0}
          onSort={handleSort}
          defaultSortDirection={"descending"}
        />
  )

}

export default HistoryList
