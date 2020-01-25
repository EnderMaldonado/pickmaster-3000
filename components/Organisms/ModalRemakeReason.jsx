import {useContext, useEffect, useState} from 'react'
import { TextField, Modal } from '@shopify/polaris'

const ModalRemakeReason = ({activeModal, setActiveModal, handleCreate, onFinishLoad, sku}) => {

  const [remakeReasonText, setRemakeReasonText] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCancel = () => {
    setActiveModal(false)
  }

  const handlePrimary = () => {
    setLoading(true)
    handleCreate(remakeReasonText, sku)
    .then(r => {
      if(onFinishLoad)onFinishLoad(r)
      setRemakeReasonText("")
      setActiveModal(false)
      setLoading(false)
    })
  }

  return (
    <Modal
        open={activeModal}
        title="Remake Reason"
        loading={loading}
        primaryAction={!loading?{
          content: 'Create Remake',
          onAction: !loading?handlePrimary:null,
        }:false}
        secondaryActions={!loading?[
          {
            content: 'Cancel',
            onAction: !loading?handleCancel:null,
          },
        ]:false}
        onClose={!loading?handleCancel:null}
      >
        <Modal.Section>
          <TextField
          label="Please enter the reason why you want to create a remake"
          value={remakeReasonText} onChange={setRemakeReasonText}
          multiline autoFocus/>
        </Modal.Section>
      </Modal>
  )
}

export default ModalRemakeReason
