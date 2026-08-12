import deepmerge from 'deepmerge'
import {HeadProps} from 'gatsby'
import React from 'react'

import {resolvePageMetadataImage} from '../components/PageMetadataImage'
import {useSiteMetadataContext} from '../contexts/site-metadata'
import {useAppSelector, withRedux} from '../redux'
import {PageProps} from '../types'
import {getSchemaOrg} from './get-schema-org'

export const Head: React.FC<
  HeadProps<PageProps['data'], PageProps['pageContext']> & {
    children: React.ReactNode
  }
> = withRedux(props => {
  const siteMetadata = useSiteMetadataContext()

  const dynamicJaenPageMetadata = useAppSelector(
    state =>
      state.page.pages.nodes[props.pageContext.jaenPageId!]?.jaenPageMetadata
  )

  const defaultTitle = props.location.pathname

  const jaenPageMetadata = deepmerge(
    props.data.jaenPage?.jaenPageMetadata || {},
    dynamicJaenPageMetadata || {}
  )

  // Both fallbacks may carry a serialized intlText marker (an object) —
  // only plain strings may render into the document title.
  const metadataTitle =
    typeof jaenPageMetadata?.title === 'string'
      ? jaenPageMetadata.title
      : undefined
  const configLabel =
    typeof props.pageContext.pageConfig?.label === 'string'
      ? props.pageContext.pageConfig.label
      : undefined

  const title =
    metadataTitle || configLabel || siteMetadata?.title || defaultTitle

  const description = jaenPageMetadata?.description || siteMetadata?.description
  const normalizedSiteUrl = siteMetadata?.siteUrl?.replace(/\/+$/, '')
  const canonicalUrl = normalizedSiteUrl
    ? new URL(
        props.location.pathname || '/',
        `${normalizedSiteUrl}/`
      ).toString()
    : undefined
  const siteUrl = normalizedSiteUrl || '/'
  const url = canonicalUrl || props.location.pathname

  // Every social preview tag needs a plain absolute url and would silently
  // break on anything else, so `jaenPageMetadata.image` — the address, the
  // one thing every page has ever stored — keeps first claim and this stays
  // exactly the string it was before the optimised path existed.
  //
  // The middle rung is new and only fires for a page that carries a media id
  // and no address at all: the resolved file's public src, absolutized
  // against siteUrl because sharp emits `/static/...`. Without it such a page
  // would fall through to the site image and lose its own preview.
  const resolvedImage = resolvePageMetadataImage(jaenPageMetadata)
  const resolvedImageUrl =
    resolvedImage?.src && normalizedSiteUrl
      ? new URL(resolvedImage.src, `${normalizedSiteUrl}/`).toString()
      : resolvedImage?.src

  const image =
    jaenPageMetadata?.image || resolvedImageUrl || siteMetadata?.image
  const isBlogPost = !!jaenPageMetadata?.blogPost?.date || false
  const datePublished =
    (isBlogPost && jaenPageMetadata?.blogPost?.date) || false
  const fbAppID = siteMetadata?.social?.fbAppID
  const twitter = siteMetadata?.social?.twitter

  const schemaOrgJSON = getSchemaOrg({
    author: siteMetadata?.author,
    datePublished,
    defaultTitle,
    description,
    image,
    isBlogPost,
    organization: siteMetadata?.organization,
    title,
    siteUrl,
    url
  })

  return (
    <>
      <title id="title">{title}</title>
      <meta id="meta-description" name="description" content={description} />
      <meta id="meta-image" name="image" content={image} />
      {canonicalUrl ? (
        <link id="canonical-link" rel="canonical" href={canonicalUrl} />
      ) : null}

      {/* OpenGraph tags */}
      <meta id="og-url" property="og:url" content={url} />
      {isBlogPost ? (
        <meta id="og-type" property="og:type" content="article" />
      ) : null}
      <meta id="og-title" property="og:title" content={title} />
      <meta
        id="og-description"
        property="og:description"
        content={description}
      />
      <meta id="og-image" property="og:image" content={image} />
      <meta id="fb-app-id" property="fb:app_id" content={fbAppID} />

      {/* Twitter Card tags */}
      <meta
        id="twitter-card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta id="twitter-creator" name="twitter:creator" content={twitter} />
      <meta id="twitter-title" name="twitter:title" content={title} />
      <meta
        id="twitter-description"
        name="twitter:description"
        content={description}
      />
      <meta id="twitter-image" name="twitter:image" content={image} />

      {/* Schema.org tags */}
      <script id="schema-org" type="application/ld+json">
        {JSON.stringify(schemaOrgJSON)}
      </script>

      {props.children}
    </>
  )
})
