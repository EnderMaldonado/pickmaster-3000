import {useState, useCallback} from 'react'
import { Card, Button, Icon, Tooltip, ButtonGroup, Toast, TextField, Stack, Spinner} from '@shopify/polaris'
import OrdersList from '../Organisms/OrdersList'
import BarCodeDetected from '../Atoms/BarcodeDetected'
import PrintAllRomaneos from '../Atoms/PrintAllRomaneos'
import ConfigButton from '../Atoms/ConfigButton'
import FiltersOptionsList from '../Molecules/FiltersOptionsList'
import History from '../Organisms/History'
import TabsOrdersToSend from '../Molecules/TabsOrdersToSend'
import DatePickerPopover from '../Atoms/DatePickerPopover'
import CheckboxSelectAll from '../Atoms/CheckboxSelectAll'
import SetNumberRecords from '../Atoms/SetNumberRecords'
import OrdersPending from '../Organisms/OrdersPending'
import PMOrdersProcessed from '../Organisms/PMOrdersProcessed'
import {RefreshMajorMonotone, CircleCancelMajorMonotone, SearchMinor} from '@shopify/polaris-icons';
import {getDatePrety, getDatePretyWHoursNormal} from '../hooks/PickmasterTools.js'
import SkeletonLoadTable from '../Organisms/SkeletonLoadTable'

