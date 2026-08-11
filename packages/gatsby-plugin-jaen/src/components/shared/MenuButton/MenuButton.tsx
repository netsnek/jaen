import {
  As,
  Box,
  Button,
  ButtonProps,
  Icon,
  Menu,
  MenuProps,
  Portal
} from '@chakra-ui/react'
import {FaCaretDown} from '@react-icons/all-files/fa/FaCaretDown'
import {Link} from '../Link/Link'

export interface MenuItem {
  icon?: As
  label: string
  path?: string
  onClick?: () => void
  divider?: boolean
}

export interface MenuButtonProps extends ButtonProps {
  items?: Record<string, MenuItem>
  renderItems?: (items: React.ReactNode) => React.ReactNode
  menuPlacement?: MenuProps['placement']
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  items = {},
  renderItems,
  menuPlacement,
  ...buttonProps
}) => {
  const rendredItems = Object.entries(items).map(([key, value]) => {
    return (
      <Box key={key} mx="2">
        <ChakraMenuItem
          as={Link}
          variant="ghost"
          icon={
            value.icon ? (
              <Icon color="brand.500" asChild>
                <value.icon />
              </Icon>
            ) : undefined
          }
          onClick={value.onClick}
          to={value.path || '#'}>
          {value.label}
        </ChakraMenuItem>
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
      <ChakraMenuButton
        as={Button}
        rightIcon={
          <Icon asChild>
            <FaCaretDown />
          </Icon>
        }
        size="sm"
        variant="outline"
        {...buttonProps}
      />
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
