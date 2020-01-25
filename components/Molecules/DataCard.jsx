import React from 'react'
import { Card, TextContainer, TextStyle } from '@shopify/polaris'

const DataCard = ({title, data}) => {

  return <Card sectiones title={title} sectioned>
          <TextContainer>
            <p>
            {
              data.map((key,i) => <React.Fragment key={i}>
                  <TextStyle variation="strong">{data[i]["label"]}: </TextStyle>{data[i]["description"]}
                    {i!==Object.keys(data).length?<br/>:null}
                </React.Fragment>
              )
            }
            </p>
          </TextContainer>
        </Card>
}

export default DataCard
