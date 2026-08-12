import {Image} from '@chakra-ui/react'
import {GatsbyImage, getSrc, IGatsbyImageData} from 'gatsby-plugin-image'
import React, {CSSProperties} from 'react'

import {JaenPageMetadataImage} from '../../types'

export interface ResolvedPageMetadataImage {
  /** Present only when the picture came out of the media library. */
  gatsbyImageData?: IGatsbyImageData
  /**
   * A plain address for the picture, always usable in an `<img src>` or in a
   * social preview tag. Falls back to the optimised file's own url when the
   * page carries a media id but no address.
   */
  src?: string
  /** The media library label, empty for a page that only stores an address. */
  description?: string
}

/**
 * Reads a page metadata image without caring which of its two shapes it is.
 *
 * A page metadata image is either a media library reference (`imageId`, with
 * `imageFile` resolved at build time) or nothing but a url in `image`. The
 * second shape is what every page published before the reference existed
 * carries, and it cannot be migrated away — the published patches are
 * immutable. So both shapes stay valid forever and this is the one place
 * that knows the difference.
 *
 * Pure: no hooks, no page context. Call it from SEO code that needs a plain
 * url, and let `PageMetadataImage` call it for rendering.
 */
export const resolvePageMetadataImage = (
  metadata?: JaenPageMetadataImage | null
): ResolvedPageMetadataImage | undefined => {
  const gatsbyImageData = metadata?.imageFile?.childImageSharp?.gatsbyImageData

  // The stored address wins as `src` even when the optimised file exists:
  // it is the original, absolute, publicly reachable url, and a resized
  // sharp output under /static is neither absolute nor the same picture at
  // full quality. getSrc is the fallback for a page that only got a media id.
  const src =
    metadata?.image ||
    (gatsbyImageData ? getSrc(gatsbyImageData) : undefined) ||
    undefined

  if (!gatsbyImageData && !src) {
    return undefined
  }

  return {
    gatsbyImageData,
    src
  }
}

export interface PageMetadataImageProps {
  /**
   * The `jaenPageMetadata` of the page whose picture should be shown, or the
   * image part of it. Anything falsy renders nothing.
   */
  metadata?: JaenPageMetadataImage | null
  alt: string
  className?: string
  style?: CSSProperties
  imgClassName?: string
  imgStyle?: CSSProperties
  objectFit?: CSSProperties['objectFit']
  objectPosition?: CSSProperties['objectPosition']
  loading?: 'eager' | 'lazy'
  /**
   * The rendered box, e.g. `(min-width: 62em) 33vw, 100vw`. The fragment
   * requests a CONSTRAINED image and therefore declares
   * `(min-width: 800px) 800px, 100vw`, which overstates a card in a grid.
   *
   * Only reaches the optimised branch: an `<img>` with no srcset selects
   * nothing from it.
   */
  sizes?: string
}

/**
 * A page metadata image, served optimised whenever it can be.
 *
 * The two branches mirror `Field.Image` deliberately. In the CMS both
 * mechanisms look like "pick a picture from the media library", so they must
 * not render differently: a media reference becomes a `GatsbyImage` with
 * AVIF/WebP sources, a srcset, a blur placeholder and a reserved box, and a
 * bare address becomes the same plain `<Image>` it always was.
 *
 * While editing live the optimised file does not exist yet for a picture
 * chosen in this session — sharp only runs at build time — so the component
 * falls back to the address the chooser stored and the CMS preview keeps
 * working. Same trade-off `useImage` makes for `Field.Image`.
 */
export const PageMetadataImage: React.FC<PageMetadataImageProps> = ({
  metadata,
  alt,
  className,
  style,
  imgClassName,
  imgStyle,
  objectFit,
  objectPosition,
  loading,
  sizes
}) => {
  const resolved = resolvePageMetadataImage(metadata)

  if (!resolved) {
    return null
  }

  if (resolved.gatsbyImageData) {
    return (
      <GatsbyImage
        image={resolved.gatsbyImageData}
        alt={alt}
        className={className}
        style={style}
        imgClassName={imgClassName}
        imgStyle={imgStyle}
        objectFit={objectFit}
        objectPosition={objectPosition}
        loading={loading}
        sizes={sizes}
      />
    )
  }

  return (
    // The unoptimised branch stays the plain chakra Image it has always been,
    // so a page that only carries an address renders what it rendered before
    // this component existed. `sizes` is deliberately dropped here: without a
    // srcset it selects nothing, and leaving it out keeps the markup of an
    // unmigrated page identical to the markup it had.
    <Image
      src={resolved.src}
      alt={alt}
      className={className}
      style={{...style, ...imgStyle}}
      objectFit={objectFit}
      objectPosition={objectPosition}
      loading={loading}
    />
  )
}
