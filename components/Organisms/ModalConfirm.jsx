import {  Modal } from '@shopify/polaris'

const ModalConfirm = ({activeModal, setActiveModal, title, description, handleAction}) => {

  const handleCancel = () => {
    setActiveModal(false)
  }

  const handlePrimary = () => {
    setLoading(true)
    handleCreate(remakeReasonText, sku)
    .then(r => {
      if(onFinishLoad)onFinishLoad(r)
      setActiveModal(false)
    })
  }

  return (
    <Modal
        open={activeModal}
        title={title}
        primaryAction={{
          content: 'Continue',
          onAction: handleAction,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleCancel,
          },
        ]}
      >
        <Modal.Section>
          <p>{description}</p>
        </Modal.Section>
      </Modal>
  )
}

export default ModalConfirm
