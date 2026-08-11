import {useColorMode} from 'jaen'
import {
  Avatar,
  AvatarBadge,
  Drawer,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  Portal
} from '@chakra-ui/react'
import {useRef} from 'react'
import {FaMoon} from '@react-icons/all-files/fa/FaMoon'
import {FaSun} from '@react-icons/all-files/fa/FaSun'

import {
  NavigationGroups,
  NavigationGroupsProps
} from '../NavigationGroups/index'

export interface DrawerRightProps {
  user: {
    username: string
    firstName?: string
    lastName?: string
    avatarURL?: string
  }
  navigationGroups: NavigationGroupsProps['groups']

  isBadgeVisible?: boolean
}

export const DrawerRight: React.FC<DrawerRightProps> = ({
  navigationGroups,
  user,
  isBadgeVisible
}) => {
  const {open, onClose, onToggle} = useDisclosure()

  const initialFocusRef = useRef<HTMLButtonElement>(null)

  const colorMode = useColorMode()

  return (
    <>
      {/* No fallback initials to compute: Chakra derives them from `name`,
          which is the same username the replaced code was splitting by hand. */}
      <Avatar.Root
        as="button"
        aria-label="Open user menu"
        p="0"
        m="0"
        size="sm"
        cursor="pointer"
        onClick={onToggle}>
        <Avatar.Fallback name={user.username} />
        <Avatar.Image src={user.avatarURL} />
        // TODO [BREAKING]: AvatarBadge removed. Migrate to Float + Circle
        pattern.// See https://chakra-ui.com/docs/components/avatar#badge//
        Original:{' '}
        <AvatarBadge
          boxSize="1.25em"
          bg="pink.500"
          visibility={isBadgeVisible ? 'visible' : 'hidden'}
        />
      </Avatar.Root>
      <Drawer.Root
        placement="end"
        size="xs"
        open={isOpen}
        initialFocusEl={() => initialFocusRef.current}
        onOpenChange={e => {
          if (!e.open) {
            onClose()
          }
        }}>
        <Portal>
          <Drawer.Backdrop bg="rgba(0,0,0,0.1)" />

          <Drawer.Positioner>
            <Drawer.Content borderLeftRadius="xl" containerProps={{id: 'momo'}}>
              <Drawer.Header p="4">
                <HStack justifyContent="space-between">
                  <Stack>
                    <HStack>
                      <Avatar.Root size="sm">
                        <Avatar.Fallback name={user.username} />
                        <Avatar.Image src={user.avatarURL} />
                      </Avatar.Root>
                      <Stack gap="0.5">
                        <Text fontSize="sm" fontWeight="bold" lineHeight="none">
                          {user.username}
                        </Text>
                        <Text fontSize="sm" color="fg.muted" lineHeight="none">
                          {user.firstName} {user.lastName}
                        </Text>
                      </Stack>
                    </HStack>
                  </Stack>

                  <Drawer.CloseTrigger
                    ref={initialFocusRef}
                    pos="static"
                    onClick={onClose}
                  />
                </HStack>
              </Drawer.Header>
              <Drawer.Body p="4" display="flex" flexDirection="column">
                <NavigationGroups groups={navigationGroups} onClick={onClose} />
                <Spacer />
              </Drawer.Body>

              {/* The colour-mode switch. It went missing with the rewrite, which
                  is why dark mode has been unreachable ever since even though the
                  theme carries a _dark value for every semantic token. */}
              <Drawer.Footer>
                <IconButton
                  size="sm"
                  variant="outline"
                  onClick={colorMode.toggleColorMode}
                  aria-label="Toggle color mode">
                  <Icon
                    as={colorMode.colorMode === 'light' ? FaSun : FaMoon}
                    color="brand.500"
                  />
                </IconButton>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  )
}
