import {PageConfig} from 'jaen'
import {PageProps} from 'gatsby'
import React from 'react'

import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text
} from '@chakra-ui/react'

const teamMembers = [
  {
    name: 'Alicia Brown',
    email: 'alicia@limousine.app',
    role: 'Administrator',
    status: 'Active'
  },
  {
    name: 'Samuel Green',
    email: 'samuel@limousine.app',
    role: 'Dispatcher',
    status: 'Invited'
  },
  {
    name: 'Priya Patel',
    email: 'priya@limousine.app',
    role: 'Driver',
    status: 'Active'
  }
]

const statusColorScheme = {
  Active: 'green',
  Invited: 'orange'
} as const

const AccountsPage: React.FC<PageProps> = () => {
  return (
    <Stack spacing={8} py={8} px={{base: 4, md: 8}}>
      <HStack justify="space-between" align="start" spacing={4} flexWrap="wrap">
        <Box>
          <Heading size="lg" mb={2}>
            Accounts
          </Heading>
          <Text color="gray.500">
            Invite teammates and manage their access levels.
          </Text>
        </Box>
        <Button colorScheme="brand">Invite Member</Button>
      </HStack>

      <Box borderWidth="1px" borderRadius="lg" overflowX="auto" bg="white" shadow="sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teamMembers.map(member => (
              <Tr key={member.email}>
                <Td>
                  <HStack spacing={3}>
                    <Avatar name={member.name} size="sm" />
                    <Text>{member.name}</Text>
                  </HStack>
                </Td>
                <Td>{member.email}</Td>
                <Td>{member.role}</Td>
                <Td>
                  <Badge colorScheme={statusColorScheme[member.status]}>
                    {member.status}
                  </Badge>
                </Td>
                <Td textAlign="right">
                  <Button size="sm" variant="ghost" mr={2}>
                    Manage
                  </Button>
                  <Button size="sm" variant="ghost" colorScheme="red">
                    Remove
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

export default AccountsPage

export const pageConfig: PageConfig = {
  label: 'Accounts',
  icon: 'FaUsers',
  menu: {
    order: 35,
    type: 'user'
  },
  auth: {
    isRequired: true,
    roles: ['jaen:admin']
  },
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
