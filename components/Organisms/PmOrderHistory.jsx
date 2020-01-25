import {useEffect, useState} from 'react'
import { Card, Form, FormLayout, TextField, Button, Spinner } from '@shopify/polaris'
import HistoryList from './HistoryList'
import {EditMajorMonotone} from '@shopify/polaris-icons';

import usePickmasterHandles from '../hooks/usePickmasterHandles'
import useFirebaseGet from '../hooks/useFirebaseGet'

const PmOrderHistory = ({pmOrderSku}) => {

  const [historyList, setHistoryList] = useState([])

  const [loadPage, setLoadPage] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const {saveTimelineComentaryPmOrder} = usePickmasterHandles()

  useFirebaseGet([{
    request:`PMOrders/${pmOrderSku}/history`,
    handleResponse: data => {
      setHistoryList(data)
      setLoadPage(true)      
      setIsAdding(false)
    },
    handleError: error => console.log(error)
  }
], pmOrderSku)

  const [hText, setHText] = useState("")
  const handleSubmit = e => {
    e.preventDefault()
    saveTimelineComentaryPmOrder(pmOrderSku, hText)
    setIsAdding(true)
    setHText("")
  }

  return loadPage?
    <Card subdued sectioned title="History Pickmaster Order">
      <Card sectioned>
        <Form onSubmit={handleSubmit} implicitSubmit={true}>
          <FormLayout>
            <FormLayout.Group>
              <div style={{display:"grid", gridTemplateColumns:"1fr auto"}}>
                <TextField placeholder={"Comentary"} value={hText} onChange={setHText}/>
                {
                  isAdding?
                  <Spinner accessibilityLabel="Spinner example" color="teal" />
                  :
                  <div style={{color:"#006fbb"}}>
                    <Button icon={EditMajorMonotone} primary monochrome outline submit>Add</Button>
                  </div>
                }
              </div>
            </FormLayout.Group>
          </FormLayout>
        </Form>
      </Card>
      <Card>
        <HistoryList key={Object.keys(historyList)} data={historyList}/>
      </Card>
    </Card>
    :
    "Loading History . . ."

}

export default PmOrderHistory
