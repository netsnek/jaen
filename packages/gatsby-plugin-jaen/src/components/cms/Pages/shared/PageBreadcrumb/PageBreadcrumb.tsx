import {Breadcrumb} from '@chakra-ui/react'
import {Fragment, useEffect, useState} from 'react'

import {TreeNode} from '../../components/PageVisualizer'
import {Link} from '../../../../shared/Link'

export interface PageBreadcrumbProps {
  tree: Array<TreeNode>
  activePageId: string
}

export const PageBreadcrumb: React.FC<PageBreadcrumbProps> = props => {
  const [treePath, setTreePath] = useState<
    Array<{
      id: string
      label: string
    }>
  >([])

  useEffect(() => {
    const path: Array<{
      id: string
      label: string
    }> = []

    const findPath = (tree: Array<TreeNode>, id: string) => {
      for (const node of tree) {
        if (node.id === id) {
          path.push({
            id: node.id,
            label: node.label
          })
          return true
        }

        if (node.children) {
          if (findPath(node.children, id)) {
            path.push({
              id: node.id,
              label: node.label
            })
            return true
          }
        }
      }

      return false
    }

    findPath(props.tree, props.activePageId)

    // reverse path
    path.reverse()

    setTreePath(path)
  }, [props.tree, props.activePageId])

  return (
    <Breadcrumb.Root color="fg.muted">
      <Breadcrumb.List>
        {/*
          v2's <Breadcrumb separator="/"> cloned a separator into every item but
          the last, and isCurrentPage swapped the anchor for a
          <span aria-current="page">. v3 does neither on its own, so both are
          spelled out: the separator carries the "/" because v3 would otherwise
          draw a chevron, and CurrentLink is that span. The `to` v2 also left on
          the span was a dead attribute and is not carried over.
        */}
        {treePath.map((item, index) => {
          const isCurrentPage = index === treePath.length - 1

          return (
            <Fragment key={item.id}>
              <Breadcrumb.Item>
                {isCurrentPage ? (
                  <Breadcrumb.CurrentLink>{item.label}</Breadcrumb.CurrentLink>
                ) : (
                  <Breadcrumb.Link asChild>
                    <Link to={`#${btoa(item.id)}`}>{item.label}</Link>
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>

              {!isCurrentPage && <Breadcrumb.Separator>/</Breadcrumb.Separator>}
            </Fragment>
          )
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
