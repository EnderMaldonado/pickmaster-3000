import Frame, { FrameContextConsumer } from 'react-frame-component'

const Iframe = ({children, style, className, id}) => <Frame id={id} className={className} style={style}>
    <FrameContextConsumer>
    {
      ({document, window}) => children
    }
    </FrameContextConsumer>
  </Frame>


export default Iframe