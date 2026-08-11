import {PageConfig, useAuth} from 'jaen'
import {navigate, PageProps} from 'gatsby'
import React from 'react'

import {intlText} from '../lib/intl'

const SignupPage: React.FC<PageProps> = () => {
  const auth = useAuth()

  React.useEffect(() => {
    if (auth.isAuthenticated) {
      void navigate('/')
    } else {
      auth.signinRedirect()
    }
  }, [auth.isAuthenticated])

  return null
}

export default SignupPage

export const pageConfig: PageConfig = {
  label: intlText('AuthSignup', 'Sign up'),
  withoutJaenFrame: true,
  layout: {
    name: 'jaen',
    type: 'form'
  }
}

export {Head} from 'jaen'
