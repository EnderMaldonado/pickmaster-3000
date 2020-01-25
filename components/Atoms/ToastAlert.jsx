import { useState, forwardRef, useImperativeHandle } from "react";
import { Toast } from '@shopify/polaris'

const ToastAlert = forwardRef((props, ref) => {
  
  const [active, setActive] = useState(false)
  const toggleActive = () => setActive(!active)

  const [error, setError] = useState(false)
  const [duration, setDuration] = useState(1000)
  const [content, setContent] = useState(null)

  useImperativeHandle(ref, () => ({
    handleToastAlert(error, duration, content) {
      setError(error)
      setDuration(duration)
      setContent(content)
      setActive(true)      
    }
  }));
  
  return active ? <Toast error={error} duration={duration} content={content} onDismiss={toggleActive} /> : null
})

export default ToastAlert