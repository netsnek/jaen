import {
  PageConfig,
  useAuth,
  useColorModeValue,
  useNotificationsContext,
  zitadelGql
} from 'jaen'
import {intlText} from '../../../lib/intl'
import {Link as GatsbyLink, PageProps} from 'gatsby'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import {FaPlus} from '@react-icons/all-files/fa/FaPlus'
import {useForm} from 'react-hook-form'

interface UserSummary {
  id: string
  userName: string
  preferredLoginName?: string | null
  loginNames: string[]
  state?: string | null
  displayName?: string | null
  email?: string | null
}

interface CreateFormValues {
  username: string
  email: string
  firstName?: string
  lastName?: string
  password?: string
  sendPasswordReset: boolean
}

const stateLabel = (state?: string | null): string =>
  (state ?? '').replace('USER_STATE_', '').toLowerCase()

const AccountsPage: React.FC = () => {
  const intl = useIntl()
  const auth = useAuth()
  const {toast} = useNotificationsContext()

  const [users, setUsers] = useState<UserSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const accessToken = auth.user?.access_token

  const fetchUsers = useCallback(async () => {
    if (!accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const {users: fetched} = await zitadelGql.fetchUsers({accessToken})

      setUsers(
        fetched.map(user => {
          const profile = zitadelGql.primaryProfile(user)

          return {
            id: user.id,
            userName: user.userName ?? '',
            preferredLoginName: user.preferredLoginName,
            loginNames: (user.loginNames ?? []).filter(
              (loginName): loginName is string => typeof loginName === 'string'
            ),
            state: user.state,
            displayName: profile?.displayName,
            email: profile?.email
          }
        })
      )
    } catch (err) {
      if (err instanceof zitadelGql.ZitadelGqlError) {
        setError(
          intl.formatMessage({
            id: 'CmsAccountsErrorsLoadService',
            defaultMessage: 'Failed to load users from the identity service.'
          })
        )
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          intl.formatMessage({
            id: 'CmsAccountsErrorsLoadGeneric',
            defaultMessage: 'Failed to load users.'
          })
        )
      }
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, intl])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const filteredUsers = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase()

    if (!needle) return users

    return users.filter(user => {
      const haystack = [
        user.userName,
        user.preferredLoginName ?? '',
        user.displayName ?? '',
        user.email ?? '',
        ...user.loginNames
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(needle)
    })
  }, [users, searchTerm])

  // -------------------------------------------------------------------------
  // account creation
  // -------------------------------------------------------------------------

  const createModal = useDisclosure()

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting}
  } = useForm<CreateFormValues>({
    defaultValues: {sendPasswordReset: true}
  })

  const onCreate = handleSubmit(async values => {
    if (!accessToken) return

    try {
      const result = await zitadelGql.createUser({
        accessToken,
        emailAddress: values.email,
        username: values.username,
        password: values.password || undefined,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined
      })

      if (!result.ok) {
        throw new Error(result.message || 'createUser failed')
      }

      if (values.sendPasswordReset && !values.password && result.userId) {
        await zitadelGql
          .requestUserPasswordReset({accessToken, userId: result.userId})
          .catch(() => undefined)
      }

      toast({
        title: intl.formatMessage({
          id: 'CmsAccountsNotificationsCreated',
          defaultMessage: 'Account created'
        }),
        description: intl.formatMessage(
          {
            id: 'CmsAccountsNotificationsCreatedDescription',
            defaultMessage: 'Account {username} has been created'
          },
          {username: values.username}
        ),
        status: 'success'
      })

      createModal.onClose()
      reset()
      await fetchUsers()
    } catch (err) {
      toast({
        title: intl.formatMessage({
          id: 'CmsAccountsNotificationsCreateFailed',
          defaultMessage: 'Could not create account'
        }),
        description: err instanceof Error ? err.message : undefined,
        status: 'error'
      })
    }
  })

  const emptyBg = useColorModeValue('gray.50', 'gray.800')
  const emptyBorder = useColorModeValue('gray.200', 'gray.700')

  return (
    <Stack spacing="6">
      <Flex justifyContent="space-between" alignItems="flex-start" wrap="wrap">
        <Box>
          <Heading size="lg">
            {intl.formatMessage({
              id: 'CmsAccountsTitle',
              defaultMessage: 'Accounts'
            })}
          </Heading>
          <Text color="fg.muted">
            {intl.formatMessage({
              id: 'CmsAccountsSubtitle',
              defaultMessage:
                'Browse and manage the user accounts of your identity tenant.'
            })}
          </Text>
        </Box>

        <Button
          leftIcon={<FaPlus />}
          variant="outline"
          onClick={createModal.onOpen}>
          {intl.formatMessage({
            id: 'CmsAccountsActionsCreate',
            defaultMessage: 'New account'
          })}
        </Button>
      </Flex>

      <InputGroup maxW="sm">
        <Input
          placeholder={intl.formatMessage({
            id: 'CmsAccountsSearchPlaceholder',
            defaultMessage: 'Search by name, email or login name'
          })}
          value={searchTerm}
          onChange={event => {
            setSearchTerm(event.target.value)
          }}
        />
      </InputGroup>

      {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>
            {intl.formatMessage({
              id: 'CmsAccountsErrorsLoadTitle',
              defaultMessage: 'Unable to load accounts'
            })}
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <SimpleGrid columns={{base: 1, md: 2, xl: 3}} spacing={6}>
        {isLoading
          ? Array.from({length: 6}).map((_, index) => (
              <Card key={index} variant="outline">
                <CardHeader>
                  <HStack spacing="4">
                    <SkeletonCircle size="12" />
                    <Skeleton height="20px" width="40%" />
                  </HStack>
                </CardHeader>
                <CardBody>
                  <SkeletonText noOfLines={3} />
                </CardBody>
              </Card>
            ))
          : filteredUsers.map(user => (
              <Card key={user.id} variant="outline" height="100%">
                <CardHeader>
                  <HStack spacing="4" alignItems="flex-start">
                    <Avatar name={user.displayName ?? user.userName} />
                    <Box flex="1">
                      <Heading size="sm">
                        {user.displayName ||
                          user.userName ||
                          intl.formatMessage({
                            id: 'CmsAccountsCardUnnamed',
                            defaultMessage: 'Unnamed user'
                          })}
                      </Heading>
                      <Text fontSize="sm" color="fg.muted">
                        {user.email ||
                          user.preferredLoginName ||
                          intl.formatMessage({
                            id: 'CmsAccountsCardNoEmail',
                            defaultMessage: 'No email provided'
                          })}
                      </Text>
                    </Box>
                    {user.state ? (
                      <Badge
                        colorScheme={
                          user.state === 'USER_STATE_ACTIVE'
                            ? 'green'
                            : 'purple'
                        }>
                        {stateLabel(user.state)}
                      </Badge>
                    ) : null}
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Stack spacing="4">
                    <Box>
                      <Text fontSize="xs" color="fg.muted">
                        {intl.formatMessage({
                          id: 'CmsAccountsCardUsername',
                          defaultMessage: 'Username'
                        })}
                      </Text>
                      <Text>{user.userName || '—'}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="fg.muted">
                        {intl.formatMessage({
                          id: 'CmsAccountsCardLoginNames',
                          defaultMessage: 'Login names'
                        })}
                      </Text>
                      {user.loginNames.length > 0 ? (
                        user.loginNames.map(loginName => (
                          <Text key={loginName}>{loginName}</Text>
                        ))
                      ) : (
                        <Text color="fg.muted">
                          {intl.formatMessage({
                            id: 'CmsAccountsCardNoLoginNames',
                            defaultMessage: 'No alternate login names'
                          })}
                        </Text>
                      )}
                    </Box>
                    <Button
                      as={GatsbyLink}
                      to={`./${user.id}`}
                      size="sm"
                      variant="outline">
                      {intl.formatMessage({
                        id: 'CmsAccountsCardManage',
                        defaultMessage: 'Manage account'
                      })}
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
      </SimpleGrid>

      {!isLoading && !error && filteredUsers.length === 0 ? (
        <Box
          borderWidth="1px"
          borderStyle="dashed"
          borderColor={emptyBorder}
          bg={emptyBg}
          borderRadius="md"
          p="8"
          textAlign="center">
          <Heading size="sm" mb="2">
            {intl.formatMessage({
              id: 'CmsAccountsEmptyTitle',
              defaultMessage: 'No accounts match your search'
            })}
          </Heading>
          <Text color="fg.muted">
            {intl.formatMessage({
              id: 'CmsAccountsEmptyHint',
              defaultMessage: 'Adjust the search term or create a new account.'
            })}
          </Text>
        </Box>
      ) : null}

      <Modal isOpen={createModal.isOpen} onClose={createModal.onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={onCreate}>
          <ModalHeader>
            {intl.formatMessage({
              id: 'CmsAccountsCreateTitle',
              defaultMessage: 'Create a new account'
            })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="4">
              <FormControl isRequired isInvalid={!!errors.username}>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsCreateUsername',
                    defaultMessage: 'Username'
                  })}
                </FormLabel>
                <Input {...register('username', {required: true})} />
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsCreateEmail',
                    defaultMessage: 'Email'
                  })}
                </FormLabel>
                <Input type="email" {...register('email', {required: true})} />
              </FormControl>
              <SimpleGrid columns={2} spacing="4">
                <FormControl>
                  <FormLabel>
                    {intl.formatMessage({
                      id: 'CmsAccountsCreateFirstName',
                      defaultMessage: 'First name'
                    })}
                  </FormLabel>
                  <Input {...register('firstName')} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    {intl.formatMessage({
                      id: 'CmsAccountsCreateLastName',
                      defaultMessage: 'Last name'
                    })}
                  </FormLabel>
                  <Input {...register('lastName')} />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsCreateInitialPassword',
                    defaultMessage: 'Initial password (optional)'
                  })}
                </FormLabel>
                <Input type="password" {...register('password')} />
              </FormControl>
              <Checkbox {...register('sendPasswordReset')}>
                {intl.formatMessage({
                  id: 'CmsAccountsCreateSendReset',
                  defaultMessage:
                    'Send a password reset email when no password is set'
                })}
              </Checkbox>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={createModal.onClose}>
              {intl.formatMessage({
                id: 'CmsAccountsActionsCancel',
                defaultMessage: 'Cancel'
              })}
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {intl.formatMessage({
                id: 'CmsAccountsActionsCreateSubmit',
                defaultMessage: 'Create account'
              })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}

const Page: React.FC<PageProps> = () => {
  return <AccountsPage />
}

export default Page

export const pageConfig: PageConfig = {
  label: intlText('CmsAccountsPageTitle', 'Jaen CMS | Accounts'),
  icon: 'FaUsers',
  layout: {
    name: 'jaen',
    type: 'form'
  },
  menu: {
    label: intlText('CmsAccountsMenuLabel', 'Accounts'),
    type: 'app',
    group: 'cms',
    order: 400
  },
  breadcrumbs: [
    {
      label: intlText('CmsLabelsRoot', 'CMS'),
      path: '/cms/'
    },
    {
      label: intlText('CmsAccountsBreadcrumbsAccounts', 'Accounts'),
      path: '/cms/accounts/'
    }
  ],
  auth: {
    isRequired: true,
    isAdminRequired: true
  }
}

export {Head} from 'jaen'
