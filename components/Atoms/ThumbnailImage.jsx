
const ThumbnailImage = ({source,alt}) => {
  return (
    <div style={{
      width: "16rem",
      minWidth: "4rem",
      maxWidth: "100%",
      height:"16rem",
      display:"grid",
      border:"1px solid rgba(0,0,0,.12)"
    }}>
      <img style={{
        margin:"auto",
        maxWidth: "100%",
        maxHeight: "100%"
      }}
      src={source}
      alt={alt}
      />
    </div>
  )
}

export default ThumbnailImage
