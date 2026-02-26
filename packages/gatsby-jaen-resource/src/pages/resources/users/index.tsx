import {PageConfig} from 'jaen'

import {FaPlus} from '@react-icons/all-files/fa/FaPlus'
import {FaCheckCircle} from '@react-icons/all-files/fa/FaCheckCircle'
import {FaEdit} from '@react-icons/all-files/fa/FaEdit'

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Skeleton,
  SkeletonCircle,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react'
import {graphql, Link as GatsbyLink} from 'gatsby'
import React from 'react'

import {useForm} from 'react-hook-form'

import {useUsers, useUsersByRole} from '../../../hooks'
import type {UserCreateInput} from '../../../hooks'

const Page: React.FC = () => {
  const [roleFilter, setRoleFilter] =
    React.useState<'all' | 'driver' | 'customer' | 'admin'>('all')

  const {
    users: allUsers,
    isLoading: isLoadingAll
  } = useUsers()

  const {
    users: roleUsers,
    isLoading: isLoadingRole
  } = useUsersByRole(
    roleFilter === 'driver'
      ? 'limosen:driver'
      : roleFilter === 'customer'
        ? 'limosen:customer'
        : roleFilter === 'admin'
          ? 'jaen:admin'
          : ''
  )

  const users = roleFilter === 'all' ? allUsers : roleUsers
  const isLoading = roleFilter === 'all' ? isLoadingAll : isLoadingRole

  const isMobile = useBreakpointValue({base: true, md: false}) ?? true

  // keep newest users at top
  const sortedUsers = React.useMemo(
    () => [...users].reverse(),
    [users]
  )

  const renderRoleFilterControl = () => {
    if (isMobile) {
      return (
        <FormControl maxW="220px">
          <Select
            size="sm"
            value={roleFilter}
            onChange={e =>
              setRoleFilter(e.target.value as typeof roleFilter)
            }>
            <option value="all">All</option>
            <option value="driver">Drivers</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </Select>
        </FormControl>
      )
    }

    return (
      <ButtonGroup size="sm" variant="outline">
        <Button
          isActive={roleFilter === 'all'}
          onClick={() => setRoleFilter('all')}>
          All
        </Button>
        <Button
          isActive={roleFilter === 'driver'}
          onClick={() => setRoleFilter('driver')}>
          Drivers
        </Button>
        <Button
          isActive={roleFilter === 'customer'}
          onClick={() => setRoleFilter('customer')}>
          Customers
        </Button>
        <Button
          isActive={roleFilter === 'admin'}
          onClick={() => setRoleFilter('admin')}>
          Admins
        </Button>
      </ButtonGroup>
    )
  }

  return (
    <>
      <Stack spacing={4}>
        <Heading size="md">User ({users.length})</Heading>

        <Stack
          spacing={3}
          direction={{base: 'column', md: 'row'}}
          justify="space-between"
          align={{base: 'flex-start', md: 'center'}}>
          {renderRoleFilterControl()}
          <AddUserControl />
        </Stack>

        {/* Mobile: card list */}
        <Stack spacing={3} display={{base: 'flex', md: 'none'}}>
          {isLoading &&
            [...Array(3)].map((_, idx) => (
              <Box
                key={idx}
                borderWidth="1px"
                borderRadius="lg"
                p={3}>
                <HStack spacing={3} mb={2}>
                  <SkeletonCircle size="10" />
                  <Stack spacing={1} flex="1">
                    <Skeleton h="3" w="60%" />
                    <Skeleton h="3" w="80%" />
                  </Stack>
                </HStack>
                <Skeleton h="3" w="40%" mb={1} />
                <Skeleton h="3" w="50%" />
              </Box>
            ))}

          {!isLoading &&
            sortedUsers.map(user => {
              // derive role labels for mobile card from { id, description }
              const roleLabels =
                user.roles?.map(role => {
                  if (role.id === 'limosen:driver') return 'Driver'
                  if (role.id === 'limosen:customer') return 'Customer'
                  if (role.id === 'jaen:admin') return 'Admin'
                  return role.description ?? role.id
                }) ?? []

              const hasRoles = roleLabels.length > 0

              return (
                <Box
                  key={user.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={3}>
                  <HStack spacing={3} align="flex-start" mb={2}>
                    <Avatar
                      size="sm"
                      name={user.username}
                      src={user.details?.avatarURL}
                    />
                    <Stack spacing={0} flex="1">
                      <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
                        {user.details?.firstName || user.details?.lastName
                          ? `${user.details?.firstName ?? ''} ${
                              user.details?.lastName ?? ''
                            }`.trim()
                          : user.username || '—'}
                      </Text>
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {user.primaryEmailAddress || '—'}
                      </Text>
                    </Stack>
                    <IconButton
                      as={GatsbyLink}
                      aria-label="Edit"
                      icon={<Icon as={FaEdit} />}
                      size="sm"
                      variant="outline"
                      to={user.id}
                    />
                  </HStack>

                  <Stack spacing={1} fontSize="xs" color="gray.600">
                    <Text>
                      <strong>Username:</strong> {user.username || '—'}
                    </Text>
                    <Text>
                      <strong>Created:</strong>{' '}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('de-AT')
                        : '—'}
                    </Text>
                    <HStack spacing={3} pt={1}>
                      <HStack spacing={1}>
                        {user.isActive && (
                          <Icon as={FaCheckCircle} boxSize={3} />
                        )}
                        <Text>Active</Text>
                      </HStack>

                      {/* For non-admins, show their roles instead of the literal "Admin" label */}
                      {(user.isAdmin || hasRoles) && (
                        <HStack spacing={1}>
                          <Icon as={FaCheckCircle} boxSize={3} />
                          <Text>
                            {user.isAdmin
                              ? 'Admin'
                              : roleLabels.join(', ')}
                          </Text>
                        </HStack>
                      )}
                    </HStack>
                  </Stack>
                </Box>
              )
            })}
        </Stack>

        {/* Desktop: table view */}
        <Table display={{base: 'none', md: 'table'}}>
          <Thead position="sticky" top={0} zIndex={1} borderColor="black">
            <Tr my=".8rem">
              <Th></Th>
              <Th>E-Mail Address</Th>
              <Th>Username</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Created at</Th>
              <Th>Active</Th>
              <Th>Admin</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading &&
              [...Array(3)].map((_, index) => (
                <Tr key={index}>
                  <Td>
                    <SkeletonCircle size="10" isLoaded={!isLoading} />
                  </Td>
                  <Td>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      isLoaded={!isLoading}>
                      <Text fontSize="sm">john.doe@snek.at</Text>
                    </Skeleton>
                  </Td>
                  <Td>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      isLoaded={!isLoading}>
                      <Text fontSize="sm">john.doe</Text>
                    </Skeleton>
                  </Td>
                  <Td>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      isLoaded={!isLoading}>
                      <Text fontSize="sm">John</Text>
                    </Skeleton>
                  </Td>
                  <Td>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      isLoaded={!isLoading}>
                      <Text fontSize="sm">Doe</Text>
                    </Skeleton>
                  </Td>
                  <Td>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      isLoaded={!isLoading}>
                      <Text fontSize="sm">Tue Jun 27 2023</Text>
                    </Skeleton>
                  </Td>
                  <Td>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      isLoaded={!isLoading}>
                      <Icon as={FaCheckCircle} />
                    </Skeleton>
                  </Td>
                  <Td>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      isLoaded={!isLoading}>
                      <Icon as={FaCheckCircle} />
                    </Skeleton>
                  </Td>
                  <Td>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      isLoaded={!isLoading}>
                      <IconButton
                        as={GatsbyLink}
                        aria-label="Edit"
                        icon={<Icon as={FaEdit} />}
                        to={`/cms/user/`}
                      />
                    </Skeleton>
                  </Td>
                </Tr>
              ))}

            {!isLoading &&
              sortedUsers.map(user => (
                <Tr key={user.id}>
                  <Td>
                    <Avatar
                      size="sm"
                      name={user.username}
                      src={user.details?.avatarURL}
                    />
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {user.primaryEmailAddress || '—'}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">{user.username || '—'}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {user.details?.firstName || '—'}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {user.details?.lastName || '—'}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {user.createdAt
                        ? new Date(user.createdAt).toDateString()
                        : '—'}
                    </Text>
                  </Td>
                  <Td>
                    {user.isActive ? <Icon as={FaCheckCircle} /> : null}
                  </Td>
                  <Td>
                    {user.isAdmin ? <Icon as={FaCheckCircle} /> : null}
                  </Td>
                  <Td textAlign={'right'}>
                    <IconButton
                      as={GatsbyLink}
                      aria-label="Edit"
                      icon={<Icon as={FaEdit} />}
                      to={user.id}
                    />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Stack>
    </>
  )
}

const PasswordInput = React.forwardRef<HTMLInputElement, any>(
  ({register, ...props}, ref) => {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
      <InputGroup size="md">
        <Input
          autoComplete="new-password"
          ref={ref}
          pr="4.5rem"
          type={show ? 'text' : 'password'}
          {...props}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
    )
  }
)

