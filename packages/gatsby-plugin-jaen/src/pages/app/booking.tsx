import {PageConfig} from 'jaen'
import {PageProps} from 'gatsby'
import React from 'react'

import {
  Badge,
  Box,
  Button,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'

const bookings = [
  {
    id: 'BK-1021',
    customer: 'John Doe',
    date: '2024-04-12',
    status: 'Confirmed'
  },
  {
    id: 'BK-1020',
    customer: 'Jane Smith',
    date: '2024-04-11',
    status: 'Pending'
  },
  {
    id: 'BK-1019',
    customer: 'Michael Lee',
    date: '2024-04-10',
    status: 'Completed'
  }
]

const statusColorScheme = {
  Confirmed: 'green',
  Pending: 'orange',
  Completed: 'blue'
} as const

const BookingPage: React.FC<PageProps> = () => {
  return (
    <Stack spacing={8} py={8} px={{base: 4, md: 8}}>
      <Stack
        direction={{base: 'column', md: 'row'}}
        justify="space-between"
        spacing={4}>
        <Heading size="lg">Booking</Heading>
        <Button colorScheme="brand">New Booking</Button>
      </Stack>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflowX="auto"
        bg="white"
        shadow="sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Booking ID</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map(booking => (
              <Tr key={booking.id}>
                <Td>{booking.id}</Td>
                <Td>{booking.customer}</Td>
                <Td>{booking.date}</Td>
                <Td>
                  <Badge colorScheme={statusColorScheme[booking.status]}>
                    {booking.status}
                  </Badge>
                </Td>
                <Td textAlign="right">
                  <Button size="sm" variant="outline" mr={2}>
                    View
                  </Button>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Stack>
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
