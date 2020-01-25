import {useState} from 'react'
import { Collapsible, Card, Button, TextContainer, TextStyle } from '@shopify/polaris'

const ColapseDataCard = ({title, data, initialActive, size}) => {

  const [active, setActive] = useState(initialActive || false);
  const handleToggle = () => setActive(!active)

  return (
    <>
      <Card.Section subdued>
        <Button
          onClick={handleToggle}
          ariaExpanded={active}
          ariaControls="basic-collapsible"
          fullWidth
          plain
          disclosure={!active}
          size={size || "medium"}
        >
         {title}
        </Button>
      </Card.Section>
      <Collapsible open={active} id="basic-collapsible">
        <Card.Section>
          <TextContainer>
            <p>
            {
              data.map((key,i) => <>
                  <TextStyle key={i} variation="strong">{data[i]["label"]}: </TextStyle>{data[i]["description"]}
                    {i!==Object.keys(data).length?<br key={i+"br"} />:null}
                </>
              )
            }
            </p>
          </TextContainer>
        </Card.Section>
      </Collapsible>
    </>
  )
}

export default ColapseDataCard
