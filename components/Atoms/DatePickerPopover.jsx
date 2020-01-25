import {useState, useCallback, useContext, useEffect} from 'react'
import { Popover, Button, Icon, DatePicker, Tooltip } from '@shopify/polaris'
import {CalendarMajorMonotone} from '@shopify/polaris-icons'

const DatePickerPopover = ({handleChangeDateMin, dateUpdateMin}) => {

  
  const [{month, year}, setDate] = useState({
  month: new Date(dateUpdateMin.start).getUTCMonth(),
  year: new Date(dateUpdateMin.end).getUTCFullYear(),
});

const handleMonthChange = useCallback(
  (month, year) => setDate({month, year}),
  [],
);
  const [popoverActive, setPopoverActive] = useState(false)
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  )

  const activator = (
    <Tooltip content="Select Show Orders From">
      <Button onClick={togglePopoverActive} icon={CalendarMajorMonotone}>
      </Button>
    </Tooltip>
   );

  return (
    <Popover
    active={popoverActive}
    activator={activator}
    onClose={togglePopoverActive}>
      <div style={{overflow:"hidden"}}>
      <center><b>Show Orders From:</b></center>
      <div style={{padding:".1rem 0",widht:"100%", backgroundColor:"#212b36", margin:".1rem 0 .3rem"}}></div>
        <DatePicker
          month={month}
          year={year}
          onChange={(d)=>{handleChangeDateMin(d)}}
          onMonthChange={(month, year)=>handleMonthChange(month, year)}
          selected={{
            start: new Date(dateUpdateMin.start),
            end: new Date(dateUpdateMin.end),
          }}
          allowRange={true}
        />
      </div>
    </Popover>
  )
}

export default DatePickerPopover
