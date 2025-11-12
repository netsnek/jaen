import {PageConfig, PageProps} from 'jaen'
import {navigate} from 'gatsby'
import React, {useCallback, useEffect, useMemo, useState} from 'react'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useToast
} from '@chakra-ui/react'
import {format} from 'date-fns'
import {GQtyError} from 'gqty'
import {useForm} from 'react-hook-form'

import * as gqtyIAMClient from '../../../../client/iam'

interface IamUserDetail {
  id: string
  userName: string
  preferredLoginName?: string | null
  loginNames: string[]
  state?: string | null
  email?: string | null
  phone?: string | null
  profile: {
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
    preferredLanguage?: string | null
  }
  details: {
    changeDate?: string | null
    creationDate?: string | null
    resourceOwner?: string | null
    sequence?: string | null
  }
}

interface FormValues {
  displayName?: string
  firstName?: string
  lastName?: string
  preferredLanguage?: string
  email?: string
  phone?: string
}

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return '—'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return format(parsed, 'PPpp')
}

const UserDetailsPage: React.FC<PageProps> = ({params}) => {
  const userId = params.userId
  const toast = useToast()
  const [user, setUser] = useState<IamUserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: {isDirty}
  } = useForm<FormValues>()

  const loadUser = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await gqtyIAMClient.resolve(({query}) => {
        const fetchedUser = query.user({userId})

        const loginNames = (fetchedUser.loginNames ?? []).filter(
          (loginName): loginName is string => typeof loginName === 'string'
        )

        const phoneValue = fetchedUser.human?.phone
        const parsedPhone =
          typeof phoneValue === 'string'
            ? phoneValue
            : phoneValue && typeof phoneValue === 'object'
              ? (() => {
                  const candidate = (phoneValue as {phone?: unknown}).phone

                  return typeof candidate === 'string' ? candidate : null
                })()
              : null

        return {
          user: {
            id: fetchedUser.id ?? '',
            userName: fetchedUser.userName ?? '',
            preferredLoginName: fetchedUser.preferredLoginName ?? null,
            loginNames,
            state: fetchedUser.state ?? null,
            email: fetchedUser.human?.email?.email ?? null,
            phone: parsedPhone,
            profile: {
              displayName: fetchedUser.human?.profile?.displayName ?? null,
              firstName: fetchedUser.human?.profile?.firstName ?? null,
              lastName: fetchedUser.human?.profile?.lastName ?? null,
              preferredLanguage:
                fetchedUser.human?.profile?.preferredLanguage ?? null
            },
            details: {
              changeDate: fetchedUser.details?.changeDate ?? null,
              creationDate: fetchedUser.details?.creationDate ?? null,
              resourceOwner: fetchedUser.details?.resourceOwner ?? null,
              sequence: fetchedUser.details?.sequence ?? null
            }
          }
        }
      })

      const currentUser = result.user

      if (!currentUser) {
        setError('The requested account could not be found.')
        setUser(null)
        return
      }

      setUser(currentUser)
      reset({
        displayName: currentUser.profile.displayName ?? '',
        firstName: currentUser.profile.firstName ?? '',
        lastName: currentUser.profile.lastName ?? '',
        preferredLanguage: currentUser.profile.preferredLanguage ?? '',
        email: currentUser.email ?? '',
        phone: currentUser.phone ?? ''
      })
    } catch (err) {
      console.error(err)
      const message =
        err instanceof GQtyError
          ? 'Failed to load the user profile from the IAM service.'
          : err instanceof Error
            ? err.message
            : 'Failed to load the user profile.'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [userId, reset])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const onSubmit = async (values: FormValues) => {
    if (!user) return

    setIsSaving(true)

    try {
      const updatedUser: IamUserDetail = {
        ...user,
        email: values.email ?? '',
        phone: values.phone ?? '',
        profile: {
          displayName: values.displayName ?? '',
          firstName: values.firstName ?? '',
          lastName: values.lastName ?? '',
          preferredLanguage: values.preferredLanguage ?? ''
        }
      }

      setUser(updatedUser)
      reset(values)

      toast({
        title: 'Changes saved',
        description: 'The profile has been updated locally.',
        status: 'success',
        duration: 4000,
        isClosable: true
      })
    } catch (err) {
      console.error(err)
      const message =
        err instanceof Error ? err.message : 'Failed to save changes.'

      toast({
        title: 'Save failed',
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true
      })
    } finally {
      setIsSaving(false)
    }
  }

  const detailSkeleton = useMemo(
    () => (
      <Stack spacing={6}>
        <Card>
          <CardHeader>
            <Flex align="center" gap={4}>
              <SkeletonCircle size="20" />
              <Skeleton height="24px" width="40%" />
            </Flex>
          </CardHeader>
          <CardBody>
            <SkeletonText noOfLines={4} spacing="3" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton height="20px" width="30%" />
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
              {Array.from({length: 6}).map((_, index) => (
                <Skeleton key={`input-skeleton-${index}`} height="40px" />
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
      </Stack>
    ),
    []
  )

  if (isLoading) {
    return (
      <Box py={{base: 6, md: 8}} px={{base: 4, md: 8}}>
        {detailSkeleton}
      </Box>
    )
  }

  if (error) {
    return (
      <Stack spacing={6} py={{base: 6, md: 8}} px={{base: 4, md: 8}}>
        <Button
          variant="link"
          alignSelf="flex-start"
          onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Unable to load this account</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      </Stack>
    )
  }

  if (!user) {
    return null
  }

  const formattedChangeDate = formatDateTime(user.details.changeDate)
  const formattedCreationDate = formatDateTime(user.details.creationDate)

  return (
    <Stack spacing={8} py={{base: 6, md: 8}} px={{base: 4, md: 8}}>
      <Button
        variant="link"
        alignSelf="flex-start"
        onClick={() => navigate(-1)}>
        Back to accounts
      </Button>

      <Card>
        <CardHeader>
          <Flex
            align={{base: 'flex-start', md: 'center'}}
            direction={{base: 'column', md: 'row'}}
            gap={4}>
            <Avatar name={user.profile.displayName ?? user.userName} />
            <Box>
              <Heading size="md">
                {user.profile.displayName || user.userName}
              </Heading>
              <Text color="gray.500">
                {user.email || 'No primary email provided'}
              </Text>
            </Box>
          </Flex>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{base: 1, md: 3}} spacing={6}>
            <Stat>
              <StatLabel>Username</StatLabel>
              <StatNumber fontSize="lg">{user.userName || '—'}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Preferred login</StatLabel>
              <StatNumber fontSize="lg">
                {user.preferredLoginName || '—'}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Account state</StatLabel>
              <StatNumber fontSize="lg">
                {user.state?.replace('USER_STATE_', '') || '—'}
              </StatNumber>
            </Stat>
          </SimpleGrid>

          <Divider my={6} />

          <Stack spacing={4}>
            <Text fontWeight="semibold">Alternate login names</Text>
            {user.loginNames.length > 0 ? (
              <Stack spacing={1}>
                {user.loginNames.map(loginName => (
                  <Text key={loginName}>{loginName}</Text>
                ))}
              </Stack>
            ) : (
              <Text color="gray.500">No alternate logins configured.</Text>
            )}
          </Stack>

          <Divider my={6} />

          <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
            <GridItem>
              <Text fontSize="sm" color="gray.500">
                Created
              </Text>
              <Text>{formattedCreationDate}</Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.500">
                Last change
              </Text>
              <Text>{formattedChangeDate}</Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.500">
                Resource owner
              </Text>
              <Text>{user.details.resourceOwner || '—'}</Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.500">
                Sequence
              </Text>
              <Text>{user.details.sequence || '—'}</Text>
            </GridItem>
          </SimpleGrid>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size="md">Profile</Heading>
        </CardHeader>
        <CardBody>
          <Stack as="form" spacing={6} onSubmit={handleSubmit(onSubmit)}>
            <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
              <FormControl>
                <FormLabel>Display name</FormLabel>
                <Input
                  placeholder="Display name"
                  {...register('displayName')}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Preferred language</FormLabel>
                <Input
                  placeholder="Preferred language"
                  {...register('preferredLanguage')}
                />
              </FormControl>
              <FormControl>
                <FormLabel>First name</FormLabel>
                <Input placeholder="First name" {...register('firstName')} />
              </FormControl>
              <FormControl>
                <FormLabel>Last name</FormLabel>
                <Input placeholder="Last name" {...register('lastName')} />
              </FormControl>
              <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="Email address"
                  {...register('email')}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone number</FormLabel>
                <Input placeholder="Phone number" {...register('phone')} />
              </FormControl>
            </SimpleGrid>

            <Flex
              direction={{base: 'column', sm: 'row'}}
              gap={3}
              justify="flex-end">
              <Button
                onClick={() =>
                  reset({
                    displayName: user.profile.displayName ?? '',
                    firstName: user.profile.firstName ?? '',
                    lastName: user.profile.lastName ?? '',
                    preferredLanguage: user.profile.preferredLanguage ?? '',
                    email: user.email ?? '',
                    phone: user.phone ?? ''
                  })
                }
                variant="ghost"
                isDisabled={!isDirty || isSaving}>
                Reset
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSaving}
                isDisabled={!isDirty && !isSaving}>
                Save changes
              </Button>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  )
}

export default UserDetailsPage

export const pageConfig: PageConfig = {
  label: 'Accounts',
  icon: 'FaUser',
  layout: {
    name: 'jaen'
  },
  breadcrumbs: [
    {
      label: 'Accounts',
      path: '/accounts/'
    }
  ],
  auth: {
    isRequired: true,
    isAdminRequired: true
  }
}

export {Head} from 'jaen'
