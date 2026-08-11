import {
  Box,
  Button,
  ButtonProps,
  Icon,
  Menu,
  MenuRootProps,
  Portal
} from '@chakra-ui/react'
import {FaCaretDown} from '@react-icons/all-files/fa/FaCaretDown'
import {Link} from '../Link/Link'

export interface MenuItem {
  icon?: React.ElementType
  label: string
  path?: string
  onClick?: () => void
  divider?: boolean
}

export interface MenuButtonProps extends ButtonProps {
  items?: Record<string, MenuItem>
  renderItems?: (items: React.ReactNode) => React.ReactNode
  menuPlacement?: NonNullable<MenuRootProps['positioning']>['placement']
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  items = {},
  renderItems,
  menuPlacement,
  children,
  ...buttonProps
}) => {
  const rendredItems = Object.entries(items).map(([key, value]) => {
    return (
      <Box key={key} mx="2">
        {/*
          v2's MenuItem took the anchor through `as` and the icon through an
          `icon` prop that wrapped it in its own spacer span. v3 keeps neither:
          the item hands its props to the child through asChild, and the icon is
          just the first child, spaced by the item's own gap. `value` is
          required in v3 and only feeds typeahead, so it is the record key.
        */}
        <Menu.Item asChild value={key} onClick={value.onClick}>
          <Link variant="ghost" to={value.path || '#'}>
            {value.icon && (
              <Icon color="brand.500" asChild>
                <value.icon />
              </Icon>
            )}
            {value.label}
          </Link>
        </Menu.Item>
        {value.divider && <Menu.Separator borderColor="border.emphasized" />}
      </Box>
    )
  })

  if (rendredItems.length === 0) return null

  return (
    <Menu.Root
      lazyMount
      unmountOnExit
      positioning={{
        placement: menuPlacement
      }}>
      <Menu.Trigger asChild>
        <Button size="sm" variant="outline" {...buttonProps}>
          {children}
          <Icon asChild>
            <FaCaretDown />
          </Icon>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {renderItems ? renderItems(rendredItems) : rendredItems}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
