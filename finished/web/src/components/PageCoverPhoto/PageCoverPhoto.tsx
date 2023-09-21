import CoverPhoto, { CoverPhotoProps } from 'src/components/CoverPhoto'

interface PageCoverPhotoProps {
  image: CoverPhotoProps['image']
}

const PageCoverPhoto = ({ image }: PageCoverPhotoProps) => {
  return <CoverPhoto image={image} size="250px" className="shadow-2xl" />
}

export default PageCoverPhoto