const AddUserControl = () => {
  const {isOpen, onOpen, onClose} = useDisclosure()

  const {addUser} = useUsers()

  const initialRef = React.useRef<HTMLInputElement | null>(null)

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: {errors, isSubmitting, isDirty, isValid}
  } = useForm<UserCreateInput>({})

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: UserCreateInput) => {
    const ok = await addUser(values)

    if (ok) {
      handleClose()
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Add a user</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.emailAddress}>
                <FormLabel>E-Mail</FormLabel>
                <Input
                  placeholder="max.mustermann@snek.at"
                  type="email"
                  {...register('emailAddress', {
                    required: 'This is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.emailAddress?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  placeholder="max.mustermann"
                  {...register('username', {
                    required: 'This is required'
                  })}
                />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
              </FormControl>

              <Stack direction={'row'}>
                <Flex>
                  <FormControl mt={4} isInvalid={!!errors.details?.firstName}>
                    <FormLabel>Firstname</FormLabel>
                    <Input
                      placeholder="Max"
                      {...register('details.firstName')}
                    />
                    <FormErrorMessage>
                      {errors.details?.firstName?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>

                <Flex>
                  <FormControl mt={4} isInvalid={!!errors.details?.lastName}>
                    <FormLabel>Lastname</FormLabel>
                    <Input
                      placeholder="Mustermann"
                      {...register('details.lastName')}
                    />
                    <FormErrorMessage>
                      {errors.details?.lastName?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
              </Stack>

              <FormControl mt={4} isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <PasswordInput
                  {...register('password', {
                    required: 'This is required'
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <ButtonGroup isDisabled={!isDirty}>
                <Button type="submit" isLoading={isSubmitting}>
                  Create
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Button
        leftIcon={<Icon as={FaPlus} />}
        size="sm"
        onClick={onOpen}>
        Add User
      </Button>
    </>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: 'User',
  icon: 'FaUsersCog',
  menu: {
    type: 'app',
    group: 'resource',
    groupLabel: 'Resource',
    order: 500
  },
  layout: {
    name: 'jaen'
  },
  breadcrumbs: [
    {
      label: 'Resource',
      path: '/resources/'
    },
    {
      label: 'Users',
      path: '/resources/users/'
    }
  ],
  auth: {
    isRequired: true,
    isAdminRequired: true
  }
}

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`

export {Head} from 'jaen'
