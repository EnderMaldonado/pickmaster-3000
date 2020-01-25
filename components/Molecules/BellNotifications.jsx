import { useState, useEffect, useCallback} from 'react'
import { Button, Icon, Popover, Spinner, Card, ButtonGroup } from '@shopify/polaris'
import {NotificationMajorMonotone, AlertMinor} from '@shopify/polaris-icons';
import CardWarning from '../Atoms/CardWarning'
import WarningNotifications from '../Organisms/WarningNotifications';
import ListCardsWarnings from '../Molecules/ListCardsWarning'

const BellNotifications = ({handleClickPmOrder, pmOrdersWarning}) => {

  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  useEffect(()=>{
    if(pmOrdersWarning)
      setPopoverActive(true)
  },[pmOrdersWarning])

  const activator = <div style={{color:pmOrdersWarning?"red":"#454f5b", padding:"1rem .2rem .2rem"}}>
      <Button size={"large"} plain monochrome icon={NotificationMajorMonotone} 
      onClick={togglePopoverActive}></Button>
    </div>

  return <div style={{
      position: "fixed",
      zIndex:"10",
      right: "10%",
      display:"grid",
      gridTemplateColumns:"max-content max-content",
      border:"0.3rem"
    }}>
      {
        pmOrdersWarning?
        <Icon source={AlertMinor} color={"#ff3939"}/>:null
      }
      <div style={{
        backgroundColor: "#f9fafb",
        borderBottomLeftRadius: "1rem",
        borderBottomRightRadius: "1rem",
        marginLeft:"1rem",
      }}>
          <ButtonGroup>
            <Popover
            active={popoverActive}
            activator={activator}
            onClose={togglePopoverActive}
            >
              <div style={{display:"grid", maxHeight:"70vh"}}>
                <ListCardsWarnings {...{pmOrdersWarning}}
                handleClickPmOrder={(sku)=>{togglePopoverActive();handleClickPmOrder(sku)}}/>
              </div>
            </Popover>
          </ButtonGroup>
        </div>
    </div>
}

export default BellNotifications