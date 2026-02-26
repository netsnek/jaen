import {PageConfig} from 'jaen'
import {PageProps, navigate as gatsbyNavigate} from 'gatsby'
import React from 'react'
import {NavigationProvider} from '../../navigation'
import {LocationsView} from '../../views/LocationsView'

const LocationsPage: React.FC<PageProps> = () => {
  const nav = React.useCallback(
    (path: string) => gatsbyNavigate(`/app${path}`),
    []
  )

  return (
    <NavigationProvider value={{navigate: nav, params: {}}}>
      <LocationsView />
    </NavigationProvider>
  )
}

export default LocationsPage

export const pageConfig: PageConfig = {
  label: 'Locations',
  icon: 'FaMapMarkerAlt',
  menu: {
    order: 25,
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
