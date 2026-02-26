import {PageConfig} from 'jaen'
import {PageProps, navigate as gatsbyNavigate} from 'gatsby'
import React from 'react'
import {NavigationProvider} from '../../../navigation'
import {BookingDetailView} from '../../../views/BookingDetailView'

const BookingDetailPage: React.FC<PageProps> = ({params}) => {
  const nav = React.useCallback(
    (path: string) => gatsbyNavigate(`/app${path}`),
    []
  )

  return (
    <NavigationProvider
      value={{navigate: nav, params: {bookingId: params.transferId ?? ''}}}>
      <BookingDetailView />
    </NavigationProvider>
  )
}

export default BookingDetailPage

export const pageConfig: PageConfig = {
  label: 'Booking Detail',
  auth: {
    isRequired: true
  },
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