import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/fr'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const OrdersToSendLayer = ({loadPage, ordersList, handlePrintOneRomaneo, redirectToProduct, showListSelect, handleChangeShowListSelect, dataQuantity,handleSelectAllOrderToPrint,
  orderSelectToPrint, handleSelectorderToPrint, skuScannList, handleConfigClick, handleRefresh, handleCleanPrintedList,currentListSelectedToPrint,
  shopifyOrdersList, updateListPrinted, pmOrdersInProcess, handlePrintRomaneo, handlePrintIframe, pmOrdersFinalized, pmOrdersCancelled, handleChangeDataUpdateQuantity,
  handleChangeDateMin, dateUpdateMin, redirectToOrder}) => {

  const [region, setRegion] = useState("")
  const [platform, setPlatform] = useState("")
  const [queryValue, setQueryValue] = useState(null)

  const [contentLength, setContentLength] = useState("")

const  getColumnContentTypes = headings => {
  let columns = []
  for (var i = 0; i < headings.length; i++) {
    columns.push('text')
  }
  columns[columns.length-1] = "numeric"
  return columns
}


 const getHeadings = () => {
   switch (showListSelect) {
     case 0:
       return [<CheckboxSelectAll allCheckbos={currentListSelectedToPrint} handleSelectAll={handleSelectAllOrderToPrint}/>,
                'Orders nº', 'Customer', 'Platform', 'Region', 'Contry', 'nº items', 'Created Date', numberRecordsInput]
     case 1:
     return [<CheckboxSelectAll allCheckbos={currentListSelectedToPrint} handleSelectAll={handleSelectAllOrderToPrint}/>,
            'Orders nº', 'Customer', 'Printed At', 'Platform', 'Region', 'Contry', 'nº items', 'Created Date', 'Status', numberRecordsInput]
     case 2:
     case 3:
     return ['Orders nº', 'Customer', 'Printed At', 'Platform', 'Region', 'Contry', 'nº items', 'Created Date', 'Status', numberRecordsInput]
     case 4:
       return ['Comentary', 'Date', 'Link']
    default:
      return null
   }
 }

 const getDataToOrderList = () => {
   let ordersRows = []   
   Object.keys(ordersList).forEach(sku => {
     ordersRows.push([
      sku,
      ordersList[sku].number,
      ordersList[sku].customerNameAddress + "|" + ordersList[sku].customerName + "|" + ordersList[sku].customerId,
      ordersList[sku].createdAt || "",
      ordersList[sku].platform,
      ordersList[sku].region,
      ordersList[sku].country,
      ordersList[sku].totalItems + "|" + (ordersList[sku].itemEbayId?ordersList[sku].itemEbayId:""),
      ordersList[sku].orderDate,
      sku,
      sku,
      ordersList[sku].country_code
     ])
   })   
   return ordersRows
 }

  const [active, setActive] = useState(false)
  const [textToast, setTextToast] = useState("")
  const toggleActive = useCallback(() => setActive((active) => !active), [])
  const toastMarkup = active ? (
    <Toast content={textToast} error onDismiss={toggleActive} duration={1000} />
  ) : null

  const numberRecordsInput = <SetNumberRecords {...{dataQuantity, handleChangeDataUpdateQuantity}} />

  const formatter = buildFormatter(frenchStrings)

  //<TimeAgo date={new Date(new Date().getTime()-3008000000)} />

  return (
    <>
    <Card>
      <Card.Subsection>
        <div style={{display:"grid", gridTemplateRows:"auto auto"}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr auto"}}>
                <TabsOrdersToSend {...{shopifyOrdersList, pmOrdersInProcess, pmOrdersFinalized, pmOrdersCancelled}}
                selected={showListSelect} onSelect={handleChangeShowListSelect}/>

                <div style={{marginRight:"1rem", marginTop:"1rem", justifySelf:"right"}}>
                  <ButtonGroup>
                    <Tooltip content="Refresh Lists">
                      <Button onClick={()=>handleRefresh()} icon={RefreshMajorMonotone} ></Button>
                    </Tooltip>
                    <ConfigButton onClick={()=>handleConfigClick()}/>
                  </ButtonGroup>
                </div>
          </div>

          <div style={{display:"grid", gridTemplateColumns: "2fr 1fr 1fr 3fr", justifyItems: "center",
            gridGap: "2%",margin: "1rem 1.6rem", height: "100%"}}>
            <div style={{display: "grid", gridGap: "1.6rem", gridTemplateRows: "auto auto", width: "100%", minWidth:"25rem"}}>
              <div style={{display:"grid", width:"100%", alignSelf: "end"}}>
                <Card subdued>
                  <FiltersOptionsList
                    onChange={v =>setPlatform(v.includes("all")?"":v)}
                    choices={[
                      {label: 'All', value: 'all'},
                      {label: 'AMZ', value: 'amazon'},
                      {label: 'SPF', value: 'shopify'},
                      {label: 'EBY', value: 'ebay'}
                    ]}
                    name={"platform"}
                    defaultValue={"all"}
                    />
                  <FiltersOptionsList
                  onChange={v =>setRegion(v.includes("all")?"":v)}
                  choices={[
                    {label: 'All', value: 'all'},
                    {label: 'USA', value: 'usa'},
                    {label: 'INTL', value: 'intl'}
                  ]}
                  defaultValue={"all"}
                  name={"region"}
                  />
                </Card>
              </div>
              <div style={{display: "grid", width:"100%", gridTemplateColumns: "auto 1fr", gridGap: "1.6rem"}}>
                <DatePickerPopover {...{handleChangeDateMin, dateUpdateMin}}/>
                <div style={{display:"grid", width:"100%"}}>
                  <TextField value={queryValue}
                  onChange={setQueryValue}
                  placeholder={"Search"}
                  prefix={<Icon source={SearchMinor} color="inkLightest"/>}
                  />
              </div>
              </div>
            </div>
            <div style={{display:"grid", width:"100%", alignItems:"center", height:"100%", minWidth: "16rem"}}>
              <PrintAllRomaneos {...{shopifyOrdersList, currentListSelectedToPrint, handleCleanPrintedList,
                updateListPrinted, pmOrdersInProcess, orderSelectToPrint, showListSelect, handlePrintRomaneo, handlePrintIframe}}/>
            </div>
            <div style={{display:"grid", width:"100%", alignItems:"center", height:"100%", minWidth: "16rem"}}>
              <BarCodeDetected
                skuList={skuScannList}
                onDetect={redirectToProduct}
                onError={()=>{
                  setTextToast("SKU Order Doesn't Match")
                  toggleActive()
                }}
              />
            </div>
            <div style={{display:"grid", alignItems:"center", height:"100%", justifySelf:"left"}}>
              <Card subdued>
                <div style={{
                  display: "grid", gap: "0.5re", height: "100%", gridTemplateColumns: "auto auto auto auto auto auto",
                  justifyItems: "center", alignItems: "center", gridColumnGap: "1.2rem", margin: "1.6rem", gridRowGap: ".25rem",
                  justifySelf: "left"
                }}>
                  <span></span>
                  <span>Shopify</span>
                  <span>Amazon</span>
                  <span>eBay USA</span>
                  <span>eBay INTL</span>
                  <span style={{fontWeight:"bold"}}>Total</span>
                  <OrdersPending/>
                  <PMOrdersProcessed/>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card.Subsection>
      <div style={{marginTop:"1.6rem"}}>
        <Card subdued>
          <div style={{color:"#637381", height:"2.2rem", display:"grid", gridTemplate:"1fr / 1fr", alignItems:"center", justifyItems:"center"}}>
            <span style={{gridArea:"1/1/1/1", justifySelf:"start", marginLeft:"1rem"}}>{dateUpdateMin?"Orders from: " + getDatePretyWHoursNormal(dateUpdateMin.start) + " to: " + getDatePretyWHoursNormal(dateUpdateMin.end):null}</span>
            <span style={{gridArea:"1/1/1/1"}}>{loadPage?contentLength:"Loading . . ."}</span>
          </div>
        </Card>
      </div>
      <Card.Subsection>
        {
          loadPage?
            showListSelect===4?
              <History/>
            :
              <OrdersList key={showListSelect} {...{filters:{queryValue, region, platform},
              handlePrintOneRomaneo, redirectToProduct, showListSelect,currentListSelectedToPrint,
              dataQuantity, setContentLength,numberRecordsInput,
              orderSelectToPrint, handleSelectorderToPrint, redirectToOrder}}
              databaseOrders={getDataToOrderList()}
              headings={getHeadings()}
              columnContentTypes={getColumnContentTypes(getHeadings())}
              />
          :
            <SkeletonLoadTable/>
        }
      </Card.Subsection>
    </Card>
    {toastMarkup}
    </>
  )
}

export default OrdersToSendLayer
