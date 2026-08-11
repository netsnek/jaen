import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Text,
  useDisclosure
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
  const {isOpen, onClose, onToggle} = useDisclosure()

  const initialFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <IconButton
        aria-label="Open main menu"
        icon={<Icon as={FaBars} fontSize="lg" color="brand.500 !important" />}
        size="sm"
        onClick={onToggle}
        variant="outline"
      />
      <Drawer
        placement="left"
        size="xs"
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialFocusRef}>
        <DrawerOverlay bg="rgba(0,0,0,0.1)" />

        {/* A drawer renders through a portal, so it lands outside the header
            that carries the Chakra variable root. containerProps puts the id
            on the portal's own container, which is what media-modal.tsx and
            the notifications toast already do. */}
        <DrawerContent borderRightRadius="xl" containerProps={{id: 'coco'}}>
          <DrawerHeader p="4">
            <HStack justifyContent="space-between">
              <Box h="full" maxW="12rem">
                {logo || <JaenFullLogo />}
              </Box>
              <DrawerCloseButton
                ref={initialFocusRef}
                pos="static"
                onClick={onClose}
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody p="4" display="flex" flexDirection="column">
            <NavigationGroups groups={navigationGroups} onClick={onClose} />
          </DrawerBody>
          <DrawerFooter display="flex" justifyContent="space-between">
            <JaenFullLogo h="8" w="auto" cursor="pointer" />

            {/* fg.muted, not muted: the old code named a token that has never
                existed in this theme, so the version string rendered in the
                inherited colour rather than the quiet one it was meant to
                have. */}
            <Text fontSize="xs" color="fg.muted">
              {version}
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
