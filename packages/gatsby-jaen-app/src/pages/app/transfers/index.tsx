import {PageConfig} from 'jaen'
import {PageProps, navigate as gatsbyNavigate} from 'gatsby'
import React from 'react'
import {NavigationProvider} from '../../../navigation'
import {TransfersView} from '../../../views/TransfersView'

const TransfersPage: React.FC<PageProps> = () => {
  const nav = React.useCallback(
    (path: string) => gatsbyNavigate(`/app${path}`),
    []
  )

  return (
    <NavigationProvider value={{navigate: nav, params: {}}}>
      <TransfersView />
    </NavigationProvider>
  )
}

export default TransfersPage

export const pageConfig: PageConfig = {
  label: 'Transfers',
  icon: 'FaExchangeAlt',
  menu: {
    order: 10,
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
