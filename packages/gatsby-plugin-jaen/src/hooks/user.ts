import {useNotificationsContext} from 'jaen'

import {useCallback, useEffect, useState} from 'react'

import {GQtyError} from 'gqty'

import {resolve} from '../../client/iam'
import type {ZitadelUser} from '../../client/iam'

export interface ResourceUser {
  id: string
  primaryEmailAddress: string
  username: string
  createdAt: string | null
  details?: {
    avatarURL?: string
    firstName?: string
    lastName?: string
  }
  isActive: boolean
  isAdmin: boolean
  roles: Array<{id: string; description: string}>
}

export interface UserCreateInput {
  emailAddress: string
  username: string
  details?: {
    firstName?: string
    lastName?: string
  }
  password?: string
}

const windowAlert = (message: string) => {
  if (typeof window !== 'undefined') {
    window.alert(message)
  } else {
    console.warn(message)
  }
}

const mapIamUserToResourceUser = (
  user: ZitadelUser | null | undefined
): ResourceUser => {
  return {
    id: user?.id ?? '',
    primaryEmailAddress: user?.human?.email?.email ?? '',
    username: user?.userName ?? '',
    createdAt: user?.details?.creationDate ?? user?.details?.changeDate ?? null,
    details: {
      avatarURL: undefined,
      firstName: user?.human?.profile?.firstName ?? undefined,
      lastName: user?.human?.profile?.lastName ?? undefined
    },
    isActive: user?.state === 'USER_STATE_ACTIVE',
    isAdmin: false,
    roles: []
  }
}

export const useUser = (userId: string) => {
  const {toast} = useNotificationsContext()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<ResourceUser>()

  const fetchUser = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await resolve(({query}) => {
        const iamUser = query.user({userId})

        return mapIamUserToResourceUser(iamUser)
      })

      setUser(result)
    } catch (err) {
      const message =
        err instanceof GQtyError
          ? 'Failed to load the user from the IAM service.'
          : err instanceof Error
            ? err.message
            : 'Failed to load the user.'

      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user,
    isLoading
  }
}

export const useUsers = () => {
  const {toast} = useNotificationsContext()
  const [isLoading, setIsLoading] = useState(true)

  const [users, setUsers] = useState<ResourceUser[]>([])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await resolve(({query}) => {
        const iamUsers = query.getAllUser()

        return iamUsers.map(mapIamUserToResourceUser)
      })

      setUsers(result)
    } catch (err) {
      const message =
        err instanceof GQtyError
          ? 'Failed to load users from the IAM service.'
          : err instanceof Error
            ? err.message
            : 'Failed to load users.'

      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const addUser = useCallback(async (_values: UserCreateInput) => {
    windowAlert('TODO: Implement user creation via the Zitadel backend.')
    return false
  }, [])

  const updateUser = useCallback(
    async (_id: string, _values: Record<string, unknown>) => {
      windowAlert('TODO: Implement user updates via the Zitadel backend.')
      return false
    },
    []
  )

  const deleteUser = useCallback(async (_id: string) => {
    windowAlert('TODO: Implement user deletion via the Zitadel backend.')
    return false
  }, [])

  return {
    users,
    isLoading,
    addUser,
    updateUser,
    deleteUser
  }
}
