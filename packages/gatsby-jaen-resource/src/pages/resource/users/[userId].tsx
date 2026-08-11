import {
  PageConfig,
  PageProps,
  useAuthenticationContext,
  useNotificationsContext
} from 'jaen'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Flex,
  HStack,
  Input,
  InputGroup,
  Skeleton,
  Stack,
  Switch,
  Table,
  Text,
  Field
} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import {forwardRef, useEffect, useState} from 'react'
import {Controller, useFieldArray, useForm} from 'react-hook-form'

import {useUser, useUsers} from '../../../hooks'

type FormValues = {
  emailAddress: string
  details?: {
    avatarURL?: string
    firstName?: string
    lastName?: string
  }
  username: string
  isActive: boolean
  isAdmin: boolean
  password?: string
  roles: {
    id: string
    description: string
  }[]
}

const PasswordInput = forwardRef<HTMLInputElement, any>(
  ({register, ...props}, ref) => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    return (
      /**
       * v3's InputGroup clones its single child with a computed `pe` derived
       * from the input height, so the reserved 4.5rem has to be written as `pe`
       * to win that merge; as `pr` it would sit alongside the narrower `pe` and
       * the winner would come down to declaration order. Identical rendering in
       * LTR, which is all this admin is. `px: 0` restores v2's
       * InputRightElement box, since v3's InputElement adds its own px="3" and
       * would otherwise squeeze the button inside the 4.5rem slot. The dropped
       * size="md" no longer has anywhere to go now that InputGroup is a plain
       * Group; it was already a no-op, md being Input's default size.
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

const Page: React.FC<PageProps> = props => {
  const userId = props.params.userId ?? ''

  const auth = useAuthenticationContext()

  const {user, isLoading} = useUser(userId)
  const {updateUser, deleteUser} = useUsers()
  const [changePasword, setChangePassword] = useState(false)

  const defaultValues = user
    ? {
        emailAddress: user.primaryEmailAddress,
        details: {
          firstName: user.details?.firstName,
          lastName: user.details?.lastName
        },
        username: user.username,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
        roles: user.roles
      }
    : {}

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: {errors, isSubmitting, isDirty}
  } = useForm<FormValues>({
    defaultValues
  })

  const {remove, append, fields} = useFieldArray({
    control,
    name: 'roles',
    keyName: 'key'
  })

  const {confirm} = useNotificationsContext()

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

  const onReset = () => {
    reset(defaultValues)

    setChangePassword(false)
  }

  useEffect(() => {
    onReset()
  }, [user])

  const onSubmit = async (values: FormValues) => {
    // Get diff between old and new values typescript

    const diff: any = {}

    Object.keys(values).forEach(key => {
      if ((values as any)[key] !== (defaultValues as any)[key]) {
        diff[key] = (values as any)[key]
      }
    })

    // only use role ids
    diff.roles = diff.roles.filter(Boolean).map((role: any) => role.id)

    const success = await updateUser(userId, diff)

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
    <Stack>
      <Card.Root mt={8} p={4}>
        <Stack>
          <HStack>
            <Avatar.Root>
              <Avatar.Fallback name={user?.username} />
              <Avatar.Image src={user?.details?.avatarURL} />
            </Avatar.Root>
            <Stack gap="0.5">
              <Text fontWeight="bold" lineHeight="none">
                {user?.username} ({user?.primaryEmailAddress})
              </Text>
              <Text color="muted" lineHeight="none">
                {user?.details?.firstName} {user?.details?.lastName}
              </Text>
            </Stack>
          </HStack>
        </Stack>
      </Card.Root>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="4">
          <Field.Root>
            <Skeleton width={'fit-content'} loading={!!isLoading}>
              <Field.Label>ID</Field.Label>
            </Skeleton>
            <Skeleton loading={!!isLoading}>
              <Input placeholder={user?.id} disabled />
            </Skeleton>
          </Field.Root>
          <Field.Root invalid={!!errors.emailAddress}>
            <Skeleton width={'fit-content'} loading={!!isLoading}>
              <Field.Label>E-Mail</Field.Label>
            </Skeleton>
            <Skeleton loading={!!isLoading}>
              <Input
                disabled
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
            <Field.ErrorText>{errors.emailAddress?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.username}>
            <Skeleton width={'fit-content'} loading={!!isLoading}>
              <Field.Label>Username</Field.Label>
            </Skeleton>
            <Skeleton loading={!!isLoading}>
              <Input
                placeholder="john.doe"
                {...register('username', {
                  required: 'This is required'
                })}
              />
            </Skeleton>
            <Field.ErrorText>
              {errors.details?.firstName?.message}
            </Field.ErrorText>
          </Field.Root>

          <Stack direction="row">
            <Flex flex={1}>
              <Field.Root mt={4} invalid={!!errors.details?.lastName}>
                <Skeleton width={'fit-content'} loading={!!isLoading}>
                  <Field.Label>Firstname</Field.Label>
                </Skeleton>
                <Skeleton loading={!!isLoading}>
                  <Input
                    placeholder="John"
                    {...register('details.firstName', {})}
                  />
                </Skeleton>
                <Field.ErrorText>
                  {errors.details?.lastName?.message}
                </Field.ErrorText>
              </Field.Root>
            </Flex>
            <Flex flex={1}>
              <Field.Root mt={4} invalid={!!errors.details?.lastName}>
                <Skeleton width={'fit-content'} loading={!!isLoading}>
                  <Field.Label>Lastname</Field.Label>
                </Skeleton>
                <Skeleton loading={!!isLoading}>
                  <Input
                    width={'full'}
                    placeholder="Doe"
                    {...register('details.lastName', {})}
                  />
                </Skeleton>
                <Field.ErrorText>
                  {errors.details?.lastName?.message}
                </Field.ErrorText>
              </Field.Root>
            </Flex>
          </Stack>

          <Field.Root invalid={!!errors.password}>
            <Skeleton width={'fit-content'} loading={!!isLoading}>
              <Field.Label>Password</Field.Label>
            </Skeleton>
            {changePasword ? (
              <Skeleton loading={!!isLoading}>
                <PasswordInput
                  {...register('password', {
                    required: 'This is required'
                  })}
                />
              </Skeleton>
            ) : (
              <Skeleton width={'fit-content'} loading={!!isLoading}>
                <Button onClick={() => setChangePassword(true)}>Change </Button>
              </Skeleton>
            )}
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.isActive}>
            <Skeleton width={'fit-content'} loading={!!isLoading}>
              <Field.Label>Active</Field.Label>
            </Skeleton>
            <Skeleton width={'fit-content'} loading={!!isLoading}>
              <Controller
                control={control}
                name="isActive"
                defaultValue={user?.isActive}
                render={({field: {value, onChange, onBlur, ref}}) => (
                  /**
                   * ref and onBlur belong on the hidden input, which is where
                   * v2's Switch forwarded them, so react-hook-form can still
                   * focus the field on a validation error. v2 handed onChange
                   * the change event and let RHF pull target.checked out of it;
                   * zag hands us the boolean, so unwrap it here.
                   */
                  <Switch.Root
                    checked={value}
                    onCheckedChange={details => onChange(details.checked)}>
                    <Switch.HiddenInput ref={ref} onBlur={onBlur} />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                )}
              />
            </Skeleton>
            <Field.ErrorText>{errors.isActive?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Roles</Field.Label>

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Role</Table.ColumnHeader>
                  <Table.ColumnHeader>ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Active</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {auth.user?.resource?.roles ? (
                  auth.user.resource.roles.map((role, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{role.description}</Table.Cell>
                      <Table.Cell>{role.id}</Table.Cell>
                      <Table.Cell textAlign="right">
                        <Checkbox.Root
                          onCheckedChange={details => {
                            if (details.checked) {
                              append(role)
                            } else {
                              const found = fields.findIndex(
                                field => field.id === role.id
                              )

                              if (found > -1) {
                                remove(found)
                              }
                            }
                          }}
                          checked={
                            !!fields.find(field => field.id === role.id)
                          }>
                          <Checkbox.HiddenInput />
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={3}>
                      <HStack>
                        <Text>
                          No roles found. Please contact your administrator.
                        </Text>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Field.Root>

          <Field.Root invalid={!!errors.isAdmin}>
            <Skeleton width={'fit-content'} loading={!!isLoading}>
              <Field.Label>Admin</Field.Label>
            </Skeleton>
            <Skeleton width={'fit-content'} loading={!!isLoading}>
              <Controller
                control={control}
                name="isAdmin"
                defaultValue={user?.isAdmin}
                render={({field: {value, onChange, onBlur, ref}}) => (
                  <Switch.Root
                    checked={value}
                    onCheckedChange={details => onChange(details.checked)}>
                    <Switch.HiddenInput ref={ref} onBlur={onBlur} />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                )}
              />
            </Skeleton>
            <Field.ErrorText>{errors.isAdmin?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Skeleton width={'fit-content'} loading={!!isLoading}>
              <Field.Label>Created at</Field.Label>
            </Skeleton>
            <Skeleton loading={!!isLoading}>
              <Input
                placeholder={new Date(user?.createdAt ?? 0).toDateString()}
                disabled
              />
            </Skeleton>
          </Field.Root>

          <Box mt={4}>
            <HStack width="full">
              {/**
               * v2's ButtonGroup published isDisabled through its context and
               * every Button below it picked that up. v3's only feeds the
               * button recipe's own variants (size, variant) down that path, so
               * a disabled on the group would land on its div and leave the
               * buttons live. Repeating it per button is what keeps both greyed
               * out on a pristine form, as before. Delete stays outside the
               * group and stays enabled, also as before.
               */}
              <ButtonGroup>
                <Skeleton width={'fit-content'} loading={!!isLoading}>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isDirty}>
                    Save Changes
                  </Button>
                </Skeleton>
                <Skeleton width={'fit-content'} loading={!!isLoading}>
                  <Button
                    variant="outline"
                    onClick={onReset}
                    disabled={!isDirty}>
                    Cancel
                  </Button>
                </Skeleton>
              </ButtonGroup>
              <Skeleton width={'fit-content'} loading={!!isLoading}>
                <Button variant="outline" onClick={handleDelete}>
                  Delete
                </Button>
              </Skeleton>
            </HStack>
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
      label: 'Resource',
      path: '/resource/'
    },
    {
      label: 'Users',
      path: '/resource/users/'
    },
    {
      label: 'Update user',
      path: '/resource/users/'
    }
  ],
  auth: {
    isRequired: true,
    isAdminRequired: true
  }
}
