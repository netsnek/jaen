import {Box, Flex, HStack, Icon} from '@chakra-ui/react'
import {FaPlus} from '@react-icons/all-files/fa/FaPlus'
import React from 'react'

import {Toolbar} from '../Toolbar'

import {Link} from '../../components/shared/Link'
import {JaenLogo} from '../shared/JaenLogo/JaenLogo'
import {MenuButton, MenuButtonProps} from '../shared/MenuButton/MenuButton'
import {
  Breadcrumbs,
  BreadcrumbsProps
} from './components/Breadcrumbs/Breadcrumbs'
import {DrawerLeft, DrawerLeftProps} from './components/DrawerLeft/DrawerLeft'
import {
  DrawerRight,
  DrawerRightProps
} from './components/DrawerRight/DrawerRight'

export interface JaenFrameProps {
  logo?: JSX.Element
  navigation: {
    isStickyDisabled?: boolean
    app: {
      navigationGroups: DrawerLeftProps['navigationGroups']
      version: DrawerLeftProps['version']
      logo: DrawerLeftProps['logo']
    }
    user: {
      user: DrawerRightProps['user']
      navigationGroups: DrawerRightProps['navigationGroups']
      isBadgeVisible: DrawerRightProps['isBadgeVisible']
    }
    addMenu: {
      items: MenuButtonProps['items']
    }
    breadcrumbs: {
      links: BreadcrumbsProps['links']
    }
  }
}

/**
 * The bar across the top of every CMS surface.
 *
 * `id="coco"` is load bearing, not decoration. The provider mounts as
 * `<ChakraProvider cssVarsRoot="#coco">`, so every Chakra custom property is
 * emitted onto that selector rather than onto `:root`. The frame renders as a
 * sibling of the page layout, which owns the only other `#coco`, so without
 * its own the header sits outside the variable scope entirely: `bg.subtle`,
 * `border.emphasized` and `brand.500` all resolve against nothing, and the
 * children that inherit from here go with it. That is what happened when this
 * header was rewritten without the id, and why the colours ended up written
 * out by hand.
 */
export const JaenFrame: React.FC<JaenFrameProps> = React.memo(props => {
  return (
    <HStack
      id="coco"
      as="header"
      bg="bg.subtle"
      {...(!props.navigation.isStickyDisabled && {
        pos: 'sticky',
        top: '0',
        zIndex: 'sticky',
        transition: 'top 0.3s'
      })}
      h="16"
      px="16px"
      borderBottom="1px"
      borderColor="border.emphasized"
      backdropBlur={8}
      justifyContent="space-between"
      zIndex="sticky">
      <HStack spacing="5" w="full" h="full">
        <HStack
          h="full"
          spacing="4"
          w={{
            base: '24',
            md: 'full'
          }}>
          <DrawerLeft
            navigationGroups={props.navigation.app.navigationGroups}
            version={props.navigation.app.version}
            logo={props.navigation.app.logo}
          />

          <Flex
            maxW="12rem"
            h="full"
            display={{
              base: 'none',
              md: 'block'
            }}>
            <Link
              to="/"
              textDecoration="none"
              sx={{
                _before: {
                  content: 'none'
                }
              }}>
              {props.logo || <JaenLogo />}
            </Link>
          </Flex>

          <Box
            display={{
              base: 'none',
              md: 'block'
            }}>
            <Breadcrumbs links={props.navigation.breadcrumbs.links} />
          </Box>
        </HStack>

        {/* The same logo again, centred, for the widths where the left group
            collapses to the drawer button alone. */}
        <Flex mx="auto" alignItems="center" h="full">
          <Box
            h="full"
            maxW="12rem"
            display={{
              base: 'block',
              md: 'none'
            }}>
            <Link
              to="/"
              textDecoration="none"
              sx={{
                _before: {
                  content: 'none'
                }
              }}>
              {props.logo || <JaenLogo h="full" w="auto" />}
            </Link>
          </Box>
        </Flex>

        <HStack
          spacing={4}
          w={{
            base: '24',
            md: 'full'
          }}
          h="full"
          justifyContent="end">
          <Toolbar />

          <MenuButton
            display={{
              base: 'none',
              md: 'flex'
            }}
            leftIcon={<Icon as={FaPlus} color="brand.500" />}
            variant="outline"
            items={props.navigation.addMenu.items}
          />

          <DrawerRight
            user={props.navigation.user.user}
            navigationGroups={props.navigation.user.navigationGroups}
            isBadgeVisible={props.navigation.user.isBadgeVisible}
          />
        </HStack>
      </HStack>
    </HStack>
  )
})

export default JaenFrame
