import {PageConfig} from 'jaen'
import {PageProps, navigate as gatsbyNavigate} from 'gatsby'
import React from 'react'
import {NavigationProvider} from '../../../navigation'
import {BookingView} from '../../../views/BookingView'

const BookingPage: React.FC<PageProps> = () => {
  const nav = React.useCallback(
    (path: string) => gatsbyNavigate(`/app${path}`),
    []
  )

  return (
    <NavigationProvider value={{navigate: nav, params: {}}}>
      <BookingView />
    </NavigationProvider>
  )
}

export default BookingPage

export const pageConfig: PageConfig = {
  label: 'Booking',
  icon: 'FaCalendarCheck',
  menu: {
    order: 15,
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
