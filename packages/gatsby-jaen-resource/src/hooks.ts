// src/hooks.ts
import {useNotificationsContext} from 'jaen'
import {useCallback, useEffect, useRef, useState} from 'react'
import {GQtyError} from 'gqty'

import {resolve} from '../client/iam'
import type {ZitadelUser, TransferRow} from '../client/iam'

// ---------------------------
// Domain models
// ---------------------------

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

export interface ResourceTransfer {
  id: string
  customerId: string
  customerName?: string
  driverId?: string
  driverName?: string
  pickup: string
  dropoff: string
  roomOrName?: string
  rideDateISO: string
  rideTime: string
  requestedAtISO: string
  amountEUR?: number
  payment?: string
  state: string
  vehicle?: string
}

export interface TransferCreateInput {
  rideDateISO: string
  rideTime: string
  pickup: string
  dropoff: string
  roomOrName?: string
  vehicle?: string
  amountEUR?: number
  payment?: string
}

// Shared payment options (English labels)
export const PAYMENT_OPTIONS: string[] = ['Cash', 'Card', 'Voucher', 'Invoice']

// ---------------------------
// Mappers
// ---------------------------

type MapUserOptions = {
  /** If true, we also resolve roles/isAdmin (expensive on Cloudflare Worker) */
  includeRoles?: boolean
}

/**
 * Map ZitadelUser -> ResourceUser
 *
 * IMPORTANT: Roles are optional and can be skipped to avoid a ton of
 * subrequests (Zitadel project-role lookups) on Cloudflare.
 */
const mapIamUserToResourceUser = (
  user: ZitadelUser | null | undefined,
  options?: MapUserOptions
): ResourceUser => {
  const includeRoles = options?.includeRoles ?? false

  let roles: Array<{id: string; description: string}> = []
  let isAdmin = false

  if (includeRoles && user) {
    // Only touch user.roles when explicitly requested – this is what triggers
    // project-role resolution inside the Worker.
    const roleObjs = Array.isArray((user as any).roles)
      ? ((user as any).roles as any[])
      : []

    roles = roleObjs
      .map(r => {
        const key = typeof r?.key === 'string' ? r.key : undefined
        if (!key) return null

        const description =
          typeof r?.displayName === 'string' && r.displayName.length > 0
            ? r.displayName
            : key

        return {id: key, description}
      })
      .filter(Boolean) as Array<{id: string; description: string}>

    isAdmin = roleObjs.some(r => r && r.key === 'jaen:admin')
  }

  const avatarURL: string | undefined =
    user && (user as any).avatarUrl
      ? (user as any).avatarUrl
      : undefined

  return {
    id: user?.id ?? '',
    primaryEmailAddress: user?.human?.email?.email ?? '',
    username: user?.userName ?? '',
    createdAt: user?.details?.creationDate ?? user?.details?.changeDate ?? null,
    details: {
      avatarURL,
      firstName: user?.human?.profile?.firstName ?? undefined,
      lastName: user?.human?.profile?.lastName ?? undefined
    },
    // state is a plain String in the schema – support both legacy + new values
    isActive:
      user?.state === 'USER_STATE_ACTIVE' ||
      user?.state?.toLowerCase?.() === 'active',
    isAdmin,
    roles
  }
}

const mapTransferRowToResourceTransfer = (
  transfer: TransferRow | null | undefined
): ResourceTransfer => {
  const amount =
    typeof transfer?.amountEUR === 'number' ? transfer.amountEUR : undefined

  return {
    id: transfer?.transferId ?? '',
    customerId: transfer?.customerId ?? '',
    customerName: transfer?.customerName ?? undefined,
    driverId: transfer?.driverId ?? undefined,
    driverName: transfer?.driverName ?? undefined,
    pickup: transfer?.pickup ?? '',
    dropoff: transfer?.dropoff ?? '',
    roomOrName: transfer?.roomOrName ?? undefined,
    rideDateISO: transfer?.rideDateISO ?? '',
    rideTime: transfer?.rideTime ?? '',
    requestedAtISO: transfer?.requestedAtISO ?? '',
    amountEUR: amount,
    payment: transfer?.payment ?? undefined,
    // TransferState enum in schema -> plain string in ResourceTransfer
    state: (transfer?.state as unknown as string) ?? 'pending',
    vehicle: transfer?.vehicle ?? undefined
  }
}

