import {PageConfig, useAuthUser} from 'jaen'
import {PageProps} from 'gatsby'
import React from 'react'

import {Settings} from '../components/Settings'
import {intlText} from '../lib/intl'

const SettingsPage: React.FC<PageProps> = () => {
  const authUser = useAuthUser()

  return (
    <Settings
      user={authUser.user}
      passwordPolicy={authUser.passwordPolicy}
      onProfileAvatarUpdate={authUser.profileAvatarUpdate}
      onUsernameUpdate={authUser.usernameUpdate}
      onProfileUpdate={authUser.profileUpdate}
      onEmailUpdate={authUser.emailUpdate}
      onEmailResendCode={authUser.emailResendCode}
      onphoneUpdate={authUser.phoneUpdate}
      onphoneVerify={authUser.phoneVerify}
      onphoneResendCode={authUser.phoneResendCode}
      onphoneDelete={authUser.phoneDelete}
      onPasswordUpdate={authUser.passwordUpdate}
      onContactInformationRefresh={authUser.refresh}
    />
  )
}

export default SettingsPage

export const pageConfig: PageConfig = {
  label: intlText('AuthSettings', 'Settings'),
  icon: 'FaUserCog',
  menu: {
    order: 100,
    type: 'user'
  },
  auth: {
    isRequired: true
  },
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
