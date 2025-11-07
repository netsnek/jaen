import {PageConfig} from 'jaen'
import {PageProps} from 'gatsby'
import React from 'react'

import {
  Box,
  Button,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  VStack
} from '@chakra-ui/react'

const mockLocations = [
  {
    name: 'Downtown Office',
    address: '123 Main St, Springfield',
    status: 'Active'
  },
  {
    name: 'Airport Terminal',
    address: '987 Flight Ave, Springfield',
    status: 'Maintenance'
  },
  {
    name: 'City Center',
    address: '456 Market Rd, Springfield',
    status: 'Active'
  }
]

const LocationsPage: React.FC<PageProps> = () => {
  return (
    <Stack spacing={8} py={8} px={{base: 4, md: 8}}>
      <HStack justify="space-between" align="start" spacing={4} flexWrap="wrap">
        <VStack align="start" spacing={1}>
          <Heading size="lg">Locations</Heading>
          <Text color="gray.500">Manage your pickup and drop-off points.</Text>
        </VStack>
        <Button colorScheme="brand">Add Location</Button>
      </HStack>

      <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
        {mockLocations.map(location => (
          <Box
            key={location.name}
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            bg="white"
            shadow="sm"
          >
            <VStack align="start" spacing={3}>
              <HStack spacing={3}>
                <Heading size="md">{location.name}</Heading>
                <Tag colorScheme={location.status === 'Active' ? 'green' : 'orange'}>
                  {location.status}
                </Tag>
              </HStack>
              <Text color="gray.500">{location.address}</Text>
              <HStack spacing={2}>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="ghost" colorScheme="red">
                  Disable
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default LocationsPage

export const pageConfig: PageConfig = {
  label: 'Locations',
  icon: 'FaMapMarkerAlt',
  menu: {
    order: 20,
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
