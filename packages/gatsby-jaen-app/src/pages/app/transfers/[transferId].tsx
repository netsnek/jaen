import {PageConfig} from 'jaen'
import {PageProps, navigate as gatsbyNavigate} from 'gatsby'
import React from 'react'
import {NavigationProvider} from '../../../navigation'
import {TransferDetailView} from '../../../views/TransferDetailView'

const TransferDetailPage: React.FC<PageProps> = ({params}) => {
  const nav = React.useCallback(
    (path: string) => gatsbyNavigate(`/app${path}`),
    []
  )

  return (
    <NavigationProvider
      value={{navigate: nav, params: {transferId: params.transferId ?? ''}}}>
      <TransferDetailView />
    </NavigationProvider>
  )
}

export default TransferDetailPage

export const pageConfig: PageConfig = {
  label: 'Transfer Detail',
  auth: {
    isRequired: true
  },
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
