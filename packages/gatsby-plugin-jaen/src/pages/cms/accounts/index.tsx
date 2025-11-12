import {PageConfig} from 'jaen'
import {Link as GatsbyLink} from 'gatsby'
import React, {useCallback, useEffect, useMemo, useState} from 'react'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  InputGroup,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import {GQtyError} from 'gqty'

// GQty client
import * as gqtyIAMClient from '../../../../client/iam'

interface IamUserSummary {
  id: string
  userName: string
  preferredLoginName?: string | null
  loginNames: string[]
  state?: string | null
  displayName?: string | null
  email?: string | null
}

const AccountsPage: React.FC = () => {
  const [users, setUsers] = useState<IamUserSummary[]>([])
  const [filteredUsers, setFilteredUsers] = useState<IamUserSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await gqtyIAMClient.resolve(({query}) => {
        const allUsers = query.getAllUser()

        return {
          users: allUsers.map(user => ({
            id: user.id,
            userName: user.userName ?? '',
            preferredLoginName: user.preferredLoginName,
            loginNames: (user.loginNames ?? []).filter(
              (loginName): loginName is string => typeof loginName === 'string'
            ),
            state: user.state,
            displayName: user.human?.profile?.displayName,
            email: user.human?.email?.email
          }))
        }
      })

      setUsers(result.users)
      setFilteredUsers(result.users)
    } catch (err) {
      console.error(err)
      const message =
        err instanceof GQtyError
          ? 'Failed to load users from the IAM service.'
          : err instanceof Error
            ? err.message
            : 'Failed to load users.'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      setFilteredUsers(users)
      return
    }

    setFilteredUsers(
      users.filter(user => {
        const haystack = [
          user.userName,
          user.preferredLoginName ?? '',
          user.displayName ?? '',
          user.email ?? '',
          ...user.loginNames
        ]
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedSearch)
      })
    )
  }, [searchTerm, users])

  const emptyBackground = useColorModeValue('gray.50', 'gray.800')
  const emptyBorder = useColorModeValue('gray.200', 'gray.700')

  const skeletonCards = useMemo(
    () =>
      Array.from({length: 6}).map((_, index) => (
        <Card key={`skeleton-${index}`} variant="outline">
          <CardHeader>
            <Flex align="center" gap={4}>
              <SkeletonCircle size="12" />
              <Skeleton height="20px" width="40%" />
            </Flex>
          </CardHeader>
          <CardBody>
            <SkeletonText mt="4" noOfLines={3} spacing="3" />
          </CardBody>
        </Card>
      )),
    []
  )

  const userCards = useMemo(
    () =>
      filteredUsers.map(user => (
        <Card key={user.id} variant="outline" height="100%">
          <CardHeader>
            <Flex align="center" gap={4}>
              <Avatar name={user.displayName ?? user.userName} />
              <Box>
                <Heading as="h3" size="sm">
                  {user.displayName || user.userName || 'Unnamed user'}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {user.email || user.preferredLoginName || 'No email provided'}
                </Text>
              </Box>
              {user.state && (
                <Badge
                  ml="auto"
                  colorScheme={
                    user.state === 'USER_STATE_ACTIVE' ? 'green' : 'purple'
                  }>
                  {user.state.replace('USER_STATE_', '').toLowerCase()}
                </Badge>
              )}
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack spacing={3}>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  textTransform="uppercase"
                  color="gray.500">
                  Username
                </Text>
                <Text>{user.userName || '—'}</Text>
              </Box>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  textTransform="uppercase"
                  color="gray.500">
                  Login names
                </Text>
                <Stack spacing={1}>
                  {user.loginNames.length > 0 ? (
                    user.loginNames.map(login => (
                      <Text key={login} fontSize="sm">
                        {login}
                      </Text>
                    ))
                  ) : (
                    <Text fontSize="sm">No alternate login names</Text>
                  )}
                </Stack>
              </Box>
              <Button
                as={GatsbyLink}
                to={`/accounts/${user.id}`}
                alignSelf="flex-start"
                size="sm">
                Manage account
              </Button>
            </Stack>
          </CardBody>
        </Card>
      )),
    [filteredUsers]
  )

  return (
    <Stack spacing={8} py={{base: 6, md: 8}} px={{base: 4, md: 8}}>
      <Stack spacing={4}>
        <Heading size="lg">Accounts</Heading>
        <Text color="gray.500">
          Browse and manage user accounts from your IAM tenant.
        </Text>
      </Stack>

      <InputGroup maxW="sm">
        <Input
          placeholder="Search by name, email or login name"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
      </InputGroup>

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Unable to load accounts</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      )}

      <SimpleGrid columns={{base: 1, md: 2, xl: 3}} spacing={6}>
        {isLoading ? skeletonCards : userCards}
      </SimpleGrid>

      {!isLoading && filteredUsers.length === 0 && !error && (
        <Box
          borderWidth="1px"
          borderStyle="dashed"
          borderColor={emptyBorder}
          borderRadius="lg"
          bg={emptyBackground}
          p={8}
          textAlign="center">
          <Heading size="sm" mb={2}>
            No accounts match your search
          </Heading>
          <Text color="gray.500">
            Try adjusting your filters or clear the search to see all accounts.
          </Text>
        </Box>
      )}
    </Stack>
  )
}

export default AccountsPage

export const pageConfig: PageConfig = {
  label: 'Accounts',
  layout: {
    name: 'jaen'
  },
  breadcrumbs: [
    {
      label: 'Accounts',
      path: '/accounts/'
    }
  ],
  auth: {
    isRequired: true,
    isAdminRequired: true
  }
}

export {Head} from 'jaen'
