import { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import cx from 'classnames'

type LazyImageProps = ComponentPropsWithoutRef<'img'> & { animateIn?: boolean }

const LazyImage = ({
  className,
  src,
  animateIn = true,
  alt = '',
  ...props
}: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!src) {
      return
    }

    const img = new Image()

    img.onload = () => setLoaded(true)
    img.src = src

    return () => {
      img.onload = null
      setLoaded(false)
    }
  }, [src])

  return (
    <img
      {...props}
      className={cx(
        'h-auto w-full object-cover object-center opacity-0 transition-opacity duration-300 ease-out',
        className,
        { 'opacity-100': loaded || !animateIn }
      )}
      src={src}
      alt={alt}
    />
  )
}

export default LazyImage
