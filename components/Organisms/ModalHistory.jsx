import {useContext, useEffect, useState} from 'react'
import { TextField, Modal, Card } from '@shopify/polaris'

import HistoryList from '../Organisms/HistoryList'

import {getData, getHistory} from '../Firebase/FirebaseMethodsGet.js'

const ModalHistory = ({activeModal, setActiveModal, title, origin}) => {

  const [reload, setReload] = useState(false)
  const [historyList, setHistoryList] = useState([])

  const [loadPage, setLoadPage] = useState(false)

  const handlePrimary = () => setReload(!reload)
  const handleCancel = () => setActiveModal(false)

  useEffect(()=>{
    setLoadPage(false)
    if(activeModal)
      getHistory(origin, null, 
        data => {
          setHistoryList(data);
          setLoadPage(true)
        }, 
       err=>console.log(err))
  },[reload, activeModal, origin])

  return (
    <Modal
        large
        open={activeModal}
        title={title}
        loading={!loadPage}
        primaryAction={{
          content: 'Refresh',
          onAction: handlePrimary,
        }}
        secondaryActions={[
          {
            content: 'Close',
            onAction: handleCancel,
          },
        ]}
        onClose={handleCancel}
      >
        <Modal.Section>
        {
          loadPage?
          <Card>
            <HistoryList data={historyList}/>
          </Card>
          :
          "Loading History . . ."
        }
        </Modal.Section>
      </Modal>
  )
}

export default ModalHistory
