import {PageConfig} from 'jaen'

import {FaPlus} from '@react-icons/all-files/fa/FaPlus'
import {FaCheckCircle} from '@react-icons/all-files/fa/FaCheckCircle'
import {FaEdit} from '@react-icons/all-files/fa/FaEdit'

import {
  Button,
  ButtonGroup,
  CloseButton,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Skeleton,
  Stack,
  Table,
  Text,
  useDisclosure,
  Icon,
  SkeletonCircle,
  Avatar,
  Field,
  Dialog,
  Portal
} from '@chakra-ui/react'
import {graphql, Link as GatsbyLink} from 'gatsby'
import React from 'react'

import {Mutation} from '@snek-functions/origin/dist/schema.generated'

import {useForm} from 'react-hook-form'

import {useUsers} from '../../../hooks'

type UserCreate = Parameters<Mutation['userRegister']>[0]

const Page: React.FC = () => {
  //const { isAuthenticated, user } = useAuthenticationContext()

  const {users, isLoading} = useUsers()
  return (
    <>
      <Stack gap="4">
        <Heading size="md">User ({users.length})</Heading>

        <HStack gap="4" justifyContent="end">
          <AddUserControl />
        </HStack>

        <Table.Root>
          <Table.Header
            position="sticky"
            top={0}
            zIndex={1}
            borderColor="black">
            <Table.Row my=".8rem">
              <Table.ColumnHeader></Table.ColumnHeader>
              <Table.ColumnHeader>E-Mail Address</Table.ColumnHeader>
              <Table.ColumnHeader>Username</Table.ColumnHeader>
              <Table.ColumnHeader>First Name</Table.ColumnHeader>
              <Table.ColumnHeader>Last Name</Table.ColumnHeader>
              <Table.ColumnHeader>Created at</Table.ColumnHeader>
              <Table.ColumnHeader>Active</Table.ColumnHeader>
              <Table.ColumnHeader>Admin</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading &&
              // map with 5 rows to show loading
              [...Array(3)].map((_, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <SkeletonCircle size="10" loading={!!isLoading} />
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      loading={!!isLoading}>
                      <Text fontSize="sm">john.doe@snek.at</Text>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      loading={!!isLoading}>
                      <Text fontSize="sm">john.doe</Text>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      loading={!!isLoading}>
                      <Text fontSize="sm">John</Text>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      loading={!!isLoading}>
                      <Text fontSize="sm">Doe</Text>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      loading={!!isLoading}>
                      <Text fontSize="sm">Tue Jun 27 2023</Text>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      loading={!!isLoading}>
                      <Icon asChild>
                        <FaCheckCircle />
                      </Icon>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      loading={!!isLoading}>
                      <Icon asChild>
                        <FaCheckCircle />
                      </Icon>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton
                      w={'fit-content'}
                      h={'fit-content'}
                      loading={!!isLoading}>
                      <IconButton aria-label="Edit" asChild>
                        <GatsbyLink to={`/cms/user/`}>
                          <Icon asChild>
                            <FaEdit />
                          </Icon>
                        </GatsbyLink>
                      </IconButton>
                    </Skeleton>
                  </Table.Cell>
                </Table.Row>
              ))}

            {users
              .map(user => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name={user.username} />
                      <Avatar.Image src={user.details?.avatarURL} />
                    </Avatar.Root>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">{user.primaryEmailAddress}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">{user.username}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">{user.details?.firstName}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">{user.details?.lastName}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">
                      {new Date(user.createdAt).toDateString()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {user.isActive ? (
                      <Icon asChild>
                        <FaCheckCircle />
                      </Icon>
                    ) : null}
                  </Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <Icon asChild>
                        <FaCheckCircle />
                      </Icon>
                    ) : null}
                  </Table.Cell>
                  <Table.Cell textAlign={'right'}>
                    <IconButton aria-label="Edit" asChild>
                      <GatsbyLink to={user.id}>
                        <Icon asChild>
                          <FaEdit />
                        </Icon>
                      </GatsbyLink>
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))
              .reverse()}
          </Table.Body>
        </Table.Root>
      </Stack>
    </>
  )
}

