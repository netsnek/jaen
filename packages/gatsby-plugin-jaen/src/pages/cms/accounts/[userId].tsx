import {PageConfig, useAuth, useNotificationsContext, zitadelGql} from 'jaen'
import {intlText} from '../../../lib/intl'
import {navigate, PageProps} from 'gatsby'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useIntl} from 'react-intl'

import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  CheckboxGroup,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Stat,
  Text,
  useDisclosure,
  Dialog,
  Portal,
  Separator,
  Field
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
  const {toast} = useNotificationsContext()

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
    (ok: boolean, message: string | null | undefined, successTitle: string) => {
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
      <Stack gap="6">
        <Card.Root variant="outline">
          <Card.Header>
            <HStack gap="4">
              <SkeletonCircle size="20" />
              <Skeleton height="24px" width="30%" />
            </HStack>
          </Card.Header>
          <Card.Body>
            <SkeletonText lineClamp={4} />
          </Card.Body>
        </Card.Root>
        <Card.Root variant="outline">
          <Card.Body>
            <SimpleGrid columns={{base: 1, md: 2}} gap="4">
              {Array.from({length: 6}).map((_, index) => (
                <Skeleton key={index} height="40px" />
              ))}
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
      </Stack>
    )
  }

  if (error) {
    return (
      <Stack gap="4" alignItems="flex-start">
        <Button
          variant="plain"
          onClick={() => {
            void navigate('../')
          }}>
          {intl.formatMessage({
            id: 'CmsAccountsDetailBack',
            defaultMessage: 'Back to accounts'
          })}
        </Button>
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>
            {intl.formatMessage({
              id: 'CmsAccountsErrorsDetailTitle',
              defaultMessage: 'Unable to load this account'
            })}
          </Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      </Stack>
    )
  }

  if (!user) return null

  const isActive = user.state === 'USER_STATE_ACTIVE'
  const isLocked = user.state === 'USER_STATE_LOCKED'

  return (
    <Stack gap="6">
      <Button
        alignSelf="flex-start"
        variant="plain"
        onClick={() => {
          void navigate('../')
        }}>
        {intl.formatMessage({
          id: 'CmsAccountsDetailBack',
          defaultMessage: 'Back to accounts'
        })}
      </Button>

      <Card.Root variant="outline">
        <Card.Header>
          <HStack gap="4" alignItems="flex-start">
            <Avatar.Root size="lg">
              <Avatar.Fallback
                name={user.profile.displayName ?? user.userName}
              />
            </Avatar.Root>
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
              <Badge colorPalette={isActive ? 'green' : 'purple'}>
                {stateLabel(user.state)}
              </Badge>
            ) : null}
          </HStack>
        </Card.Header>
        <Card.Body>
          <Stack gap="4">
            <SimpleGrid columns={{base: 1, md: 3}} gap="4">
              <Stat.Root>
                <Stat.Label>
                  {intl.formatMessage({
                    id: 'CmsAccountsDetailUsername',
                    defaultMessage: 'Username'
                  })}
                </Stat.Label>
                <Stat.ValueText fontSize="md">
                  {user.userName || '—'}
                </Stat.ValueText>
              </Stat.Root>
              <Stat.Root>
                <Stat.Label>
                  {intl.formatMessage({
                    id: 'CmsAccountsDetailPreferredLogin',
                    defaultMessage: 'Preferred login'
                  })}
                </Stat.Label>
                <Stat.ValueText fontSize="md">
                  {user.preferredLoginName || '—'}
                </Stat.ValueText>
              </Stat.Root>
              <Stat.Root>
                <Stat.Label>
                  {intl.formatMessage({
                    id: 'CmsAccountsDetailState',
                    defaultMessage: 'Account state'
                  })}
                </Stat.Label>
                <Stat.ValueText fontSize="md">
                  {stateLabel(user.state) || '—'}
                </Stat.ValueText>
              </Stat.Root>
            </SimpleGrid>

            <Separator />

            <SimpleGrid columns={{base: 1, md: 3}} gap="4">
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
        </Card.Body>
      </Card.Root>

      <Card.Root variant="outline">
        <Card.Header>
          <Heading size="sm">
            {intl.formatMessage({
              id: 'CmsAccountsProfileTitle',
              defaultMessage: 'Profile'
            })}
          </Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" asChild>
            <form onSubmit={onSubmit}>
              <SimpleGrid columns={{base: 1, md: 2}} gap="4">
                <Field.Root>
                  <Field.Label>
                    {intl.formatMessage({
                      id: 'CmsAccountsProfileDisplayName',
                      defaultMessage: 'Display name'
                    })}
                  </Field.Label>
                  <Input {...register('displayName')} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>
                    {intl.formatMessage({
                      id: 'CmsAccountsProfileLanguage',
                      defaultMessage: 'Preferred language'
                    })}
                  </Field.Label>
                  <Input placeholder="de" {...register('preferredLanguage')} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>
                    {intl.formatMessage({
                      id: 'CmsAccountsProfileFirstName',
                      defaultMessage: 'First name'
                    })}
                  </Field.Label>
                  <Input {...register('firstName')} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>
                    {intl.formatMessage({
                      id: 'CmsAccountsProfileLastName',
                      defaultMessage: 'Last name'
                    })}
                  </Field.Label>
                  <Input {...register('lastName')} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>
                    {intl.formatMessage({
                      id: 'CmsAccountsProfileEmail',
                      defaultMessage: 'Email'
                    })}
                  </Field.Label>
                  <Input type="email" {...register('email')} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>
                    {intl.formatMessage({
                      id: 'CmsAccountsProfilePhone',
                      defaultMessage: 'Phone'
                    })}
                  </Field.Label>
                  <Input {...register('phone')} />
                </Field.Root>
              </SimpleGrid>

              <Flex justifyContent="flex-end" gap="2">
                <Button
                  variant="ghost"
                  disabled={!isDirty || isSubmitting}
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
                  loading={isSubmitting}
                  disabled={!isDirty && !isSubmitting}>
                  {intl.formatMessage({
                    id: 'CmsAccountsProfileSave',
                    defaultMessage: 'Save changes'
                  })}
                </Button>
              </Flex>
            </form>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root variant="outline">
        <Card.Header>
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
        </Card.Header>
        <Card.Body>
          {user.authorizations.length > 0 ? (
            <Stack gap="4" separator={<Separator />}>
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
                      colorPalette="red"
                      disabled={isBusy}
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
        </Card.Body>
      </Card.Root>

      <Card.Root variant="outline">
        <Card.Header>
          <Heading size="sm">
            {intl.formatMessage({
              id: 'CmsAccountsActionsTitle',
              defaultMessage: 'Account actions'
            })}
          </Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap="4">
            <ButtonGroup variant="outline" flexWrap="wrap" gap="2">
              <Button disabled={isBusy} onClick={passwordModal.onOpen}>
                {intl.formatMessage({
                  id: 'CmsAccountsActionsSetPassword',
                  defaultMessage: 'Set password'
                })}
              </Button>
              <Button
                disabled={isBusy}
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
                disabled={isBusy}
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

            <ButtonGroup variant="outline" flexWrap="wrap" gap="2">
              {isActive ? (
                <Button
                  disabled={isBusy}
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
                  disabled={isBusy}
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
                  disabled={isBusy}
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
                  disabled={isBusy}
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
                colorPalette="red"
                disabled={isBusy}
                onClick={deleteDialog.onOpen}>
                {intl.formatMessage({
                  id: 'CmsAccountsActionsDelete',
                  defaultMessage: 'Delete account'
                })}
              </Button>
            </ButtonGroup>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Dialog.Root
        open={deleteDialog.open}
        initialFocusEl={() => deleteCancelRef.current}
        role="alertdialog"
        onOpenChange={e => {
          if (!e.open) {
            deleteDialog.onClose()
          }
        }}>
        <Portal>
          <Dialog.Backdrop>
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  {intl.formatMessage({
                    id: 'CmsAccountsDeleteTitle',
                    defaultMessage: 'Delete account'
                  })}
                </Dialog.Header>
                <Dialog.Body>
                  {intl.formatMessage(
                    {
                      id: 'CmsAccountsDeletePrompt',
                      defaultMessage:
                        'Are you sure you want to delete {username}? This cannot be undone.'
                    },
                    {username: user.userName}
                  )}
                </Dialog.Body>
                <Dialog.Footer>
                  <Button ref={deleteCancelRef} onClick={deleteDialog.onClose}>
                    {intl.formatMessage({
                      id: 'CmsAccountsActionsCancel',
                      defaultMessage: 'Cancel'
                    })}
                  </Button>
                  <Button
                    colorPalette="red"
                    ml={3}
                    loading={isBusy}
                    onClick={() => {
                      void onDelete()
                    }}>
                    {intl.formatMessage({
                      id: 'CmsAccountsActionsDelete',
                      defaultMessage: 'Delete account'
                    })}
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Backdrop>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={passwordModal.open}
        onOpenChange={e => {
          if (!e.open) {
            passwordModal.onClose()
          }
        }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                {intl.formatMessage({
                  id: 'CmsAccountsPasswordTitle',
                  defaultMessage: 'Set a new password'
                })}
              </Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <Stack gap="4">
                  <Field.Root required>
                    <Field.Label>
                      {intl.formatMessage({
                        id: 'CmsAccountsPasswordNew',
                        defaultMessage: 'New password'
                      })}
                    </Field.Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onValueChange={event => {
                        setNewPassword(event.target.value)
                      }}
                    />
                  </Field.Root>
                  <Checkbox.Root
                    onCheckedChange={event => {
                      setPasswordChangeRequired(event.target.checked)
                    }}
                    checked={passwordChangeRequired}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label>
                      {intl.formatMessage({
                        id: 'CmsAccountsPasswordChangeRequired',
                        defaultMessage: 'Require a change on next sign-in'
                      })}
                    </Checkbox.Label>
                  </Checkbox.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" mr={3} onClick={passwordModal.onClose}>
                  {intl.formatMessage({
                    id: 'CmsAccountsActionsCancel',
                    defaultMessage: 'Cancel'
                  })}
                </Button>
                <Button
                  disabled={!newPassword}
                  loading={isBusy}
                  onClick={() => {
                    void onSetPassword()
                  }}>
                  {intl.formatMessage({
                    id: 'CmsAccountsActionsSetPassword',
                    defaultMessage: 'Set password'
                  })}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={roleModal.open}
        onOpenChange={e => {
          if (!e.open) {
            roleModal.onClose()
          }
        }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                {roleModalAuthorization
                  ? intl.formatMessage({
                      id: 'CmsAccountsRolesEditTitle',
                      defaultMessage: 'Edit granted roles'
                    })
                  : intl.formatMessage({
                      id: 'CmsAccountsRolesGrantTitle',
                      defaultMessage: 'Grant project roles'
                    })}
              </Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <Stack gap="4">
                  {!roleModalAuthorization ? (
                    <Field.Root>
                      <Field.Label>
                        {intl.formatMessage({
                          id: 'CmsAccountsRolesProject',
                          defaultMessage: 'Project'
                        })}
                      </Field.Label>
                      <Input
                        value={roleModalProjectId}
                        onValueChange={event => {
                          setRoleModalProjectId(event.target.value)
                        }}
                        onBlur={() => {
                          void openRoleModal(null, roleModalProjectId)
                        }}
                      />
                    </Field.Root>
                  ) : null}

                  {rolesLoading ? (
                    <SkeletonText lineClamp={3} />
                  ) : availableRoles.length > 0 ? (
                    <CheckboxGroup
                      value={selectedRoleKeys}
                      onValueChange={values => {
                        setSelectedRoleKeys(values.map(String))
                      }}>
                      <Stack>
                        {availableRoles.map(role => (
                          <Checkbox.Root key={role.key} value={role.key}>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control>
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                            <Checkbox.Label>
                              {role.displayName || role.key}
                            </Checkbox.Label>
                          </Checkbox.Root>
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
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" mr={3} onClick={roleModal.onClose}>
                  {intl.formatMessage({
                    id: 'CmsAccountsActionsCancel',
                    defaultMessage: 'Cancel'
                  })}
                </Button>
                <Button
                  disabled={selectedRoleKeys.length === 0}
                  loading={isBusy}
                  onClick={() => {
                    void onSaveRoles()
                  }}>
                  {intl.formatMessage({
                    id: 'CmsAccountsRolesSave',
                    defaultMessage: 'Save roles'
                  })}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
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
