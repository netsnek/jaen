import {Heading, Progress, Stack, Text, StackSeparator} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import {PageConfig, PageProps, useAuthUser, useNotificationsContext} from 'jaen'

import {sq} from '../../clients/lens/src'
import {PasswordUpdateForm} from '../../components/PasswordUpdateForm'

const Page: React.FC<PageProps> = () => {
  const {user, passwordPolicy, passwordUpdate} = useAuthUser()
  const {toast} = useNotificationsContext()

  const handlePasswordChange = async (
    oldPassword: string,
    newPassword: string
  ) => {
    const [_, errors] = await sq.mutate(m =>
      m.updateInternalPassword({password: newPassword})
    )

    const success = !errors || errors.length === 0

    if (success) {
      toast({
        title: 'Success',
        description: 'Password updated successfully',
        status: 'success'
      })

      navigate('/lens/')

      await passwordUpdate(oldPassword, newPassword)
    } else {
      toast({
        title: 'Error',
        description:
          'Failed to update password. This is likely a bug or a network issue. Please try again later.',
        status: 'error'
      })
    }
  }

  if (!user) {
    // a null value is what puts v3's progress into the indeterminate state
    return (
      <Progress.Root size="xs" value={null}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    )
  }

  return (
    <Stack
      separator={<StackSeparator borderColor="border.emphasized" />}
      id="momo"
      gap="4">
      <Stack>
        <Heading as="h2" size="sm">
          Set internal password
        </Heading>

        <Text fontSize="sm" color="fg.muted">
          This sets the passwords for the internal services accessed through
          Lens. After updating the password, you can access the internal
          services using your username{' '}
          <strong>&lt;{user?.preferredLoginName}&gt;</strong> and the password
          you have set.
        </Text>
      </Stack>

      <PasswordUpdateForm
        passwordPolicy={passwordPolicy}
        onPasswordUpdate={handlePasswordChange}
      />

      {/* the v2 `size="xs"` is dropped rather than mapped to textStyle: no
          theme ever defined Text sizes, so it rendered nothing. Making the
          note smaller is a design change and belongs in its own commit. */}
      <Text asChild>
        <em>
          Note: This password is only valid for services connected to Lens
          authentication. If you have any questions or issues, please reach out
          to your administrator.
        </em>
      </Text>
    </Stack>
  )
}

export const pageConfig: PageConfig = {
  label: 'Lens Password',
  icon: 'FaKey',
  layout: {
    name: 'jaen',
    type: 'form'
  },
  menu: {
    type: 'user',
    order: 500
  },
  auth: {
    isRequired: true
  },
  breadcrumbs: [
    {
      label: 'Lens',
      path: '/lens/'
    },
    {
      label: 'Password',
      path: '/lens/password/'
    }
  ],
  withoutJaenFrameStickyHeader: true
}

export default Page

export {Head} from 'jaen'
