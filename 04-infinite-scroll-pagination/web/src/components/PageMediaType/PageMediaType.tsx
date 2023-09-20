interface PageMediaTypeProps {
  mediaType: string
}

const PageMediaType = ({ mediaType }: PageMediaTypeProps) => {
  return (
    <div className="text-xs font-bold uppercase tracking-widest">
      {mediaType}
    </div>
  )
}

export default PageMediaType
