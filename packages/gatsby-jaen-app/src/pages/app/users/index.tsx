import {PageConfig} from 'jaen'
import {PageProps, navigate as gatsbyNavigate} from 'gatsby'
import React from 'react'
import {NavigationProvider} from '../../../navigation'
import {UsersView} from '../../../views/UsersView'

const UsersPage: React.FC<PageProps> = () => {
  const nav = React.useCallback(
    (path: string) => gatsbyNavigate(`/app${path}`),
    []
  )

  return (
    <NavigationProvider value={{navigate: nav, params: {}}}>
      <UsersView />
    </NavigationProvider>
  )
}

export default UsersPage

export const pageConfig: PageConfig = {
  label: 'Users',
  icon: 'FaUsers',
  menu: {
    order: 20,
    type: 'app'
  },
  auth: {
    isRequired: true
  },
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
