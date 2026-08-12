import {useLocation} from '@reach/router'
import {navigate, PageProps} from 'gatsby'

import {PageConfig, useNotificationsContext} from 'jaen'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import {FaArrowRight} from '@react-icons/all-files/fa/FaArrowRight'
import {FaEdit} from '@react-icons/all-files/fa/FaEdit'
import {FaTrash} from '@react-icons/all-files/fa/FaTrash'
import {FaClone} from '@react-icons/all-files/fa/FaClone'

import {Pages} from '../../../components/cms/Pages/Pages'
import {
  CMSManagement,
  useCMSManagement
} from '../../../connectors/cms-management'
import {intlText} from '../../../lib/intl'

const PagesPage: React.FC = () => {
  const intl = useIntl()
  const {toast, prompt, confirm} = useNotificationsContext()
  const manager = useCMSManagement()

  const [currentPageId, setCurrentPageId] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    // scroll to top
    window.scrollTo(0, 0)
  }, [currentPageId])

  const location = useLocation()

  useEffect(() => {
    try {
      const pageId = atob(location.hash.replace('#', ''))

      setCurrentPageId(pageId || undefined)
    } catch (e) {
      setCurrentPageId(undefined)
    }
  }, [location.hash])

  const currentPage = useMemo(() => {
    try {
      return manager.page(currentPageId)
    } catch {
      // Clear location hash if page is not found

      return manager.page()
    }
  }, [currentPageId, manager.page])

  // useEffect(() => {
  //  // check if location is
  // }, [currentPage, location.hash])

  const children = useMemo(() => {
    const pages = manager.pages(currentPage.id)

    return pages.map(p => {
      return {
        id: p.id,
        title:
          p.jaenPageMetadata.title ||
          intl.formatMessage({
            id: 'CmsPagesLabelsNoTitle',
            defaultMessage: 'No title'
          }),
        description:
          p.jaenPageMetadata.description ||
          intl.formatMessage({
            id: 'CmsPagesLabelsNoDescription',
            defaultMessage: 'No description'
          }),
        createdAt: p.createdAt,
        modifiedAt: p.modifiedAt
        // author: p.jaenPageMetadata.blogPost?.author
      }
    })
  }, [currentPage.id, manager.pages])

  const handleTreeSelect = useCallback(
    (id: string) => {
      setCurrentPageId(id || undefined)

      if (id) {
        navigate(`#${btoa(id)}`)
      } else {
        navigate('#')
      }
    },
    [manager]
  )

  // const parentPages = useMemo(() => {
  //   if (!currentPage.parentPage?.id) return {}

  //   const parentPage = manager.page(currentPage.parentPage.id)

  //   return {
  //     [currentPage.parentPage.id]: {
  //       label: parentPage.jaenPageMetadata?.title || parentPage.slug,
  //       templates: manager
  //         .templatesForPage(currentPage.parentPage.id)
  //         .reduce((acc, template) => {
  //           acc[template.id] = {
  //             label: template.label
  //           }

  //           return acc
  //         }, {} as {[key: string]: {label: string}})
  //     }
  //   }
  // }, [currentPage.parentPage?.id, manager])

  const parentPages = useMemo(() => {
    const pages = manager.pages()

    // use the manager.tree to blacklist all children of current page
    const blacklist: string[] = []

    const recursiveBlacklist = (pageId?: string) => {
      if (!pageId) return

      const page = manager.page(pageId)

      if (!page) return

      for (const child of page.childPages) {
        blacklist.push(child.id)
        recursiveBlacklist(child.id)
      }
    }

    recursiveBlacklist(currentPage.id)

    const _parentPages: {
      [pageId: string]: {
        label: string
        templates: {
          [templateId: string]: {
            label: string
          }
        }
      }
    } = {}

    for (const page of pages) {
      // skip if page is current page
      if (page.id === currentPage.id) {
        continue
      }

      // skip if page is in blacklist
      if (blacklist.includes(page.id)) {
        continue
      }

      const pageTemplates = manager.templatesForPage(page.id)

      if (pageTemplates.length > 0) {
        // skip if pageTemplates do not contain current page template
        if (
          !pageTemplates.find(template => template.id === currentPage.template)
        ) {
          continue
        }

        _parentPages[page.id] = {
          label: page.jaenPageMetadata.title || page.slug,
          templates: pageTemplates.reduce(
            (acc, template) => {
              acc[template.id] = {
                label: template.label
              }

              return acc
            },
            {} as {[key: string]: {label: string}}
          )
        }
      }
    }

    return _parentPages
  }, [manager, currentPage])

  const updatePageChildsOrder = useCallback(
    (newOrder: string[]) => {
      manager.updatePage(currentPage.id, {
        childPagesOrder: newOrder
      })
    },
    [manager]
  )

  return (
    <Pages
      pageId={currentPage.id}
      form={{
        // Always disable slug because the slug can only be changed in the danger zone
        disableSlug: true,
        values: {
          title:
            currentPage.jaenPageMetadata?.title ||
            intl.formatMessage({
              id: 'CmsPagesLabelsNoTitle',
              defaultMessage: 'No title'
            }),
          image: {
            src: currentPage.jaenPageMetadata?.image,
            id: currentPage.jaenPageMetadata?.imageId
          },
          slug: currentPage.slug,
          template: currentPage.template,
          description:
            currentPage.jaenPageMetadata.description ||
            intl.formatMessage({
              id: 'CmsPagesLabelsNoDescription',
              defaultMessage: 'No description'
            }),
          parentPage: currentPage.parentPage?.id,
          isExcludedFromIndex: currentPage.excludedFromIndex,
          blogPost: currentPage.jaenPageMetadata.blogPost
        },
        parentPages,
        onSubmit: data => {
          manager.updatePage(currentPage.id, {
            slug: data.slug,
            template: data.template,
            parentPage: {
              id: data.parentPage
            },
            excludedFromIndex: data.isExcludedFromIndex,
            jaenPageMetadata: {
              title: data.title,
              image: data.image?.src,
              imageId: data.image?.id,
              description: data.description,
              blogPost: data.blogPost
            }
          })

          toast({
            title: intl.formatMessage({
              id: 'CmsPagesNotificationsUpdated',
              defaultMessage: 'Page updated'
            }),
            description: intl.formatMessage(
              {
                id: 'CmsPagesNotificationsUpdatedDescription',
                defaultMessage: 'Page {title} has been updated'
              },
              {title: data.title}
            ),
            status: 'success'
          })
        },
        path: manager.pagePath(currentPage.id),
        jaenTemplates: manager.templates
      }}
      children={children}
      onUpdateChildPagesOrder={updatePageChildsOrder}
      tree={manager.tree}
      onTreeSelect={handleTreeSelect}
      disableNewButton={manager.templatesForPage(currentPage.id).length === 0}
      dangerZoneActions={[
        {
          title: intl.formatMessage({
            id: 'CmsPagesActionsDuplicate',
            defaultMessage: 'Duplicate page'
          }),
          description: intl.formatMessage({
            id: 'CmsPagesDescriptionsDuplicate',
            defaultMessage: 'This will duplicate the page with its subpages.'
          }),
          buttonText: intl.formatMessage({
            id: 'CmsPagesActionsDuplicate',
            defaultMessage: 'Duplicate page'
          }),
          icon: FaClone,
          onClick: async () => {
            const slug = await prompt({
              title: intl.formatMessage({
                id: 'CmsPagesPromptsDuplicateTitle',
                defaultMessage: 'Duplicate page'
              }),
              message: intl.formatMessage({
                id: 'CmsPagesPromptsDuplicateMessage',
                defaultMessage:
                  'Please enter a new slug for the duplicated page. This will affect the path.'
              }),
              confirmText: intl.formatMessage({
                id: 'CmsPagesPromptsDuplicateConfirm',
                defaultMessage: 'Duplicate'
              }),
              cancelText: intl.formatMessage({
                id: 'CmsPagesPromptsDuplicateCancel',
                defaultMessage: 'Cancel'
              }),
              placeholder: intl.formatMessage(
                {
                  id: 'CmsPagesPromptsDuplicatePlaceholder',
                  defaultMessage: '{slug}-copy'
                },
                {slug: currentPage.slug}
              )
            })

            if (slug) {
              try {
                manager.clonePage(currentPage.id, slug)

                toast({
                  title: intl.formatMessage({
                    id: 'CmsPagesNotificationsDuplicated',
                    defaultMessage: 'Page duplicated'
                  }),
                  description: intl.formatMessage(
                    {
                      id: 'CmsPagesNotificationsDuplicatedDescription',
                      defaultMessage: 'Page {slug} has been duplicated'
                    },
                    {slug: currentPage.slug}
                  ),
                  status: 'success'
                })
              } catch (e) {
                toast({
                  title: intl.formatMessage({
                    id: 'CmsPagesNotificationsDuplicateFailed',
                    defaultMessage: 'Could not duplicate page'
                  }),
                  description: e.message,
                  status: 'error'
                })
              }
            }
          },
          isDisabled: !currentPage.template
        },
        {
          title: intl.formatMessage({
            id: 'CmsPagesActionsMove',
            defaultMessage: 'Move page'
          }),
          description: intl.formatMessage({
            id: 'CmsPagesDescriptionsMove',
            defaultMessage: 'This will move the page and all its subpages.'
          }),
          buttonText: intl.formatMessage({
            id: 'CmsPagesActionsMove',
            defaultMessage: 'Move page'
          }),
          icon: FaArrowRight,
          onClick: async () => {
            const options = Object.entries(parentPages).map(
              ([pageId, page]) => {
                return {
                  id: pageId,
                  label: page.label
                }
              }
            )

            const parentPageId = await prompt(
              {
                title: intl.formatMessage({
                  id: 'CmsPagesPromptsMoveTitle',
                  defaultMessage: 'Move page'
                }),
                message: intl.formatMessage({
                  id: 'CmsPagesPromptsMoveMessage',
                  defaultMessage: 'Please select a new parent page.'
                }),
                confirmText: intl.formatMessage({
                  id: 'CmsPagesPromptsMoveConfirm',
                  defaultMessage: 'Move'
                }),
                cancelText: intl.formatMessage({
                  id: 'CmsPagesPromptsMoveCancel',
                  defaultMessage: 'Cancel'
                }),
                options
              },
              currentPage.parentPage?.id
            )

            if (parentPageId) {
              try {
                manager.updatePage(currentPage.id, {
                  parentPage: {
                    id: parentPageId
                  }
                })

                toast({
                  title: intl.formatMessage({
                    id: 'CmsPagesNotificationsMoved',
                    defaultMessage: 'Page moved'
                  }),
                  description: intl.formatMessage(
                    {
                      id: 'CmsPagesNotificationsMovedDescription',
                      defaultMessage: 'Page {slug} has been moved'
                    },
                    {slug: currentPage.slug}
                  ),
                  status: 'success'
                })
              } catch (e) {
                toast({
                  title: intl.formatMessage({
                    id: 'CmsPagesNotificationsMoveFailed',
                    defaultMessage: 'Could not move page'
                  }),
                  description: e.message,
                  status: 'error'
                })
              }
            }
          },
          isDisabled: !currentPage.template
        },
        {
          title: intl.formatMessage({
            id: 'CmsPagesActionsUpdateSlug',
            defaultMessage: 'Update slug'
          }),
          description: intl.formatMessage({
            id: 'CmsPagesDescriptionsUpdateSlug',
            defaultMessage:
              'This will rename the slug and thus affects the path of the page and all its subpages.'
          }),
          buttonText: intl.formatMessage({
            id: 'CmsPagesActionsRenameSlug',
            defaultMessage: 'Rename slug'
          }),
          icon: FaEdit,
          onClick: async () => {
            const slug = await prompt({
              title: intl.formatMessage({
                id: 'CmsPagesPromptsRenameSlugTitle',
                defaultMessage: 'Rename slug'
              }),
              message: intl.formatMessage({
                id: 'CmsPagesPromptsRenameSlugMessage',
                defaultMessage:
                  'Please enter a new slug. This will affect the path.'
              }),
              confirmText: intl.formatMessage({
                id: 'CmsPagesPromptsRenameSlugConfirm',
                defaultMessage: 'Rename'
              }),
              cancelText: intl.formatMessage({
                id: 'CmsPagesPromptsRenameSlugCancel',
                defaultMessage: 'Cancel'
              }),
              placeholder: currentPage.slug
            })

            if (slug) {
              try {
                manager.updatePage(currentPage.id, {
                  slug
                })

                toast({
                  title: intl.formatMessage({
                    id: 'CmsPagesNotificationsSlugUpdated',
                    defaultMessage: 'Slug updated'
                  }),
                  description: intl.formatMessage(
                    {
                      id: 'CmsPagesNotificationsSlugUpdatedDescription',
                      defaultMessage: 'Slug has been updated to {slug}'
                    },
                    {slug}
                  ),
                  status: 'success'
                })
              } catch (e) {
                toast({
                  title: intl.formatMessage({
                    id: 'CmsPagesNotificationsSlugUpdateFailed',
                    defaultMessage: 'Could not update slug'
                  }),
                  description: e.message,
                  status: 'error'
                })
              }
            }
          },
          isDisabled: !currentPage.template
        },
        {
          title: intl.formatMessage({
            id: 'CmsPagesActionsDeleteThis',
            defaultMessage: 'Delete this page'
          }),
          description: intl.formatMessage({
            id: 'CmsPagesDescriptionsDelete',
            defaultMessage: 'This will delete the page and all its subpages.'
          }),
          buttonText: intl.formatMessage({
            id: 'CmsPagesActionsDelete',
            defaultMessage: 'Delete page'
          }),
          icon: FaTrash,
          onClick: async () => {
            const ok = await confirm({
              title: intl.formatMessage({
                id: 'CmsPagesPromptsDeleteTitle',
                defaultMessage: 'Delete page'
              }),
              message: intl.formatMessage({
                id: 'CmsPagesPromptsDeleteMessage',
                defaultMessage:
                  'Are you sure you want to delete this page and all its subpages?'
              })
            })

            if (ok) {
              manager.removePage(currentPage.id)

              toast({
                title: intl.formatMessage({
                  id: 'CmsPagesNotificationsDeleted',
                  defaultMessage: 'Page deleted'
                }),
                description: intl.formatMessage(
                  {
                    id: 'CmsPagesNotificationsDeletedDescription',
                    defaultMessage: 'Page {slug} has been deleted'
                  },
                  {slug: currentPage.slug}
                ),
                status: 'success'
              })
            }

            setCurrentPageId(currentPage.parentPage?.id)
          },
          isDisabled: !currentPage.template
        }
      ]}
    />
  )
}

const Page: React.FC<PageProps> = () => {
  return (
    <CMSManagement>
      <PagesPage />
    </CMSManagement>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: intlText('CmsPagesTitle', 'Jaen CMS | Pages'),
  icon: 'FaSitemap',

  menu: {
    label: intlText('CmsPagesMenuLabel', 'Pages'),
    type: 'app',
    group: 'cms',
    order: 200
  },
  breadcrumbs: [
    {
      label: intlText('CmsLabelsRoot', 'CMS'),
      path: '/cms/'
    },
    {
      label: intlText('CmsPagesBreadcrumbsPages', 'Pages'),
      path: '/cms/pages/'
    }
  ],
  withoutJaenFrameStickyHeader: true,
  auth: {
    isAdminRequired: true
  },
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
