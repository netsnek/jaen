import {PageConfig} from 'jaen'
import {PageProps, navigate as gatsbyNavigate} from 'gatsby'
import React from 'react'
import {NavigationProvider} from '../../navigation'
import {DashboardView} from '../../views/DashboardView'

const DashboardPage: React.FC<PageProps> = () => {
  const nav = React.useCallback(
    (path: string) => gatsbyNavigate(`/app${path}`),
    []
  )

  return (
    <NavigationProvider value={{navigate: nav, params: {}}}>
      <DashboardView />
    </NavigationProvider>
  )
}

export default DashboardPage

export const pageConfig: PageConfig = {
  label: 'Dashboard',
  icon: 'FaTachometerAlt',
  menu: {
    order: 5,
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
