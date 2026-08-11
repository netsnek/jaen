import {Breadcrumb, Button} from '@chakra-ui/react'
import {Link} from '../../../shared/Link/Link'

export interface BreadcrumbsProps {
  links: Array<{
    label: string
    path?: string
    onClick?: () => void
  }>
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({links}) => {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        {links.map((link, index) => {
          const isCurrentPage = index === links.length - 1

          return (
            <Breadcrumb.Item key={index}>
              {/* <Button
                variant="ghost"
                p="2"
                onClick={() => {
                  link.onClick?.()

                  // reload page if current page
                  if (isCurrentPage) {
                    window.location.reload()
                  }
                }}>
                <BreadcrumbLink
                  as={link.path ? Link : undefined}
                  to={link.path}
                  isCurrentPage={isCurrentPage}
                  fontWeight={isCurrentPage ? 'bold' : 'normal'}
                  textDecoration="none">
                  {link.label}
                </BreadcrumbLink>
              </Button> */}
              <Link
                as={Button}
                px="2"
                variant="ghost"
                to={link.path}
                onClick={link.onClick}
                aria-current={isCurrentPage ? 'page' : undefined}
                fontWeight={isCurrentPage ? 'bold' : 'normal'}
                textDecoration="none">
                {link.label}
              </Link>
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
