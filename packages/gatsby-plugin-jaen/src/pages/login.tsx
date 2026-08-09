import {PageConfig, useAuth} from 'jaen'
import {PageProps} from 'gatsby'
import React, {useEffect} from 'react'

import {intlText} from '../lib/intl'

const LoginPage: React.FC<PageProps> = () => {
  const auth = useAuth()

  useEffect(() => {
    auth.signinRedirect()
  }, [])

  return null
}

export default LoginPage

export const pageConfig: PageConfig = {
  label: intlText('AuthLogin', 'Login'),
  withoutJaenFrame: true,
  layout: {
    name: 'jaen',
    type: 'form'
  }
}

export {Head} from 'jaen'
