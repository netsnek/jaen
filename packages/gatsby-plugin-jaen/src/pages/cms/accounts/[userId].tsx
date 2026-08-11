import {PageConfig, useAuth, zitadelGql} from 'jaen'
import {intlText} from '../../../lib/intl'
import {navigate, PageProps} from 'gatsby'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useIntl} from 'react-intl'

import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
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
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'

interface UserDetail {
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
  }
  roles: zitadelGql.ZgRole[]
  authorizations: zitadelGql.ZgAuthorization[]
}

interface FormValues {
  displayName?: string
  firstName?: string
  lastName?: string
  preferredLanguage?: string
  email?: string
  phone?: string
}

const toDetail = (user: zitadelGql.ZgUser): UserDetail => {
  const profile = zitadelGql.primaryProfile(user)

  return {
    id: user.id,
    userName: user.userName ?? '',
    preferredLoginName: user.preferredLoginName,
    loginNames: (user.loginNames ?? []).filter(
      (loginName): loginName is string => typeof loginName === 'string'
    ),
    state: user.state,
    email: profile?.email,
    phone: profile?.phone,
    profile: {
      displayName: profile?.displayName,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      preferredLanguage:
        user.preferences?.preferredLanguage ?? profile?.preferredLanguage
    },
    details: {
      changeDate: user.changeDate,
      creationDate: user.creationDate,
      resourceOwner: user.resourceOwner
    },
    roles: zitadelGql.connectionNodes(user.roles),
    authorizations: zitadelGql.connectionNodes(user.authorizations)
  }
}

const stateLabel = (state?: string | null): string =>
  (state ?? '').replace('USER_STATE_', '').toLowerCase()

