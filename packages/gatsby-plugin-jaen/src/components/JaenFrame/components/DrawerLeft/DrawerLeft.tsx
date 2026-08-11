import {
  Box,
  Drawer,
  HStack,
  Icon,
  IconButton,
  Text,
  useDisclosure,
  Portal
} from '@chakra-ui/react'
import {useRef} from 'react'
import {FaBars} from '@react-icons/all-files/fa/FaBars'
import {JaenFullLogo} from '../../../shared/JaenLogo/JaenLogo'
import {
  NavigationGroups,
  NavigationGroupsProps
} from '../NavigationGroups/index'

export interface DrawerLeftProps {
  navigationGroups: NavigationGroupsProps['groups']
  logo?: JSX.Element
  version: string
}

export const DrawerLeft: React.FC<DrawerLeftProps> = ({
  navigationGroups,
  logo,
  version
}) => {
  const {open, onClose, onToggle} = useDisclosure()

  const initialFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <IconButton
        aria-label="Open main menu"
        size="sm"
        onClick={onToggle}
        variant="outline">
        <Icon fontSize="lg" color="brand.500 !important" asChild>
          <FaBars />
        </Icon>
      </IconButton>
      <Drawer.Root
        placement="start"
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

          {/* A drawer renders through a portal, so it lands outside the header
              that carries the Chakra variable root. containerProps puts the id
              on the portal's own container, which is what media-modal.tsx and
              the notifications toast already do. */}
          <Drawer.Positioner>
            <Drawer.Content
              borderRightRadius="xl"
              containerProps={{id: 'momo'}}>
              <Drawer.Header p="4">
                <HStack justifyContent="space-between">
                  <Box h="full" maxW="12rem">
                    {logo || <JaenFullLogo />}
                  </Box>
                  <Drawer.CloseTrigger
                    ref={initialFocusRef}
                    pos="static"
                    onClick={onClose}
                  />
                </HStack>
              </Drawer.Header>
              <Drawer.Body p="4" display="flex" flexDirection="column">
                <NavigationGroups groups={navigationGroups} onClick={onClose} />
              </Drawer.Body>
              <Drawer.Footer display="flex" justifyContent="space-between">
                <JaenFullLogo h="8" w="auto" cursor="pointer" />

                {/* fg.muted, not muted: the old code named a token that has never
                    existed in this theme, so the version string rendered in the
                    inherited colour rather than the quiet one it was meant to
                    have. */}
                <Text fontSize="xs" color="fg.muted">
                  {version}
                </Text>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  )
}
