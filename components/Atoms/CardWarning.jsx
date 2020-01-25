import { Link, Heading, TextContainer } from '@shopify/polaris'

const CardWarning = ({pmOrderSku, pmOrderNumber, warningMessage, handleClickPmOrder}) => 
    <div style={{padding:"1rem", width:"30rem", backgroundColor:"red", color:"black", 
                borderBottom: "1px solid black"}}>
        <TextContainer>
            <Heading>
                <span>Pickmaster Order <Link onClick={()=>handleClickPmOrder(pmOrderSku)}>{pmOrderNumber}</Link></span>
            </Heading>
            <p>{warningMessage}</p>
        </TextContainer>
    </div>


export default CardWarning