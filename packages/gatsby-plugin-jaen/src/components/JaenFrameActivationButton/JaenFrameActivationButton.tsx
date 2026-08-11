import {
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  StackSeparator
} from '@chakra-ui/react'
import {FaEllipsisH} from '@react-icons/all-files/fa/FaEllipsisH'
import {FaSignInAlt} from '@react-icons/all-files/fa/FaSignInAlt'

import {JaenFullLogo} from '../shared/JaenLogo/JaenLogo'
import {Link} from '../shared/Link/Link'
import {MenuButton} from '../shared/MenuButton/MenuButton'

export interface JaenFrameActivationButtonProps {}

export const JaenFrameActivationButton: React.FC<
  JaenFrameActivationButtonProps
> = () => {
  return (
    <>
      <HStack
        pos="fixed"
        bottom="5"
        left="50%"
        transform="translateX(-50%)"
        bg="bg.surface"
        p="2"
        rounded="full"
        separator={<StackSeparator />}>
        {/* Link types its props as `any`, so leftIcon would have gone through
            to the DOM unnoticed and the icon would simply have stopped
            rendering. As a child it sits where v2 drew it. */}
        <Link as={Button} to="/jaen" variant="ghost" rounded="full" size="sm">
          <Icon asChild>
            <FaSignInAlt />
          </Icon>
          Log in to edit
        </Link>
        {/* v2 suppressed MenuButton's default caret here by overriding
            rightIcon with undefined. v3 has no such prop, so this trigger
            depends on MenuButton adding no caret of its own behind the
            children it is given. */}
        <MenuButton
          variant="ghost"
          rounded="full"
          menuPlacement="top-end"
          items={{
            login: {
              label: 'Login',
              icon: FaSignInAlt
            }
          }}
          renderItems={items => {
            return (
              <Flex flexDirection="column" alignItems="center" p={4}>
                <JaenFullLogo width="full" height={8} />
                <Text mt={2} textAlign="center">
                  Welcome to Jaen!
                </Text>

                {items}
              </Flex>
            )
          }}>
          <Icon display="block" asChild>
            <FaEllipsisH />
          </Icon>
        </MenuButton>
      </HStack>
    </>
  )
}
