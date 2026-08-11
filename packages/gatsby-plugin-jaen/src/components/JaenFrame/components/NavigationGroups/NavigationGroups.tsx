import {
  Button,
  Icon,
  List,
  ListItem,
  Spinner,
  Stack,
  StackDivider,
  Text
} from '@chakra-ui/react'
import {useLocation} from '@reach/router'

import {Link} from '../../../shared/Link/Link'

export interface NavigationItem {
  /** A component, because the frame slice resolves these by dynamic import. */
  icon: React.ComponentType
  label: string
  onClick?: () => void
  path?: string
  isLoading?: boolean
  order?: number
}

export interface NavigationGroup {
  label?: string
  items: Record<string, NavigationItem>
}

export interface NavigationGroupsProps {
  groups: Record<string, NavigationGroup>
  onClick?: () => void
}

export const NavigationGroups: React.FC<NavigationGroupsProps> = ({
  groups,
  onClick
}) => {
  const location = useLocation()

  return (
    <Stack divider={<StackDivider borderColor="border.default" />}>
      {Object.entries(groups).map(([groupKey, group]) => {
        return (
          <Stack key={groupKey}>
            {group.label && (
              <Text px="1" fontWeight="semibold" fontSize="sm" color="fg.muted">
                {group.label}
              </Text>
            )}
            <List>
              {Object.entries(group.items)
                // `order` came in with the Tailwind version and the frame
                // slice sets it on every item, so the groups would shuffle
                // without it.
                .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
                .map(([itemKey, item]) => {
                  const isActive = location.pathname === item.path

                  return (
                    <ListItem key={itemKey}>
                      <Link
                        as={Button}
                        to={item.path}
                        // The shared Link drops the anchor when disabled, so
                        // the entry you are already on reads as a button that
                        // does nothing rather than a link back to itself.
                        isDisabled={isActive || item.isLoading}
                        bg={isActive ? 'bg.muted' : undefined}
                        leftIcon={
                          item.isLoading ? (
                            <Spinner mr="2" size="sm" />
                          ) : (
                            <Icon
                              as={item.icon}
                              fontSize="lg"
                              mr="2"
                              color="brand.500"
                            />
                          )
                        }
                        variant="ghost"
                        w="full"
                        px="2"
                        justifyContent="flex-start"
                        fontWeight="medium"
                        fontSize="sm"
                        onClick={() => {
                          item.onClick?.()

                          onClick?.()
                        }}>
                        {item.label}
                      </Link>
                    </ListItem>
                  )
                })}
            </List>
          </Stack>
        )
      })}
    </Stack>
  )
}
