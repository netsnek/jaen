import {PageConfig} from 'jaen'
import {PageProps} from 'gatsby'
import React from 'react'

import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text
} from '@chakra-ui/react'

const stats = [
  {label: 'Active Bookings', value: '24', change: '+8.4%'},
  {label: 'Fleet Utilization', value: '78%', change: '+2.1%'},
  {label: 'Customer Satisfaction', value: '4.8/5', change: 'Last 30 days'},
  {label: 'Revenue', value: '$12.4k', change: 'This month'}
]

const DashboardPage: React.FC<PageProps> = () => {
  return (
    <Flex direction="column" gap={8} py={8} px={{base: 4, md: 8}}>
      <Box>
        <Heading size="lg" mb={2}>
          Dashboard
        </Heading>
        <Text color="gray.500">
          Get a quick overview of how your business is performing today.
        </Text>
      </Box>

      <SimpleGrid columns={{base: 1, sm: 2, xl: 4}} spacing={6}>
        {stats.map(stat => (
          <Stat
            key={stat.label}
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            bg="white"
            shadow="sm">
            <StatLabel>{stat.label}</StatLabel>
            <StatNumber>{stat.value}</StatNumber>
            <StatHelpText>{stat.change}</StatHelpText>
          </Stat>
        ))}
      </SimpleGrid>
    </Flex>
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
