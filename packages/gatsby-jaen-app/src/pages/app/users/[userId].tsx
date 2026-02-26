import {PageConfig} from 'jaen'
import {PageProps, navigate as gatsbyNavigate} from 'gatsby'
import React from 'react'
import {NavigationProvider} from '../../../navigation'
import {UserDetailView} from '../../../views/UserDetailView'

const UserDetailPage: React.FC<PageProps> = ({params}) => {
  const nav = React.useCallback(
    (path: string) => gatsbyNavigate(`/app${path}`),
    []
  )

  return (
    <NavigationProvider
      value={{navigate: nav, params: {userId: params.userId ?? ''}}}>
      <UserDetailView />
    </NavigationProvider>
  )
}

export default UserDetailPage

export const pageConfig: PageConfig = {
  label: 'User Detail',
  auth: {
    isRequired: true
  },
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
