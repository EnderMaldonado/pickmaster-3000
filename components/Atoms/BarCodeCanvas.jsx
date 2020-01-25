import {useEffect} from 'react'
import bwipjs from 'bwip-js';

const BarCodeCanvas = ({sku, sufix, prefix}) => {

  const createBarCode = (id,sku) => {
    const canvas = document.getElementById(id)
    bwipjs(canvas, {     // Barcode type
      bcid:        'code128',       // Barcode type
      text:        sku,    // Text to encode
      scale:       2,               // 3x scaling factor
      height:      7,              // Bar height, in millimeters
      includetext: false,            // Show human-readable text
      textxalign:  'center',        // Always good to set this
        }, function (err, cvs) {
            if (err) {
            } else {
              const img = document.getElementById(`${prefix}_img_${sku}_${sufix}`)
              img.src = canvas.toDataURL("image/png")
            }
        })
  }

  useEffect(()=>{
    createBarCode(`${prefix}_barcode_${sku}_${sufix}`, sku.toString())
  },[sku])

  return (
    <>
      <canvas style={{display:"none"}} id={`${prefix}_barcode_${sku}_${sufix}`}></canvas>
      <img style={{width: "100%"}} id={`${prefix}_img_${sku}_${sufix}`} alt={`${prefix}_img_${sku}_${sufix}`}/>
    </>
  )

}

export default BarCodeCanvas
