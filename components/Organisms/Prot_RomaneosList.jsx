import {useContext, forwardRef, useImperativeHandle } from 'react'
import Romaneo from '../Molecules/Romaneo'
import RomaneosContext from '../Context/Romaneos/RomaneosContext'
import {window} from "global/window"
import Iframe from '../Molecules/Iframe'

const Prot_RomaneosList = forwardRef((props, ref) => {
  const [{romaneosPMOrdersData}] = useContext(RomaneosContext)

  useImperativeHandle(ref, () => ({
    handlePrint() {
      if(romaneosPMOrdersData){
      let iframe = window.document.getElementById("iframe-print").contentDocument
      if(iframe){
        iframe.body.innerHTML = window.document.getElementById("romaneos").innerHTML
        iframe.body.innerHTML = stylePrint + iframe.body.innerHTML
        window.frames[0].print()
      }}
    }
    }));


  const stylePrint =  `
    <style>
      @media print{
        .oculto-impresion, .oculto-impresion *{
          display: none !important;
        }
      }
    </style>
  `

  return <>
    {
      romaneosPMOrdersData ?
        <div style={{display:"none"}}>
          <div id="romaneos">
            {
              Object.keys(romaneosPMOrdersData).map((sku,i) =>  <Romaneo order={romaneosPMOrdersData[sku]} key={i} keyBar={i}/>)
            }
          </div>
        </div>
      :
        null
    }
    <Iframe id="iframe-print" style={{display:"none"}}>
    </Iframe>
  </>
})

export default Prot_RomaneosList