const PasswordInput = React.forwardRef<HTMLInputElement, any>(
  ({register, ...props}, ref) => {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
      /**
       * The twin of the PasswordInput in ./[userId], which carries the
       * reasoning for `pe` over `pr`, for the endElement's px: 0, and for
       * dropping the group's size="md". The two render the same control, so
       * they have to move together.
       */
      <InputGroup
        endElementProps={{width: '4.5rem', px: '0'}}
        endElement={
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? 'Hide' : 'Show'}
          </Button>
        }>
        <Input
          autoComplete="new-password"
          ref={ref}
          pe="4.5rem"
          type={show ? 'text' : 'password'}
          {...props}
        />
      </InputGroup>
    )
  }
)

const AddUserControl = () => {
  const {open, onOpen, onClose} = useDisclosure()

  //const navigate = useNavigate()

  const {addUser} = useUsers()

  const initialRef = React.useRef<HTMLInputElement | null>(null)

  const {
    register,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting, isDirty}
  } = useForm<UserCreate['values']>({})

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: UserCreate['values']) => {
    const ok = await addUser(values)

    if (ok) {
      handleClose()
      //navigate(0)
    }
  }

  return (
    <>
      <Dialog.Root
        open={open}
        initialFocusEl={() => initialRef.current}
        onOpenChange={e => {
          if (!e.open) {
            handleClose()
          }
        }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Dialog.Header>Add a user</Dialog.Header>
                {/* Same as the accounts pages: v3's CloseTrigger draws nothing
                    of its own, so the X v2's ModalCloseButton carried has to be
                    handed to it, at the 32px and neutral hover v2 gave it. */}
                <Dialog.CloseTrigger asChild onClick={handleClose}>
                  <CloseButton size="xs" colorPalette="gray" />
                </Dialog.CloseTrigger>
                <Dialog.Body pb={6}>
                  <Field.Root invalid={!!errors.emailAddress}>
                    <Field.Label>E-Mail</Field.Label>
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
                    <Field.ErrorText>
                      {errors.emailAddress?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.username}>
                    <Field.Label>Username</Field.Label>
                    <Input
                      placeholder="max.mustermann"
                      {...register('username', {
                        required: 'This is required'
                      })}
                    />
                    <Field.ErrorText>
                      {errors.username?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  <Stack direction={'row'}>
                    <Flex>
                      <Field.Root mt={4} invalid={!!errors.details?.firstName}>
                        <Field.Label>Firstname</Field.Label>
                        <Input
                          placeholder="Max"
                          {...register('details.firstName')}
                        />
                        <Field.ErrorText>
                          {errors.details?.firstName?.message}
                        </Field.ErrorText>
                      </Field.Root>
                    </Flex>

                    <Flex>
                      <Field.Root mt={4} invalid={!!errors.details?.lastName}>
                        <Field.Label>Lastname</Field.Label>
                        <Input
                          placeholder="Mustermann"
                          {...register('details.lastName')}
                        />
                        <Field.ErrorText>
                          {errors.details?.lastName?.message}
                        </Field.ErrorText>
                      </Field.Root>
                    </Flex>
                  </Stack>

                  <Field.Root mt={4} invalid={!!errors.password}>
                    <Field.Label>Password</Field.Label>
                    <PasswordInput
                      {...register('password', {
                        required: 'This is required'
                      })}
                    />
                    <Field.ErrorText>
                      {errors.password?.message}
                    </Field.ErrorText>
                  </Field.Root>
                </Dialog.Body>

                <Dialog.Footer>
                  <ButtonGroup>
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isDirty}>
                      Create
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={!isDirty}>
                      Cancel
                    </Button>
                  </ButtonGroup>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Button onClick={onOpen}>
        <Icon asChild>
          <FaPlus />
        </Icon>
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
      path: '/resource/'
    },
    {
      label: 'Users',
      path: '/resource/users/'
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
