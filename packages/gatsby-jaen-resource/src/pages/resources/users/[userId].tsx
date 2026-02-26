// src/pages/resources/users/[userId].tsx
import React from 'react'
import {graphql, navigate} from 'gatsby'
import {PageConfig, useNotificationsContext} from 'jaen'
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Stack,
  Switch,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import {Controller, useForm} from 'react-hook-form'

import {useUser, useUsers} from '../../../hooks'

interface UserPageProps {
  params: {
    userId: string
  }
}

type FormValues = {
  emailAddress: string
  details?: {
    firstName?: string
    lastName?: string
  }
  username: string
  isActive: boolean
  isAdmin: boolean
  password?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, any>((props, ref) => {
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
})
PasswordInput.displayName = 'PasswordInput'

const Page: React.FC<UserPageProps> = ({params}) => {
  const userId = params.userId ?? ''
  const {user, isLoading} = useUser(userId)
  const {updateUser, deleteUser} = useUsers()
  const {confirm} = useNotificationsContext()

  const [changePassword, setChangePassword] = React.useState(false)
  const isMobile = useBreakpointValue({base: true, md: false}) ?? true

  const defaultValues: FormValues | undefined = user
    ? {
        emailAddress: user.primaryEmailAddress,
        details: {
          firstName: user.details?.firstName,
          lastName: user.details?.lastName
        },
        username: user.username,
        isActive: user.isActive,
        isAdmin: user.isAdmin
      }
    : undefined

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: {errors, isSubmitting, isDirty}
  } = useForm<FormValues>({
    defaultValues
  })

  const onReset = React.useCallback(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
    setChangePassword(false)
  }, [defaultValues, reset])

  React.useEffect(() => {
    if (user) {
      onReset()
    }
  }, [user, onReset])

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete user',
      message: "Are you sure? You can't undo this action afterwards.",
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })

    if (ok) {
      const success = await deleteUser(userId)
      if (success) {
        navigate(-1)
      }
    }
  }

  const onSubmit = async (values: FormValues) => {
    const payload: any = {
      emailAddress: values.emailAddress,
      username: values.username,
      isActive: values.isActive,
      isAdmin: values.isAdmin,
      details: {
        firstName: values.details?.firstName,
        lastName: values.details?.lastName
      }
    }

    // Only send password if explicitly changed
    if (changePassword && values.password) {
      payload.password = values.password
    }

    const success = await updateUser(userId, payload)

    if (success) {
      navigate(-1)
      reset(values)
      setChangePassword(false)
    }
  }

  if (!user && !isLoading) {
    return <Text>User not found</Text>
  }

  return (
    <Stack spacing={6}>
      {/* Header card */}
      <Box
        mt={2}
        borderWidth="1px"
        borderRadius="lg"
        p={{base: 4, md: 5}}>
        <HStack align="flex-start" spacing={4}>
          <Skeleton isLoaded={!isLoading} borderRadius="full">
            <Avatar
              size="md"
              name={user?.username}
              src={user?.details?.avatarURL}
            />
          </Skeleton>

          <Stack spacing={1} flex="1">
            <Skeleton isLoaded={!isLoading}>
              <Text fontWeight="bold" noOfLines={1}>
                {user
                  ? `${user.username || '—'} (${user.primaryEmailAddress || '—'})`
                  : '—'}
              </Text>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                {user
                  ? [user.details?.firstName, user.details?.lastName]
                      .filter(Boolean)
                      .join(' ') || '—'
                  : '—'}
              </Text>
            </Skeleton>

            {/* Roles as badges (read-only) */}
            <Skeleton isLoaded={!isLoading}>
              <HStack flexWrap="wrap" spacing={2} pt={1}>
                {user && user.roles && user.roles.length > 0 ? (
                  user.roles.map(role => (
                    <Badge
                      key={role.id}
                      fontSize="0.7rem"
                      variant="subtle"
                      colorScheme={role.id === 'jaen:admin' ? 'purple' : 'gray'}>
                      {role.description || role.id}
                    </Badge>
                  ))
                ) : (
                  <Text fontSize="xs" color="gray.400">
                    No roles
                  </Text>
                )}
              </HStack>
            </Skeleton>
          </Stack>
        </HStack>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl>
            <Skeleton width="fit-content" isLoaded={!isLoading}>
              <FormLabel>ID</FormLabel>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Input value={user?.id ?? ''} isDisabled />
            </Skeleton>
          </FormControl>

          <FormControl isInvalid={!!errors.emailAddress}>
            <Skeleton width="fit-content" isLoaded={!isLoading}>
              <FormLabel>E-Mail</FormLabel>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Input
                isDisabled
                placeholder="john.doe@snek.at"
                {...register('emailAddress', {
                  required: 'This is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </Skeleton>
            <FormErrorMessage>
              {errors.emailAddress?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.username}>
            <Skeleton width="fit-content" isLoaded={!isLoading}>
              <FormLabel>Username</FormLabel>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Input
                placeholder="john.doe"
                {...register('username', {
                  required: 'This is required'
                })}
              />
            </Skeleton>
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>

          <Stack
            direction={{base: 'column', md: 'row'}}
            spacing={{base: 4, md: 4}}>
            <FormControl isInvalid={!!errors.details?.firstName} flex={1}>
              <Skeleton width="fit-content" isLoaded={!isLoading}>
                <FormLabel>Firstname</FormLabel>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <Input
                  placeholder="John"
                  {...register('details.firstName')}
                />
              </Skeleton>
              <FormErrorMessage>
                {errors.details?.firstName?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.details?.lastName} flex={1}>
              <Skeleton width="fit-content" isLoaded={!isLoading}>
                <FormLabel>Lastname</FormLabel>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <Input
                  placeholder="Doe"
                  {...register('details.lastName')}
                />
              </Skeleton>
              <FormErrorMessage>
                {errors.details?.lastName?.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>

          <FormControl isInvalid={!!errors.password}>
            <Skeleton width="fit-content" isLoaded={!isLoading}>
              <FormLabel>Password</FormLabel>
            </Skeleton>
            {changePassword ? (
              <Skeleton isLoaded={!isLoading}>
                <PasswordInput
                  {...register('password', {
                    required: 'This is required'
                  })}
                />
              </Skeleton>
            ) : (
              <Skeleton width="fit-content" isLoaded={!isLoading}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setChangePassword(true)}>
                  Change password
                </Button>
              </Skeleton>
            )}
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Stack
            direction={{base: 'column', md: 'row'}}
            spacing={{base: 4, md: 8}}>
            <FormControl isInvalid={!!errors.isActive}>
              <Skeleton width="fit-content" isLoaded={!isLoading}>
                <FormLabel>Active</FormLabel>
              </Skeleton>
              <Skeleton width="fit-content" isLoaded={!isLoading}>
                <Controller
                  control={control}
                  name="isActive"
                  defaultValue={user?.isActive ?? false}
                  render={({field: {value, onChange, onBlur, ref}}) => (
                    <Switch
                      ref={ref}
                      onChange={onChange}
                      onBlur={onBlur}
                      isChecked={value}
                    />
                  )}
                />
              </Skeleton>
              <FormErrorMessage>{errors.isActive?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.isAdmin}>
              <Skeleton width="fit-content" isLoaded={!isLoading}>
                <FormLabel>Admin</FormLabel>
              </Skeleton>
              <Skeleton width="fit-content" isLoaded={!isLoading}>
                <Controller
                  control={control}
                  name="isAdmin"
                  defaultValue={user?.isAdmin ?? false}
                  render={({field: {value, onChange, onBlur, ref}}) => (
                    <Switch
                      ref={ref}
                      onChange={onChange}
                      onBlur={onBlur}
                      isChecked={value}
                    />
                  )}
                />
              </Skeleton>
              <FormErrorMessage>{errors.isAdmin?.message}</FormErrorMessage>
            </FormControl>
          </Stack>

          <FormControl>
            <Skeleton width="fit-content" isLoaded={!isLoading}>
              <FormLabel>Created at</FormLabel>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Input
                value={
                  user?.createdAt
                    ? new Date(user.createdAt).toLocaleString('de-AT')
                    : '—'
                }
                isDisabled
              />
            </Skeleton>
          </FormControl>

          <Box mt={4}>
            <Stack
              direction={{base: 'column', md: 'row'}}
              spacing={3}
              align={{base: 'stretch', md: 'center'}}>
              <ButtonGroup
                isDisabled={!isDirty}
                flexShrink={0}
                flexWrap="wrap">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  width={isMobile ? '100%' : 'auto'}>
                  Save changes
                </Button>
                <Button
                  variant="outline"
                  onClick={onReset}
                  width={isMobile ? '100%' : 'auto'}>
                  Cancel
                </Button>
              </ButtonGroup>

              <Button
                variant="outline"
                colorScheme="red"
                onClick={handleDelete}
                width={isMobile ? '100%' : 'auto'}>
                Delete user
              </Button>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Stack>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: 'Update user',
  icon: 'FaUserCog',
  layout: {
    name: 'jaen',
    type: 'form'
  },
  breadcrumbs: [
    {
      label: 'Resources',
      path: '/resources/'
    },
    {
      label: 'Users',
      path: '/resources/users/'
    },
    {
      label: 'Update user',
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
