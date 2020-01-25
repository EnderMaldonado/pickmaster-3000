import {useState, useEffect, useContext} from 'react'
import { DisplayText, Layout, Card, TextField } from '@shopify/polaris'

const EditTagLocation = ({tagLocationCache, setTagLocationCache}) => {

  return (
    <>
      <DisplayText size="small">Tag Locations</DisplayText>
      <Layout>
        <Layout.AnnotatedSection
          title="Edit Products Tag Locations"
          description="Enter the character key that pickmaster will use to reference the tags that contain the location of the products. (example: LCT)">
          <Card sectioned>
          <TextField
            label="Tag location"
            value={tagLocationCache}
            onChange={setTagLocationCache}
            error={tagLocationCache?"":"Tag Location is required"}
          />
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </>
  )
}

export default EditTagLocation
