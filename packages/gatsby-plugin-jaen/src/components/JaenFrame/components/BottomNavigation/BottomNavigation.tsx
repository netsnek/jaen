import React from 'react'

import {Icon} from '@chakra-ui/react'
import {useLocation} from '@reach/router'
import {Link} from 'gatsby'
import {checkUserRoles, useAuth} from 'jaen'

import {FaCalendarCheck} from '@react-icons/all-files/fa/FaCalendarCheck'
import {FaCog} from '@react-icons/all-files/fa/FaCog'
import {FaMapMarkerAlt} from '@react-icons/all-files/fa/FaMapMarkerAlt'
import {FaTachometerAlt} from '@react-icons/all-files/fa/FaTachometerAlt'
import {FaUser} from '@react-icons/all-files/fa/FaUser'
import {FaUsers} from '@react-icons/all-files/fa/FaUsers'

import {cn} from '../../../../lib/utils'

const itemsBase = [
  {
    id: 'settings',
    label: 'Settings',
    icon: FaCog,
    to: '/settings'
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: FaMapMarkerAlt,
    to: '/app/locations'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: FaTachometerAlt,
    to: '/app/dashboard'
  },
  {
    id: 'booking',
    label: 'Booking',
    icon: FaCalendarCheck,
    to: '/app/booking'
  }
] as const

export const BottomNavigation: React.FC = () => {
  const {pathname} = useLocation()
  const auth = useAuth()

  const isAdmin = checkUserRoles(auth.user, ['jaen:admin'])
  const isDriver = checkUserRoles(auth.user, ['limosen:driver'])
  const isCustomer = checkUserRoles(auth.user, ['limosen:customer'])

  const accountItem = isAdmin
    ? {
        id: 'accounts',
        label: 'Accounts',
        icon: FaUsers,
        to: '/app/users'
      }
    : {
        id: 'account',
        label: 'Account',
        icon: FaUser,
        to: '/app/account'
      }

  // Start from base items + account and adjust the "booking" item per role
  const items = [...itemsBase, accountItem].map(item => {
    if (item.id === 'booking') {
      // limosen:driver or jaen:admin → show Transfers on /app/transfers/
      if (isAdmin || isDriver) {
        return {
          ...item,
          id: 'transfers',
          label: 'Transfers',
          to: '/app/transfers/'
        }
      }

      // limosen:customer → keep label Booking but go to /app/booking/
      if (isCustomer) {
        return {
          ...item,
          to: '/app/booking/'
        }
      }
    }

    return item
  })

  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-border bg-white md:hidden z-40 pb-4">
      <ul className="flex items-center justify-around py-2">
        {items.map(item => {
          const isActive =
            item.to === '/'
              ? pathname === item.to
              : pathname.startsWith(item.to)

          return (
            <li key={item.id} className="flex-1">
              <Link
                to={item.to}
                className={cn(
                  'flex flex-col items-center gap-1 text-xs font-medium no-underline transition-colors duration-150',
                  isActive
                    ? 'text-brand-500'
                    : 'text-muted-foreground hover:text-foreground'
                )}>
                <Icon as={item.icon} boxSize={5} />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomNavigation
