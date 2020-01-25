import React,{useState, useEffect, useCallback, useContext } from 'react'
import { DataTable, Checkbox, Card, SkeletonBodyText, Link, Button, TextStyle, DisplayText, Tooltip } from '@shopify/polaris'

import OrderStatusToList from '../Molecules/OrderStatusToList'
import ButtonPrintRomaneo from '../Atoms/ButtonPrintRomaneo'
import CheckboxSelectOrderToPrint from '../Atoms/CheckboxSelectOrderToPrint'

import ConfigsContext from '../Context/Configs/ConfigsContext'

import {getDatePrety, getDatePretyWHours, toTime, getTooltipCustomerFormatList} from '../hooks/PickmasterTools'

const OrdersList = ({databaseOrders, setContentLength, showListSelect, columnContentTypes, headings, filters, currentListSelectedToPrint,
  numberRecordsInput, handlePrintOneRomaneo, redirectToProduct, redirectToOrder, orderSelectToPrint, handleSelectorderToPrint, dataQuantity}) => {

  const [{shopOrigin}] = useContext(ConfigsContext)

  const [loadData, setLoadData] = useState(false)
  const [rowsFilters, setRowsFilters] = useState([])
  const checkRows = (rowlist, checker) => {
    return rowlist.filter((r,i) => {
      return checker(r)
    })
  }
  const includeQuery = (r) => {
    let ret = false
    r.forEach((value,i)=>{
      if(value.toString().toLowerCase().includes(filters.queryValue.toString().toLowerCase()))
        ret = true
    })
    return ret
  }
  const includeRegion = (r) => {
    let ret = false
    r.forEach((value,i)=>{
      if(value.toString().toLowerCase().includes(filters.region.toString().toLowerCase()))
        ret = true
    })
    return ret
  }
  const includePlatform = (r) => {
    let ret = false
    r.forEach((value,i)=>{
      if(value.toString().toLowerCase().includes(filters.platform.toString().toLowerCase()))
        ret = true
    })
    return ret
  }
  const getOrdersFiltred = () => {
    let auxRows = databaseOrders || []
    if(filters.queryValue && filters.queryValue.length  > 0)
      auxRows = checkRows(auxRows, includeQuery)
    if(filters.region && filters.region.length  > 0)
      auxRows = checkRows(auxRows, includeRegion)
    if(filters.platform && filters.platform.length  > 0)
      auxRows = checkRows(auxRows, includePlatform)
    return auxRows
  }

  const getStyleSfy = () => {
    let array = []
    if(rowsFilters.length)
    
    for (let data of rowsFilters) {
        let arrayData = []
        data.forEach((d,j)=>{
          switch (j) {
            case 0:
              arrayData.push(<span key={d}>
                <CheckboxSelectOrderToPrint key={data[0]+j} onChange={handleSelectorderToPrint}
                 currentListSelectedToPrint={currentListSelectedToPrint}
                 orderSelectToPrint={orderSelectToPrint} sku={data[0]}/></span>)
              break;
            case 1:
              arrayData.push(<span key={d}>
                <Link url={`https://${shopOrigin}/admin/orders/${data[0]}`} external={true}>{data[1]}</Link>
              </span>)
              break;
            case 2: 
              arrayData.push(<Tooltip key={d+data[10]} light content={getTooltipCustomerFormatList(d)}>
                <span style={{cursor: "default", maxWidth:"15rem"}}>{d.substring(0, d.indexOf("|"))}</span>
              </Tooltip>)
              break;
            case 3: break;
            case 4:
              arrayData.push(<span key={data[10]+d}>{d}</span>)
              break;
            case 6: 
              arrayData.push(<Tooltip key={d+data[11]+j} light content={d}>
                <span style={{cursor: "default"}}>{data[11]}</span>
              </Tooltip>)
              break;
            case 7: 
              arrayData.push(<span key={d}>{d.substring(0, d.indexOf("|"))}</span>)
              break;
            case 8:
              arrayData.push(<Tooltip key={d} light content={getDatePrety(d)}>
                <span style={{cursor: "default"}} key={toTime(d)}>{getDatePretyWHours(d)}</span>
              </Tooltip>)
              break;
            case 9: break;
            case 10:
            arrayData.push(<span key={d+j}>
              <ButtonPrintRomaneo key={d+j} {...{sku:d, isPmOrder:showListSelect===1}} 
              handlePrintRomaneo={handlePrintOneRomaneo}/>
            </span>)
            break;
            case 11: break;
            default:
              arrayData.push(<span key={d}>{d}</span>)
          }
        })
        array.push(arrayData)
      }
    return array
  }

  const getStylePrs = () => {
    let array = []
    if(rowsFilters.length)
    for (let data of rowsFilters) {
        let arrayData = []
        
        data.forEach((d,j)=>{
          switch (j) {
            case 0:
              arrayData.push(<span key={d}>
                <CheckboxSelectOrderToPrint key={data[0]+j} onChange={handleSelectorderToPrint}
                 currentListSelectedToPrint={currentListSelectedToPrint}
                orderSelectToPrint={orderSelectToPrint} sku={data[0]}/></span>)
              break;
            case 1:
              arrayData.push(<span key={d}>
                <Link onClick={()=>redirectToProduct(data[0])}>{d}</Link></span>)
              break;
            case 2: 
              arrayData.push(<Tooltip key={d+data[10]} light content={getTooltipCustomerFormatList(d)}>
                <span style={{cursor: "default", maxWidth:"15rem"}}>{d.substring(0, d.indexOf("|"))}</span>
              </Tooltip>)
              break;
            case 3:
              arrayData.push(<Tooltip key={d} light content={getDatePrety(d)}>
                <span style={{cursor: "default"}} key={toTime(d)}>{getDatePretyWHours(d)}</span>
              </Tooltip>)
              break;
            case 4:
              arrayData.push(<span key={d+data[10]}>{d}</span>)
              break;
            case 6: 
              arrayData.push(<Tooltip key={data[11]+d} light content={d}>
                <span style={{cursor: "default"}}>{data[11]}</span>
              </Tooltip>)
              break;
            case 7: 
              arrayData.push(<span key={d}>{d.substring(0, d.indexOf("|"))}</span>)
              break;
            case 8:
              arrayData.push(<Tooltip key={d} light content={getDatePrety(d)}>
                <span style={{cursor: "default"}} key={toTime(d)}>{getDatePretyWHours(d)}</span>
              </Tooltip>)
              break;
            case 9:
              arrayData.push(<span key={d}>
                <OrderStatusToList pmOrderSku={data[10]} showListSelect={showListSelect}/></span>)
            break;
            case 10:
              arrayData.push(<span key={d+j}>
                <ButtonPrintRomaneo key={d+j} {...{sku:d, isPmOrder:showListSelect===1}} 
                handlePrintRomaneo={handlePrintOneRomaneo}/>
              </span>)
              break;
            case 11: break;
            default:
              arrayData.push(<span key={d}>{d}</span>)
          }
        })
        array.push(arrayData)
    }
    return array
  }

  const getStyleFz = () => {
    let array = []
    if(rowsFilters.length)
    for (let data of rowsFilters) {
        let arrayData = []
        data.forEach((d,j)=>{
          switch (j) {
            case 0: break;
            case 1:
              arrayData.push(<span key={d}>
                <Link onClick={()=>redirectToOrder(data[0])}>{data[1]}</Link></span>)
              break;
            case 2: 
              arrayData.push(<Tooltip key={d+data[10]} light content={getTooltipCustomerFormatList(d)}>
                <span style={{cursor: "default", maxWidth:"15rem"}}>{d.substring(0, d.indexOf("|"))}</span>
              </Tooltip>)
              break;
            case 3:
              arrayData.push(<Tooltip key={d} light content={getDatePrety(d)}>
                <span style={{cursor: "default"}} key={toTime(d)}>{getDatePretyWHours(d)}</span>
              </Tooltip>)
              break;
            case 4:
              arrayData.push(<span key={data[10]+d}>{d}</span>)
              break;
            case 6: 
              arrayData.push(<Tooltip key={data[11]+d} light content={d}>
                <span style={{cursor: "default"}}>{data[11]}</span>
              </Tooltip>)
              break;
            case 7: 
              arrayData.push(<span key={d}>{d.substring(0, d.indexOf("|"))}</span>)
              break;
            case 8:
              arrayData.push(<Tooltip key={d} light content={getDatePrety(d)}>
                <span style={{cursor: "default"}} key={toTime(d)}>{getDatePretyWHours(d)}</span>
              </Tooltip>)
              break;
            case 9:
              arrayData.push(<span key={d}>
                <OrderStatusToList pmOrderSku={data[0]} showListSelect={showListSelect}/></span>)
            case 10: break;
            case 11: break;
            default:
              arrayData.push(<span key={d}>{d}</span>)
          }
        })
        array.push(arrayData)
      }
    return array
  }


  const arrayStyle = () => {
    if(rowsFilters) {
      switch (showListSelect) {
        case 0:
          return getStyleSfy()
        case 1:
          return getStylePrs()
        case 2:
        case 3:
          return getStyleFz()
        default:
          null
      }
    }else
      return []
  }

  const getSortable = () => {
    let sortable = []
    headings.forEach((k,i) => {
      if(['Orders nº', 'Printed At', 'Platform', 'Region', 'Contry', 'nº items', 'Created Date'].includes(k))
        sortable.push(true)
      else
        sortable.push(false)
    })
    return sortable
  }
  const getInitialIndex = ()=> showListSelect===1?headings.indexOf("Printed At"):headings.indexOf("Created Date")

  const [sortedRows, setSortedRows] = useState(null);
  const rows = sortedRows ? sortedRows : arrayStyle();
  
  const handleSort = (index, direction) => setSortedRows(sortCurrency(rows, index, direction))
    
  const sortCurrency = (rows, index, direction) => {
    return [...rows].sort((rowA, rowB) => {
      let amountA = rowA[index].key
      let amountB = rowB[index].key
      return direction === 'descending' ? amountB >= amountA?1:-1 : amountA >= amountB?1:-1
    })
  }

  useEffect(()=>{
    setLoadData(false)
    setRowsFilters(getOrdersFiltred())
    setSortedRows(null);
    setLoadData(true)
    return () => {
      setLoadData(false)
      setRowsFilters([])
      setSortedRows(false)
      setLoadData(false)
    }
  },[databaseOrders, filters, showListSelect])

  const contentLength = () => {
    let show = `Showing ${rowsFilters?rowsFilters.length:""} of ${databaseOrders?databaseOrders.length:""} results`
    setContentLength(show)
    return show
  }

 return loadData ?
     <DataTable
        key={rowsFilters}
        columnContentTypes={columnContentTypes}
        headings={headings}
        rows={rows.slice(0,dataQuantity)}
        footerContent={contentLength()}
        sortable={getSortable()}
        initialSortColumnIndex={getInitialIndex()}
        onSort={handleSort}
        defaultSortDirection={"descending"}
      />
    :
      <SkeletonBodyText/>
}

export default OrdersList