const UserDetailsPage: React.FC<PageProps> = props => {
  const userId = (props.params as {userId?: string} | undefined)?.userId

  const intl = useIntl()
  const auth = useAuth()
  const toast = useToast()

  const accessToken = auth.user?.access_token

  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: {isDirty, isSubmitting}
  } = useForm<FormValues>()

  const formatDateTime = useCallback(
    (value?: string | null): string => {
      if (!value) return '—'

      const date = new Date(value)

      if (Number.isNaN(date.getTime())) return value

      return `${intl.formatDate(date, {
        dateStyle: 'medium'
      })} ${intl.formatTime(date, {hour: '2-digit', minute: '2-digit'})}`
    },
    [intl]
  )

  const loadUser = useCallback(async () => {
    if (!accessToken || !userId) return

    setIsLoading(true)
    setError(null)

    try {
      const fetched = await zitadelGql.fetchUser({accessToken, userId})

      const detail = toDetail(fetched)

      setUser(detail)
      reset({
        displayName: detail.profile.displayName ?? '',
        firstName: detail.profile.firstName ?? '',
        lastName: detail.profile.lastName ?? '',
        preferredLanguage: detail.profile.preferredLanguage ?? '',
        email: detail.email ?? '',
        phone: detail.phone ?? ''
      })
    } catch (err) {
      if (err instanceof zitadelGql.ZitadelGqlError) {
        setError(
          intl.formatMessage({
            id: 'CmsAccountsErrorsDetailService',
            defaultMessage:
              'Failed to load the user profile from the identity service.'
          })
        )
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          intl.formatMessage({
            id: 'CmsAccountsErrorsDetailGeneric',
            defaultMessage: 'Failed to load the user profile.'
          })
        )
      }
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, userId, intl, reset])

  useEffect(() => {
    void loadUser()
  }, [loadUser])

  const notifyResult = useCallback(
    (
      ok: boolean,
      message: string | null | undefined,
      successTitle: string
    ) => {
      if (ok) {
        toast({title: successTitle, status: 'success'})
      } else {
        toast({
          title: intl.formatMessage({
            id: 'CmsAccountsNotificationsActionFailed',
            defaultMessage: 'Action failed'
          }),
          description: message ?? undefined,
          status: 'error'
        })
      }
    },
    [toast, intl]
  )

  const runAction = useCallback(
    async (
      action: () => Promise<{ok: boolean; message: string | null}>,
      successTitle: string
    ) => {
      setIsBusy(true)

      try {
        const result = await action()

        notifyResult(result.ok, result.message, successTitle)

        if (result.ok) {
          await loadUser()
        }
      } catch (err) {
        notifyResult(
          false,
          err instanceof Error ? err.message : undefined,
          successTitle
        )
      } finally {
        setIsBusy(false)
      }
    },
    [notifyResult, loadUser]
  )

  // -------------------------------------------------------------------------
  // profile form submit — updates profile/email/phone through zitadel-gql
  // -------------------------------------------------------------------------

  const onSubmit = handleSubmit(async values => {
    if (!accessToken || !user) return

    try {
      const changes: zitadelGql.ZgUserChanges = {
        profile: {
          givenName: values.firstName || undefined,
          familyName: values.lastName || undefined,
          displayName: values.displayName || undefined,
          preferredLanguage: values.preferredLanguage || undefined
        }
      }

      if (values.email && values.email !== (user.email ?? '')) {
        changes.email = {email: values.email}
      }

      const result = await zitadelGql.updateUser({
        accessToken,
        userId: user.id,
        changes
      })

      if (!result.ok) {
        throw new Error(result.message || 'updateUser failed')
      }

      if (values.phone && values.phone !== (user.phone ?? '')) {
        const phoneResult = await zitadelGql.setUserPhone({
          accessToken,
          userId: user.id,
          phone: values.phone
        })

        if (!phoneResult.ok) {
          throw new Error(phoneResult.message || 'setUserPhone failed')
        }
      }

      toast({
        title: intl.formatMessage({
          id: 'CmsAccountsNotificationsSaved',
          defaultMessage: 'Changes saved'
        }),
        description: intl.formatMessage({
          id: 'CmsAccountsNotificationsSavedDescription',
          defaultMessage: 'The profile has been updated.'
        }),
        status: 'success'
      })

      await loadUser()
    } catch (err) {
      toast({
        title: intl.formatMessage({
          id: 'CmsAccountsNotificationsSaveFailed',
          defaultMessage: 'Save failed'
        }),
        description: err instanceof Error ? err.message : undefined,
        status: 'error'
      })
    }
  })

  // -------------------------------------------------------------------------
  // dangerous actions
  // -------------------------------------------------------------------------

  const deleteDialog = useDisclosure()
  const deleteCancelRef = useRef<HTMLButtonElement>(null)

  const onDelete = async () => {
    if (!accessToken || !user) return

    setIsBusy(true)

    try {
      const result = await zitadelGql.deleteUser({
        accessToken,
        userId: user.id
      })

      if (result.ok) {
        toast({
          title: intl.formatMessage({
            id: 'CmsAccountsNotificationsDeleted',
            defaultMessage: 'Account deleted'
          }),
          status: 'success'
        })

        void navigate('../')
        return
      }

      notifyResult(false, result.message, '')
    } catch (err) {
      notifyResult(false, err instanceof Error ? err.message : undefined, '')
    } finally {
      setIsBusy(false)
      deleteDialog.onClose()
    }
  }

  // -------------------------------------------------------------------------
  // password modal
  // -------------------------------------------------------------------------

  const passwordModal = useDisclosure()
  const [newPassword, setNewPassword] = useState('')
  const [passwordChangeRequired, setPasswordChangeRequired] = useState(true)

  const onSetPassword = async () => {
    if (!accessToken || !user || !newPassword) return

    await runAction(
      () =>
        zitadelGql.setUserPassword({
          accessToken,
          userId: user.id,
          newPassword,
          changeRequired: passwordChangeRequired
        }),
      intl.formatMessage({
        id: 'CmsAccountsNotificationsPasswordSet',
        defaultMessage: 'Password set'
      })
    )

    setNewPassword('')
    passwordModal.onClose()
  }

  // -------------------------------------------------------------------------
  // authorizations (project roles)
  // -------------------------------------------------------------------------

  const roleModal = useDisclosure()
  const [roleModalAuthorization, setRoleModalAuthorization] =
    useState<zitadelGql.ZgAuthorization | null>(null)
  const [roleModalProjectId, setRoleModalProjectId] = useState('')
  const [availableRoles, setAvailableRoles] = useState<zitadelGql.ZgRole[]>([])
  const [selectedRoleKeys, setSelectedRoleKeys] = useState<string[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)

  const openRoleModal = async (
    authorization: zitadelGql.ZgAuthorization | null,
    projectId: string
  ) => {
    if (!accessToken) return

    setRoleModalAuthorization(authorization)
    setRoleModalProjectId(projectId)
    setSelectedRoleKeys(authorization?.roleKeys ?? [])
    setAvailableRoles([])
    roleModal.onOpen()

    if (!projectId) return

    setRolesLoading(true)

    try {
      const roles = await zitadelGql.fetchProjectRoles({
        accessToken,
        projectId
      })

      setAvailableRoles(roles)
    } catch {
      setAvailableRoles([])
    } finally {
      setRolesLoading(false)
    }
  }

  const onSaveRoles = async () => {
    if (!accessToken || !user) return

    const successTitle = intl.formatMessage({
      id: 'CmsAccountsNotificationsRolesUpdated',
      defaultMessage: 'Roles updated'
    })

    if (roleModalAuthorization) {
      await runAction(
        () =>
          zitadelGql.updateAuthorization({
            accessToken,
            authorizationId: roleModalAuthorization.id,
            roleKeys: selectedRoleKeys
          }),
        successTitle
      )
    } else {
      await runAction(
        () =>
          zitadelGql.createAuthorization({
            accessToken,
            userId: user.id,
            projectId: roleModalProjectId,
            roleKeys: selectedRoleKeys
          }),
        successTitle
      )
    }

    roleModal.onClose()
  }

  const configuredProjectIds = useMemo(() => {
    try {
      return zitadelGql.getZitadelGqlConfig().projectIds ?? []
    } catch {
      return []
    }
  }, [])

  // -------------------------------------------------------------------------
  // render
  // -------------------------------------------------------------------------

  if (isLoading) {
    return (
      <Stack spacing="6">
        <Card variant="outline">
          <CardHeader>
            <HStack spacing="4">
              <SkeletonCircle size="20" />
              <Skeleton height="24px" width="30%" />
            </HStack>
          </CardHeader>
          <CardBody>
            <SkeletonText noOfLines={4} />
          </CardBody>
        </Card>
        <Card variant="outline">
          <CardBody>
            <SimpleGrid columns={{base: 1, md: 2}} spacing="4">
              {Array.from({length: 6}).map((_, index) => (
                <Skeleton key={index} height="40px" />
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
      </Stack>
    )
  }

  if (error) {
    return (
      <Stack spacing="4" alignItems="flex-start">
        <Button
          variant="link"
          onClick={() => {
            void navigate('../')
          }}>
          {intl.formatMessage({
            id: 'CmsAccountsDetailBack',
            defaultMessage: 'Back to accounts'
          })}
        </Button>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>
            {intl.formatMessage({
              id: 'CmsAccountsErrorsDetailTitle',
              defaultMessage: 'Unable to load this account'
            })}
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Stack>
    )
  }

  if (!user) return null

  const isActive = user.state === 'USER_STATE_ACTIVE'
  const isLocked = user.state === 'USER_STATE_LOCKED'

  return (
    <Stack spacing="6">
      <Button
        alignSelf="flex-start"
        variant="link"
        onClick={() => {
          void navigate('../')
        }}>
        {intl.formatMessage({
          id: 'CmsAccountsDetailBack',
          defaultMessage: 'Back to accounts'
        })}
      </Button>

      <Card variant="outline">
        <CardHeader>
          <HStack spacing="4" alignItems="flex-start">
            <Avatar
              size="lg"
              name={user.profile.displayName ?? user.userName}
            />
            <Box flex="1">
              <Heading size="md">
                {user.profile.displayName || user.userName}
              </Heading>
              <Text color="fg.muted">
                {user.email ||
                  intl.formatMessage({
                    id: 'CmsAccountsDetailNoEmail',
                    defaultMessage: 'No primary email provided'
                  })}
              </Text>
            </Box>
            {user.state ? (
              <Badge colorScheme={isActive ? 'green' : 'purple'}>
                {stateLabel(user.state)}
              </Badge>
            ) : null}
          </HStack>
        </CardHeader>
        <CardBody>
          <Stack spacing="4">
            <SimpleGrid columns={{base: 1, md: 3}} spacing="4">
              <Stat>
                <StatLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsDetailUsername',
                    defaultMessage: 'Username'
                  })}
                </StatLabel>
                <StatNumber fontSize="md">{user.userName || '—'}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsDetailPreferredLogin',
                    defaultMessage: 'Preferred login'
                  })}
                </StatLabel>
                <StatNumber fontSize="md">
                  {user.preferredLoginName || '—'}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsDetailState',
                    defaultMessage: 'Account state'
                  })}
                </StatLabel>
                <StatNumber fontSize="md">
                  {stateLabel(user.state) || '—'}
                </StatNumber>
              </Stat>
            </SimpleGrid>

            <Divider />

            <SimpleGrid columns={{base: 1, md: 3}} spacing="4">
              <Box>
                <Text fontSize="xs" color="fg.muted">
                  {intl.formatMessage({
                    id: 'CmsAccountsDetailCreated',
                    defaultMessage: 'Created'
                  })}
                </Text>
                <Text>{formatDateTime(user.details.creationDate)}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="fg.muted">
                  {intl.formatMessage({
                    id: 'CmsAccountsDetailLastChange',
                    defaultMessage: 'Last change'
                  })}
                </Text>
                <Text>{formatDateTime(user.details.changeDate)}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="fg.muted">
                  {intl.formatMessage({
                    id: 'CmsAccountsDetailResourceOwner',
                    defaultMessage: 'Organization'
                  })}
                </Text>
                <Text>{user.details.resourceOwner || '—'}</Text>
              </Box>
            </SimpleGrid>
          </Stack>
        </CardBody>
      </Card>

      <Card variant="outline">
        <CardHeader>
          <Heading size="sm">
            {intl.formatMessage({
              id: 'CmsAccountsProfileTitle',
              defaultMessage: 'Profile'
            })}
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack as="form" onSubmit={onSubmit} spacing="4">
            <SimpleGrid columns={{base: 1, md: 2}} spacing="4">
              <FormControl>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsProfileDisplayName',
                    defaultMessage: 'Display name'
                  })}
                </FormLabel>
                <Input {...register('displayName')} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsProfileLanguage',
                    defaultMessage: 'Preferred language'
                  })}
                </FormLabel>
                <Input placeholder="de" {...register('preferredLanguage')} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsProfileFirstName',
                    defaultMessage: 'First name'
                  })}
                </FormLabel>
                <Input {...register('firstName')} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsProfileLastName',
                    defaultMessage: 'Last name'
                  })}
                </FormLabel>
                <Input {...register('lastName')} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsProfileEmail',
                    defaultMessage: 'Email'
                  })}
                </FormLabel>
                <Input type="email" {...register('email')} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsProfilePhone',
                    defaultMessage: 'Phone'
                  })}
                </FormLabel>
                <Input {...register('phone')} />
              </FormControl>
            </SimpleGrid>

            <Flex justifyContent="flex-end" gap="2">
              <Button
                variant="ghost"
                isDisabled={!isDirty || isSubmitting}
                onClick={() => {
                  reset()
                }}>
                {intl.formatMessage({
                  id: 'CmsAccountsProfileReset',
                  defaultMessage: 'Reset'
                })}
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                isDisabled={!isDirty && !isSubmitting}>
                {intl.formatMessage({
                  id: 'CmsAccountsProfileSave',
                  defaultMessage: 'Save changes'
                })}
              </Button>
            </Flex>
          </Stack>
        </CardBody>
      </Card>

      <Card variant="outline">
        <CardHeader>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="sm">
              {intl.formatMessage({
                id: 'CmsAccountsRolesTitle',
                defaultMessage: 'Project roles'
              })}
            </Heading>
            {configuredProjectIds.length > 0 ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  void openRoleModal(null, configuredProjectIds[0]!)
                }}>
                {intl.formatMessage({
                  id: 'CmsAccountsRolesGrant',
                  defaultMessage: 'Grant roles'
                })}
              </Button>
            ) : null}
          </Flex>
        </CardHeader>
        <CardBody>
          {user.authorizations.length > 0 ? (
            <Stack spacing="4" divider={<Divider />}>
              {user.authorizations.map(authorization => (
                <Flex
                  key={authorization.id}
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap="4"
                  wrap="wrap">
                  <Box>
                    <Text fontWeight="semibold">
                      {authorization.projectName || authorization.projectId}
                    </Text>
                    <HStack mt="1" wrap="wrap">
                      {authorization.roleKeys.map(roleKey => (
                        <Badge key={roleKey}>{roleKey}</Badge>
                      ))}
                    </HStack>
                  </Box>
                  <ButtonGroup size="sm" variant="outline">
                    <Button
                      onClick={() => {
                        void openRoleModal(
                          authorization,
                          authorization.projectId
                        )
                      }}>
                      {intl.formatMessage({
                        id: 'CmsAccountsRolesEdit',
                        defaultMessage: 'Edit'
                      })}
                    </Button>
                    <Button
                      colorScheme="red"
                      isDisabled={isBusy}
                      onClick={() => {
                        void runAction(
                          () =>
                            zitadelGql.deleteAuthorization({
                              accessToken: accessToken!,
                              authorizationId: authorization.id
                            }),
                          intl.formatMessage({
                            id: 'CmsAccountsNotificationsRolesRevoked',
                            defaultMessage: 'Roles revoked'
                          })
                        )
                      }}>
                      {intl.formatMessage({
                        id: 'CmsAccountsRolesRevoke',
                        defaultMessage: 'Revoke'
                      })}
                    </Button>
                  </ButtonGroup>
                </Flex>
              ))}
            </Stack>
          ) : (
            <Text color="fg.muted">
              {intl.formatMessage({
                id: 'CmsAccountsRolesEmpty',
                defaultMessage: 'No project roles granted.'
              })}
            </Text>
          )}
        </CardBody>
      </Card>

      <Card variant="outline">
        <CardHeader>
          <Heading size="sm">
            {intl.formatMessage({
              id: 'CmsAccountsActionsTitle',
              defaultMessage: 'Account actions'
            })}
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing="4">
            <ButtonGroup variant="outline" flexWrap="wrap" spacing="2">
              <Button isDisabled={isBusy} onClick={passwordModal.onOpen}>
                {intl.formatMessage({
                  id: 'CmsAccountsActionsSetPassword',
                  defaultMessage: 'Set password'
                })}
              </Button>
              <Button
                isDisabled={isBusy}
                onClick={() => {
                  void runAction(
                    () =>
                      zitadelGql.requestUserPasswordReset({
                        accessToken: accessToken!,
                        userId: user.id
                      }),
                    intl.formatMessage({
                      id: 'CmsAccountsNotificationsResetRequested',
                      defaultMessage: 'Password reset requested'
                    })
                  )
                }}>
                {intl.formatMessage({
                  id: 'CmsAccountsActionsRequestReset',
                  defaultMessage: 'Request password reset'
                })}
              </Button>
              <Button
                isDisabled={isBusy}
                onClick={() => {
                  void runAction(
                    () =>
                      zitadelGql.resendUserEmailVerification({
                        accessToken: accessToken!,
                        userId: user.id
                      }),
                    intl.formatMessage({
                      id: 'CmsAccountsNotificationsVerificationSent',
                      defaultMessage: 'Verification email sent'
                    })
                  )
                }}>
                {intl.formatMessage({
                  id: 'CmsAccountsActionsResendVerification',
                  defaultMessage: 'Resend email verification'
                })}
              </Button>
            </ButtonGroup>

            <ButtonGroup variant="outline" flexWrap="wrap" spacing="2">
              {isActive ? (
                <Button
                  isDisabled={isBusy}
                  onClick={() => {
                    void runAction(
                      () =>
                        zitadelGql.deactivateUser({
                          accessToken: accessToken!,
                          userId: user.id
                        }),
                      intl.formatMessage({
                        id: 'CmsAccountsNotificationsDeactivated',
                        defaultMessage: 'Account deactivated'
                      })
                    )
                  }}>
                  {intl.formatMessage({
                    id: 'CmsAccountsActionsDeactivate',
                    defaultMessage: 'Deactivate'
                  })}
                </Button>
              ) : (
                <Button
                  isDisabled={isBusy}
                  onClick={() => {
                    void runAction(
                      () =>
                        zitadelGql.reactivateUser({
                          accessToken: accessToken!,
                          userId: user.id
                        }),
                      intl.formatMessage({
                        id: 'CmsAccountsNotificationsReactivated',
                        defaultMessage: 'Account reactivated'
                      })
                    )
                  }}>
                  {intl.formatMessage({
                    id: 'CmsAccountsActionsReactivate',
                    defaultMessage: 'Reactivate'
                  })}
                </Button>
              )}
              {isLocked ? (
                <Button
                  isDisabled={isBusy}
                  onClick={() => {
                    void runAction(
                      () =>
                        zitadelGql.unlockUser({
                          accessToken: accessToken!,
                          userId: user.id
                        }),
                      intl.formatMessage({
                        id: 'CmsAccountsNotificationsUnlocked',
                        defaultMessage: 'Account unlocked'
                      })
                    )
                  }}>
                  {intl.formatMessage({
                    id: 'CmsAccountsActionsUnlock',
                    defaultMessage: 'Unlock'
                  })}
                </Button>
              ) : (
                <Button
                  isDisabled={isBusy}
                  onClick={() => {
                    void runAction(
                      () =>
                        zitadelGql.lockUser({
                          accessToken: accessToken!,
                          userId: user.id
                        }),
                      intl.formatMessage({
                        id: 'CmsAccountsNotificationsLocked',
                        defaultMessage: 'Account locked'
                      })
                    )
                  }}>
                  {intl.formatMessage({
                    id: 'CmsAccountsActionsLock',
                    defaultMessage: 'Lock'
                  })}
                </Button>
              )}
              <Button
                colorScheme="red"
                isDisabled={isBusy}
                onClick={deleteDialog.onOpen}>
                {intl.formatMessage({
                  id: 'CmsAccountsActionsDelete',
                  defaultMessage: 'Delete account'
                })}
              </Button>
            </ButtonGroup>
          </Stack>
        </CardBody>
      </Card>

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={deleteCancelRef}
        onClose={deleteDialog.onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              {intl.formatMessage({
                id: 'CmsAccountsDeleteTitle',
                defaultMessage: 'Delete account'
              })}
            </AlertDialogHeader>
            <AlertDialogBody>
              {intl.formatMessage(
                {
                  id: 'CmsAccountsDeletePrompt',
                  defaultMessage:
                    'Are you sure you want to delete {username}? This cannot be undone.'
                },
                {username: user.userName}
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={deleteCancelRef} onClick={deleteDialog.onClose}>
                {intl.formatMessage({
                  id: 'CmsAccountsActionsCancel',
                  defaultMessage: 'Cancel'
                })}
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                isLoading={isBusy}
                onClick={() => {
                  void onDelete()
                }}>
                {intl.formatMessage({
                  id: 'CmsAccountsActionsDelete',
                  defaultMessage: 'Delete account'
                })}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={passwordModal.isOpen} onClose={passwordModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {intl.formatMessage({
              id: 'CmsAccountsPasswordTitle',
              defaultMessage: 'Set a new password'
            })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="4">
              <FormControl isRequired>
                <FormLabel>
                  {intl.formatMessage({
                    id: 'CmsAccountsPasswordNew',
                    defaultMessage: 'New password'
                  })}
                </FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={event => {
                    setNewPassword(event.target.value)
                  }}
                />
              </FormControl>
              <Checkbox
                isChecked={passwordChangeRequired}
                onChange={event => {
                  setPasswordChangeRequired(event.target.checked)
                }}>
                {intl.formatMessage({
                  id: 'CmsAccountsPasswordChangeRequired',
                  defaultMessage: 'Require a change on next sign-in'
                })}
              </Checkbox>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={passwordModal.onClose}>
              {intl.formatMessage({
                id: 'CmsAccountsActionsCancel',
                defaultMessage: 'Cancel'
              })}
            </Button>
            <Button
              isDisabled={!newPassword}
              isLoading={isBusy}
              onClick={() => {
                void onSetPassword()
              }}>
              {intl.formatMessage({
                id: 'CmsAccountsActionsSetPassword',
                defaultMessage: 'Set password'
              })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={roleModal.isOpen} onClose={roleModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {roleModalAuthorization
              ? intl.formatMessage({
                  id: 'CmsAccountsRolesEditTitle',
                  defaultMessage: 'Edit granted roles'
                })
              : intl.formatMessage({
                  id: 'CmsAccountsRolesGrantTitle',
                  defaultMessage: 'Grant project roles'
                })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="4">
              {!roleModalAuthorization ? (
                <FormControl>
                  <FormLabel>
                    {intl.formatMessage({
                      id: 'CmsAccountsRolesProject',
                      defaultMessage: 'Project'
                    })}
                  </FormLabel>
                  <Input
                    value={roleModalProjectId}
                    onChange={event => {
                      setRoleModalProjectId(event.target.value)
                    }}
                    onBlur={() => {
                      void openRoleModal(null, roleModalProjectId)
                    }}
                  />
                </FormControl>
              ) : null}

              {rolesLoading ? (
                <SkeletonText noOfLines={3} />
              ) : availableRoles.length > 0 ? (
                <CheckboxGroup
                  value={selectedRoleKeys}
                  onChange={values => {
                    setSelectedRoleKeys(values.map(String))
                  }}>
                  <Stack>
                    {availableRoles.map(role => (
                      <Checkbox key={role.key} value={role.key}>
                        {role.displayName || role.key}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              ) : (
                <Text color="fg.muted">
                  {intl.formatMessage({
                    id: 'CmsAccountsRolesNoneAvailable',
                    defaultMessage: 'No roles available for this project.'
                  })}
                </Text>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={roleModal.onClose}>
              {intl.formatMessage({
                id: 'CmsAccountsActionsCancel',
                defaultMessage: 'Cancel'
              })}
            </Button>
            <Button
              isDisabled={selectedRoleKeys.length === 0}
              isLoading={isBusy}
              onClick={() => {
                void onSaveRoles()
              }}>
              {intl.formatMessage({
                id: 'CmsAccountsRolesSave',
                defaultMessage: 'Save roles'
              })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}

export default UserDetailsPage

export const pageConfig: PageConfig = {
  label: intlText('CmsAccountsPageTitle', 'Jaen CMS | Accounts'),
  icon: 'FaUser',
  layout: {
    name: 'jaen',
    type: 'form'
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
