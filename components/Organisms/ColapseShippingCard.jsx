import ColapseDataCard from '../Molecules/ColapseDataCard'

const ColapseShippingCard = ({title, customerName, company, address1, address2, city, state, country,
  postalCode, phone, residential, initialActive, size}) => (

  <ColapseDataCard
      title={title}
      data={[
        {label:"Name", description:customerName},
        {label:"Company", description:company},
        {label:"Address 1", description:address1},
        {label:"Address 2", description:address2},
        {label:"City", description:city},
        {label:"State", description:state},
        {label:"Country", description:country},
        {label:"Postal Code:", description:postalCode},
        {label:"Phone", description:phone},
        {label:"Residential", description:residential?"Yes":"No"}
      ]}
      initialActive={initialActive}
      size={size}
    />
  )

export default ColapseShippingCard
