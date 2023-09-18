import CoverPhoto, { CoverPhotoProps } from 'src/components/CoverPhoto'

interface MediaTileCoverPhotoProps {
  image: CoverPhotoProps['image']
}

const MediaTileCoverPhoto = ({ image }: MediaTileCoverPhotoProps) => {
  return <CoverPhoto image={image} className="shadow-md" />
}

export default MediaTileCoverPhoto