// ---------------------------
// useUser
// ---------------------------

export const useUser = (userId: string) => {
  const {toast} = useNotificationsContext()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<ResourceUser>()

  const fetchUser = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await resolve(({query}) => {
        const iamUser = query.user({userId})
        // For user detail view we usually want roles
        return mapIamUserToResourceUser(iamUser, {includeRoles: true})
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

// ---------------------------
// useUsers (admin list)
// ---------------------------

export const useUsers = () => {
  const {toast} = useNotificationsContext()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<ResourceUser[]>([])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await resolve(({query}) => {
        const iamUsers = query.getAllUser()
        // Admin users table: we *do* want roles/isAdmin here.
        return iamUsers.map(u =>
          mapIamUserToResourceUser(u, {includeRoles: true})
        )
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

  const addUser = useCallback(
    async (values: UserCreateInput) => {
      try {
        await resolve(
          ({mutation}) => {
            return mutation.userCreate({
              values: {
                emailAddress: values.emailAddress,
                username: values.username,
                password: values.password,
                details: {
                  firstName: values.details?.firstName,
                  lastName: values.details?.lastName
                }
              }
            })
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'User created',
          description: 'The user has been created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchUsers()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to create user via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to create user.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchUsers]
  )

  const updateUser = useCallback(
    async (id: string, values: Record<string, unknown>) => {
      try {
        await resolve(
          ({mutation}) => {
            return mutation.updateUser({
              userId: id,
              changes: values as any
            })
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'User updated',
          description: 'The user has been updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchUsers()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to update user via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to update user.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchUsers]
  )

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        await resolve(
          ({mutation}) => {
            return mutation.deleteUser({
              userId: id
            })
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'User deleted',
          description: 'The user has been deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchUsers()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to delete user via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to delete user.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchUsers]
  )

  return {
    users,
    isLoading,
    addUser,
    updateUser,
    deleteUser
  }
}

// ---------------------------
// useTransfers (admin vs driver-safe, no cross-calls)
// ---------------------------

export const useTransfers = (
  driverUserId?: string,
  options?: {isAdmin?: boolean}
) => {
  const {toast} = useNotificationsContext()
  const [isLoading, setIsLoading] = useState(true)
  const [transfers, setTransfers] = useState<ResourceTransfer[]>([])

  // Track latest request so older responses can't overwrite newer ones
  const requestIdRef = useRef(0)

  // IMPORTANT:
  // - isAdmin === true  => MUST use getAllTransfers
  // - isAdmin === false => MUST use getDriverTransfers
  // - isAdmin === undefined => we don't know yet, do not call any query
  const isAdmin = options?.isAdmin

  const fetchTransfers = useCallback(async () => {
    // Auth/roles not resolved yet -> don't call anything
    if (typeof isAdmin !== 'boolean') {
      setIsLoading(false)
      return
    }

    // Non-admin but we don't yet know driverUserId -> also don't call anything
    if (!isAdmin && !driverUserId) {
      setIsLoading(false)
      return
    }

    const currentRequestId = ++requestIdRef.current
    setIsLoading(true)

    try {
      const result = await resolve(({query}) => {
        if (isAdmin) {
          // ADMIN: only getAllTransfers
          const rows = query.getAllTransfers()
          return rows.map(mapTransferRowToResourceTransfer)
        } else {
          // NON-ADMIN: only getDriverTransfers
          const rows = query.getDriverTransfers({
            driverUserId: driverUserId!
          })
          return rows.map(mapTransferRowToResourceTransfer)
        }
      })

      // Ignore stale responses from previous calls
      if (requestIdRef.current !== currentRequestId) {
        return
      }

      setTransfers(result)
    } catch (err) {
      const message =
        err instanceof GQtyError
          ? 'Failed to load transfers from the IAM service.'
          : err instanceof Error
            ? err.message
            : 'Failed to load transfers.'

      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setIsLoading(false)
      }
    }
  }, [toast, driverUserId, isAdmin])

  useEffect(() => {
    fetchTransfers()
  }, [fetchTransfers])

  const assignDriver = useCallback(
    async (transferId: string, driverUserId: string) => {
      try {
        await resolve(
          ({mutation}) => {
            return mutation.assignDriver({
              transferId,
              driverUserId
            })
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'Driver assigned',
          description: 'The driver has been assigned to the transfer.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchTransfers()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to assign driver via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to assign driver.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchTransfers]
  )

  const assignPrice = useCallback(
    async (transferId: string, priceEUR: number) => {
      try {
        await resolve(
          ({mutation}) => {
            const m: any = mutation as any
            // New schema: assignPrice(amountEUR, transferId)
            if (typeof m.assignPrice === 'function') {
              return m.assignPrice({transferId, amountEUR: priceEUR})
            }
            // Fallbacks for older naming, still with amountEUR arg
            if (typeof m.assignPriceTransfer === 'function') {
              return m.assignPriceTransfer({transferId, amountEUR: priceEUR})
            }
            if (typeof m.assignPriceToTransfer === 'function') {
              return m.assignPriceToTransfer({transferId, amountEUR: priceEUR})
            }
            throw new Error('assignPrice mutation not found')
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'Price assigned',
          description: 'The price has been assigned to the transfer.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchTransfers()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to assign price via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to assign price.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchTransfers]
  )

  const completeTransfer = useCallback(
    async (transferId: string) => {
      try {
        await resolve(
          ({mutation}) => {
            return mutation.markCompleted({
              transferId
            })
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'Transfer completed',
          description: 'The transfer has been marked as complete.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchTransfers()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to mark transfer as complete via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to mark transfer as complete.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchTransfers]
  )

  const createTransfer = useCallback(
    async (
      customerId: string,
      values: TransferCreateInput
    ): Promise<boolean> => {
      try {
        const transferId = await resolve(
          ({mutation}) => {
            const result = mutation.createTransfer({
              customerId,
              rideDateISO: values.rideDateISO,
              rideTime: values.rideTime,
              pickup: values.pickup,
              dropoff: values.dropoff,
              roomOrName: values.roomOrName,
              vehicle: values.vehicle,
              payment: values.payment,
              amountEUR:
                typeof values.amountEUR === 'number'
                  ? values.amountEUR
                  : undefined
            })
            // IMPORTANT: return a field so GQty executes the mutation
            return result.transferId
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'Transfer created',
          description: transferId
            ? `The transfer has been created (ID: ${transferId}).`
            : 'The transfer has been created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchTransfers()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to create transfer via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to create transfer.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchTransfers]
  )

  const terminateTransfer = useCallback(
    async (transferId: string) => {
      try {
        await resolve(
          ({mutation}) => {
            return mutation.terminateTransfer({
              transferId
            })
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'Transfer terminated',
          description: 'The transfer has been terminated.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchTransfers()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to terminate transfer via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to terminate transfer.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchTransfers]
  )

  return {
    transfers,
    isLoading,
    refetch: fetchTransfers,
    assignDriver,
    assignPrice,
    completeTransfer,
    createTransfer,
    terminateTransfer
  }
}

// ---------------------------
// useBookings (customer bookings)
// ---------------------------

export const useBookings = (customerId?: string) => {
  const {toast} = useNotificationsContext()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<ResourceTransfer[]>([])

  const requestIdRef = useRef(0)

  const fetchBookings = useCallback(async () => {
    // If there's no logged-in user, don't call the API
    if (!customerId) {
      setBookings([])
      setIsLoading(false)
      return
    }

    const currentRequestId = ++requestIdRef.current
    setIsLoading(true)

    try {
      const result = await resolve(({query}) => {
        // getCustomerBookings is a *field*, not a function, in the GQty schema
        const rows = query.getCustomerBookings
        return rows.map(mapTransferRowToResourceTransfer)
      })

      if (requestIdRef.current !== currentRequestId) {
        return
      }

      setBookings(result)
    } catch (err) {
      const message =
        err instanceof GQtyError
          ? 'Failed to load bookings from the IAM service.'
          : err instanceof Error
            ? err.message
            : 'Failed to load bookings.'

      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setIsLoading(false)
      }
    }
  }, [toast, customerId])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const bookTransfer = useCallback(
    async (values: TransferCreateInput): Promise<boolean> => {
      try {
        const transferId = await resolve(
          ({mutation}) => {
            const result = mutation.bookTransfer({
              rideDateISO: values.rideDateISO,
              rideTime: values.rideTime,
              pickup: values.pickup,
              dropoff: values.dropoff,
              roomOrName: values.roomOrName,
              vehicle: values.vehicle,
              payment: values.payment,
              amountEUR:
                typeof values.amountEUR === 'number'
                  ? values.amountEUR
                  : undefined
            })
            return result.transferId
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'Booking created',
          description: `Your transfer has been booked (ID: ${transferId}).`,
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchBookings()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to create booking via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to create booking.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchBookings]
  )

  const cancelBooking = useCallback(
    async (transferId: string) => {
      try {
        await resolve(
          ({mutation}) => {
            return mutation.cancelTransfer({transferId})
          },
          {
            cachePolicy: 'no-store'
          }
        )

        toast({
          title: 'Booking canceled',
          description: 'Your transfer booking has been canceled.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        await fetchBookings()
        return true
      } catch (err) {
        const message =
          err instanceof GQtyError
            ? 'Failed to cancel booking via the IAM service.'
            : err instanceof Error
              ? err.message
              : 'Failed to cancel booking.'

        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        return false
      }
    },
    [toast, fetchBookings]
  )

  return {
    bookings,
    isLoading,
    refetch: fetchBookings,
    bookTransfer,
    cancelBooking
  }
}

// ---------------------------
// useUsersByRole (lightweight – no roles)
// ---------------------------

/**
 * Hook to fetch users filtered by a specific roleKey via the GraphQL query `getUsersByRole`.
 *
 * For this one (used e.g. in the "Assign driver" modal) we **intentionally
 * do not resolve roles** to avoid a ton of project-role subrequests
 * on the Cloudflare Worker.
 */
export const useUsersByRole = (roleKey: string, projectId?: string) => {
  const {toast} = useNotificationsContext()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<ResourceUser[]>([])

  const fetchUsersByRole = useCallback(async () => {
    if (!roleKey) {
      setUsers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const result = await resolve(({query}) => {
        const iamUsers = query.getUsersByRole({
          roleKey
          // projectId is not part of the current GraphQL signature; ignored.
        })

        // LIGHT variant: do NOT include roles here => no project-role lookups.
        return iamUsers.map(u =>
          mapIamUserToResourceUser(u, {includeRoles: false})
        )
      })

      setUsers(result)
    } catch (err) {
      const message =
        err instanceof GQtyError
          ? 'Failed to load users by role from the IAM service.'
          : err instanceof Error
            ? err.message
            : 'Failed to load users by role.'

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
  }, [toast, roleKey])

  useEffect(() => {
    fetchUsersByRole()
  }, [fetchUsersByRole])

  return {
    users,
    isLoading,
    refetch: fetchUsersByRole
  }
}
