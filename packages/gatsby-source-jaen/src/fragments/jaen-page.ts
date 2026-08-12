import {graphql} from 'gatsby'

export const fragments = graphql`
  fragment JaenPageQuery on Query {
    jaenPage(id: {eq: $jaenPageId}) {
      ...JaenPageData
    }
  }

  fragment JaenPageDataStructure on JaenPage {
    id
    createdAt
    modifiedAt
    buildPath
    slug
    template
    excludedFromIndex
    jaenPageMetadata {
      ...JaenPageMetadataFields
    }

    pageConfig
  }

  # The metadata image in both of its shapes. It sits in the shared structure
  # fragment so that childPages and parentPage carry it too: a card grid
  # renders the metadata of OTHER pages, and that is exactly where the
  # unoptimised <img> used to end up.
  #
  # CONSTRAINED, not FULL_WIDTH like mediaNodes uses. A metadata image is a
  # preview image, and FULL_WIDTH declares sizes="100vw" no matter how small
  # the box is, so the browser fetches a candidate wider than it needs.
  # PageMetadataImage forwards a sizes prop for consumers that know better.
  # (No backticks in here: this is inside a template literal and one would
  # end it, which Gatsby reports only as "problem parsing this file".)
  fragment JaenPageMetadataFields on JaenPageMetadata {
    title
    image
    imageId
    imageFile {
      childImageSharp {
        gatsbyImageData(
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
          layout: CONSTRAINED
          width: 800
        )
      }
    }
    description
    blogPost {
      date
      author
      category
    }
  }

  fragment JaenPageChildrenData on JaenPage {
    ...JaenPageDataStructure
    jaenFields
    mediaNodes {
      id
      description
      node {
        childImageSharp {
          gatsbyImageData(
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
            layout: FULL_WIDTH
          )
        }
      }
    }
  }

  fragment JaenPageData on JaenPage {
    ...JaenPageDataStructure
    pageConfig
    id
    buildPath
    slug
    jaenFields
    excludedFromIndex
    template
    parentPage {
      ...JaenPageDataStructure
    }
    childPages {
      ...JaenPageDataStructure
    }
    childPagesOrder
    jaenPageMetadata {
      ...JaenPageMetadataFields
    }

    mediaNodes {
      id
      description
      node {
        childImageSharp {
          gatsbyImageData(
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
            layout: FULL_WIDTH
          )
        }
      }
    }

    sections {
      ...JaenSectionRecursive
    }
  }

  fragment JaenSectionRecursive on JaenSection {
    ...JaenSectionFields
    items {
      ...JaenSectionItemFields
      sections {
        ...JaenSectionFields
        items {
          ...JaenSectionItemFields
          sections {
            ...JaenSectionFields
            items {
              ...JaenSectionItemFields
              sections {
                ...JaenSectionFields
                items {
                  ...JaenSectionItemFields
                  sections {
                    ...JaenSectionFields
                    items {
                      ...JaenSectionItemFields
                      sections {
                        ...JaenSectionFields
                        items {
                          ...JaenSectionItemFields
                          sections {
                            ...JaenSectionFields
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  fragment JaenSectionFields on JaenSection {
    fieldName
    ptrHead
    ptrTail
  }

  fragment JaenSectionItemFields on JaenSectionItem {
    id
    type
    ptrPrev
    ptrNext
    jaenFields
  }
`
