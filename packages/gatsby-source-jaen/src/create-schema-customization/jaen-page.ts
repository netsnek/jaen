import fs from 'fs'
import {CreateSchemaCustomizationArgs, Node} from 'gatsby'

export const createSchemaCustomization = async ({
  actions
}: CreateSchemaCustomizationArgs) => {
  actions.createTypes(`
    type JaenPage implements Node {
      id: ID!
      slug: String!
      jaenPageMetadata: JaenPageMetadata!
      jaenFields: JSON
      mediaNodes: [MediaNode!]! @mediaNodes

      sections: [JaenSection!]!

      template: String

      buildPath: String @buildPath
      excludedFromIndex: Boolean
      
      pageConfig: JSON

      parentPage: JaenPage @link
      childPages: [JaenPage!]! @childPages
      childPagesOrder: [String!]!

      createdBy: String!

      createdAt: Date!
      modifiedAt: Date!
    }

    type MediaNode implements Node {
        id: ID!
        jaenPageId: String
        description: String!
        # The storage url the media library stored. Exposed so a metadata
        # image that only ever kept the address can still be traced back to
        # its media node, see the jaenMetadataImage extension below.
        url: String
        node: File! @link
    }

    type JaenSection {
      fieldName: String!
      items: [JaenSectionItem!]!
      ptrHead: String
      ptrTail: String
    }

    type JaenSectionItem {
      id: ID!
      type: String!
      ptrPrev: String
      ptrNext: String
      jaenFields: JSON

      sections: [JaenSection!]!
    }

    type JaenSectionPath {
      fieldName: String!
      sectionId: String
    }

    type JaenPageMetadata {
      title: String!
      description: String
      # The plain address of the picture. Every page ever published carries
      # this and nothing else, and the SEO tags (jaen/src/Head/Head.tsx) need
      # a plain url, so it stays a String forever.
      image: String
      # The media library id of the same picture, written by the page form
      # since the optimised path exists. Optional: a page from an older patch
      # simply has none.
      imageId: String
      # The File behind imageId (or behind image, when the address happens to
      # be a media library url), so a metadata image can be served through
      # sharp exactly like Field.Image is.
      imageFile: File @jaenMetadataImage
      blogPost: JaenPageMetadataBlogPost
    }

    type JaenPageMetadataBlogPost {
      date: String
      author: String
      category: String
    }
  `)

  actions.createFieldExtension({
    name: 'buildPath',
    args: {},
    extend(_options: any, _prevFieldConfig: any) {
      return {
        args: {},
        async resolve(
          source: Node & {
            slug: string
            parentPage: string | null
          },
          _args: any,
          context: any,
          _info: any
        ) {
          const {entries} = await context.nodeModel.findAll({
            type: 'SitePage'
          })

          const pages = entries.filter(
            (entry: any) => entry.context.jaenPageId === source.id
          )

          const pagesArr: any[] = Array.from(pages)

          if (pagesArr.length > 0) {
            // Several SitePages can share one jaenPageId (localized variants
            // of a programmatic page). Prefer the shortest path — the
            // unprefixed default-locale variant — so buildPath stays
            // deterministic.
            pagesArr.sort((a, b) => a.path.length - b.path.length)

            return pagesArr[0].path
          }
        }
      }
    }
  })

  actions.createFieldExtension({
    name: 'childPages',
    args: {},
    extend(_options: any, _prevFieldConfig: any) {
      return {
        args: {},
        async resolve(
          source: Node & {
            slug: string
            parentPage: string | null
          },
          _args: any,
          context: any,
          _info: any
        ) {
          const {entries} = await context.nodeModel.findAll({
            type: 'JaenPage',
            query: {
              filter: {
                parentPage: {
                  id: {
                    eq: source.id
                  }
                }
              }
            }
          })

          return entries
        }
      }
    }
  })

  actions.createFieldExtension({
    name: 'jaenMetadataImage',
    args: {},
    extend(_options: any, _prevFieldConfig: any) {
      return {
        args: {},
        async resolve(
          source: {image?: string; imageId?: string},
          _args: any,
          context: any,
          _info: any
        ) {
          // Two ways in, because the metadata grew a media id only after
          // ~80 patches had already been published with nothing but a url.
          //
          // 1. imageId, written by the page settings form. Media nodes are
          //    looked up globally by id and NOT through the page's own
          //    `mediaNodes` field: a card grid renders the metadata of other
          //    pages, so page-scoped resolution could never reach them.
          // 2. image, when the address is one the media library handed out.
          //    Measured on netsnek.com: 28 of 218 pages with a metadata
          //    image already point at a media library url, because the
          //    editor did pick from the library and only the address
          //    survived. Those get the optimised path with no data change.
          let mediaNode: {node?: string} | null = null

          if (source.imageId) {
            mediaNode = context.nodeModel.getNodeById({
              id: source.imageId,
              type: 'MediaNode'
            })
          }

          if (!mediaNode && source.image) {
            // The same file can be behind several media nodes (one per page
            // when it is used by Field.Image on localized pages), and they
            // all link the same File, so the first match is as good as any.
            mediaNode = await context.nodeModel.findOne({
              type: 'MediaNode',
              query: {
                filter: {
                  url: {
                    eq: source.image
                  }
                }
              }
            })
          }

          if (!mediaNode?.node) {
            return null
          }

          const file = context.nodeModel.getNodeById({
            id: mediaNode.node,
            type: 'File'
          })

          // A File node can outlive its download: the media host is a
          // gateway in front of Telegram, and a build whose cache was
          // cleared mid-flight leaves nodes whose cached file is gone. Handing
          // such a File to childImageSharp kills the whole build with a
          // SharpError, which is a terrible way for a decorative preview
          // image to fail. Degrade to null instead and let the consumer fall
          // back to the address, which is the shape the page had anyway.
          if (file?.absolutePath && !fs.existsSync(file.absolutePath)) {
            console.warn(
              `[gatsby-source-jaen] media file for page metadata image is missing from the cache, serving it unoptimised: ${file.absolutePath}`
            )

            return null
          }

          return file
        }
      }
    }
  })

  actions.createFieldExtension({
    name: 'mediaNodes',
    args: {},
    extend(_options: any, _prevFieldConfig: any) {
      return {
        args: {},
        async resolve(
          source: Node & {
            slug: string
            parentPage: string | null
          },
          _args: any,
          context: any,
          _info: any
        ) {
          const {entries} = await context.nodeModel.findAll({
            type: 'MediaNode',
            query: {
              filter: {
                jaenPageId: {
                  eq: source.id
                }
              }
            }
          })

          return entries
        }
      }
    }
  })
}
