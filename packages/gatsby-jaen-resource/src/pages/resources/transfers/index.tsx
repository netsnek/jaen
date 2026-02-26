// src/pages/resources/transfers/index.tsx
import {
  checkUserRoles,
  PageConfig,
  useAuth,
  useAuthUser
} from 'jaen'
import React from 'react'
import {graphql, Link as GatsbyLink} from 'gatsby'

import {FaEdit} from '@react-icons/all-files/fa/FaEdit'
import {FaPlus} from '@react-icons/all-files/fa/FaPlus'

import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react'

import {useForm} from 'react-hook-form'
import {useIntl} from 'react-intl'

import {
  useTransfers,
  useUsersByRole,
  PAYMENT_OPTIONS,
  type TransferCreateInput
} from '../../../hooks'

const formatAmount = (value?: number) => {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('de-AT')
}

type StatusFilter =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'complete'
  | 'canceled'
  | 'terminated'

const STATUS_FILTERS: {value: StatusFilter; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'pending', label: 'Pending'},
  {value: 'confirmed', label: 'Confirmed'},
  {value: 'complete', label: 'Complete'},
  {value: 'canceled', label: 'Canceled'},
  {value: 'terminated', label: 'Terminated'}
]

const getStatusColor = (state: string): string => {
  switch (state) {
    case 'pending':
      return 'yellow'
    case 'confirmed':
      return 'blue'
    case 'complete':
      return 'green'
    case 'canceled':
      return 'red'
    case 'terminated':
      return 'pink'
    default:
      return 'gray'
  }
}

// ---------------------------
// AssignDriverModal
// ---------------------------

interface AssignDriverModalProps {
  isOpen: boolean
  onClose: () => void
  transferId: string | null
  currentPriceEUR?: number
  assignDriver: (transferId: string, driverUserId: string) => Promise<boolean>
  assignPrice: (transferId: string, priceEUR: number) => Promise<boolean>
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  isOpen,
  onClose,
  transferId,
  currentPriceEUR,
  assignDriver,
  assignPrice
}) => {
  const {users: drivers, isLoading} = useUsersByRole('limosen:driver')
  const [selectedDriverId, setSelectedDriverId] = React.useState('')
  const [priceEUR, setPriceEUR] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedDriverId('')
      setPriceEUR('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleAssign = async () => {
    if (!transferId || !selectedDriverId) return
    setIsSubmitting(true)

    const okDriver = await assignDriver(transferId, selectedDriverId)

    let okPrice = true
    if (okDriver && priceEUR) {
      const normalized = priceEUR.replace(',', '.')
      const n = Number(normalized)
      if (!Number.isNaN(n)) {
        okPrice = await assignPrice(transferId, n)
      }
    }

    setIsSubmitting(false)
    if (okDriver && okPrice) {
      onClose()
    }
  }

  const driverLabel = (driver: any) => {
    const fullName =
      [driver.details?.firstName, driver.details?.lastName]
        .filter(Boolean)
        .join(' ') || ''

    return fullName || driver.username || driver.id
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign driver</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Driver</FormLabel>
              <Select
                placeholder={isLoading ? 'Loading drivers…' : 'Select driver'}
                value={selectedDriverId}
                onChange={e => setSelectedDriverId(e.target.value)}
                isDisabled={isLoading}>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driverLabel(driver)}
                  </option>
                ))}
              </Select>
            </FormControl>

            {typeof currentPriceEUR === 'number' && (
              <FormControl>
                <FormLabel>Current price</FormLabel>
                <Text>{formatAmount(currentPriceEUR)}</Text>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Override price (EUR)</FormLabel>
              <Input
                placeholder="100,00"
                value={priceEUR}
                onChange={e => setPriceEUR(e.target.value)}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Leave empty to keep current price.
              </Text>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            isLoading={isSubmitting}
            isDisabled={!selectedDriverId || !transferId}>
            Assign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// ---------------------------
// AddTransferControl
// ---------------------------

interface TransferCreateFormValues {
  customerId: string
  rideDateISO: string
  rideTime: string
  pickup: string
  dropoff: string
  roomOrName?: string
  carClass?: string
  carTitle?: string
  amountEUR?: string
  payment?: string
}

interface AddTransferControlProps {
  createTransfer: (
    customerId: string,
    values: TransferCreateInput
  ) => Promise<boolean>
  onCreated?: () => void
}

const AddTransferControl: React.FC<AddTransferControlProps> = ({
  createTransfer,
  onCreated
}) => {
  const {users: customers, isLoading: isLoadingCustomers} =
    useUsersByRole('limosen:customer')

  const {isOpen, onOpen, onClose} = useDisclosure()
  const intl = useIntl()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {errors, isSubmitting, isDirty}
  } = useForm<TransferCreateFormValues>({})

  const rawFleetFromIntl = (intl.messages as any)?.fleet
  const rawFleetCategoriesMsg = (intl.messages as any)?.fleetCategories

  const fleetFromIntl: any[] = React.useMemo(() => {
    if (Array.isArray(rawFleetFromIntl)) return rawFleetFromIntl
    if (typeof rawFleetFromIntl === 'string') {
      try {
        const parsed = JSON.parse(rawFleetFromIntl)
        if (Array.isArray(parsed)) return parsed
      } catch {
        // ignore invalid JSON
      }
    }
    return []
  }, [rawFleetFromIntl])

  const fleetCategoriesFromIntl: string[] = React.useMemo(() => {
    if (Array.isArray(rawFleetCategoriesMsg)) {
      return rawFleetCategoriesMsg.filter(Boolean)
    }
    if (typeof rawFleetCategoriesMsg === 'string') {
      try {
        const parsed = JSON.parse(rawFleetCategoriesMsg)
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean)
        }
      } catch {
        return rawFleetCategoriesMsg
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean)
      }
    }
    if (fleetFromIntl.length) {
      return Array.from(
        new Set(
          fleetFromIntl
            .map((v: any) => v?.category)
            .filter(Boolean)
        )
      ) as string[]
    }
    return []
  }, [rawFleetCategoriesMsg, fleetFromIntl])

  const fleetData: any[] = fleetFromIntl.length ? fleetFromIntl : []
  const hasFleetData = fleetData.length > 0

  const vehiclesByCategory: Record<string, string[]> = React.useMemo(() => {
    const map: Record<string, string[]> = {}

    if (hasFleetData) {
      ;(fleetData as any[]).forEach((item: any) => {
        const cat = item?.category as string | undefined
        if (!cat) return

        const desc: string = item?.description || ''
        const models =
          desc
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean) || []

        const list =
          models.length > 0 ? models : item?.name ? [String(item.name)] : []

        if (!map[cat]) {
          map[cat] = []
        }

        const bucket = map[cat]!
        list.forEach(m => {
          if (!bucket.includes(m)) {
            bucket.push(m)
          }
        })
      })
    }

    if (!Object.keys(map).length && !hasFleetData) {
      map['Limousine'] = ['Limousine']
      map['Minivan'] = ['Minivan']
    }

    return map
  }, [fleetData, hasFleetData])

  const fleetCategories: string[] = React.useMemo(() => {
    if (fleetCategoriesFromIntl.length) {
      return fleetCategoriesFromIntl
    }
    const keys = Object.keys(vehiclesByCategory)
    if (keys.length) return keys
    return ['Limousine', 'Minivan']
  }, [fleetCategoriesFromIntl, vehiclesByCategory])

  const selectedCarClass = watch('carClass')
  const vehicleOptions = selectedCarClass
    ? vehiclesByCategory[selectedCarClass] ?? []
    : []

  React.useEffect(() => {
    setValue('carTitle', '')
  }, [selectedCarClass, setValue])

  const handleClose = () => {
    reset()
    onClose()
  }

  const customerLabel = (customer: any) => {
    const fullName =
      [customer.details?.firstName, customer.details?.lastName]
        .filter(Boolean)
        .join(' ') || ''

    return (
      fullName ||
      customer.username ||
      customer.primaryEmailAddress ||
      customer.id
    )
  }

  const onSubmit = async (values: TransferCreateFormValues) => {
    const payload: TransferCreateInput = {
      rideDateISO: values.rideDateISO,
      rideTime: values.rideTime,
      pickup: values.pickup,
      dropoff: values.dropoff
    }

    if (values.roomOrName) payload.roomOrName = values.roomOrName

    const vehicleCombined =
      values.carTitle && values.carClass
        ? `${values.carClass} - ${values.carTitle}`
        : values.carTitle || values.carClass

    if (vehicleCombined) {
      payload.vehicle = vehicleCombined
    }

    if (values.payment) payload.payment = values.payment

    if (values.amountEUR) {
      const normalized = values.amountEUR.replace(',', '.')
      const n = Number(normalized)
      if (!Number.isNaN(n)) {
        payload.amountEUR = n
      }
    }

    const ok = await createTransfer(values.customerId, payload)

    if (ok) {
      if (onCreated) {
        await onCreated()
      }
      handleClose()
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Add a transfer</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody pb={6}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.customerId}>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    placeholder={
                      isLoadingCustomers
                        ? 'Loading customers…'
                        : 'Select customer'
                    }
                    isDisabled={isLoadingCustomers}
                    {...register('customerId', {
                      required: 'Customer is required'
                    })}>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customerLabel(customer)}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.customerId?.message}
                  </FormErrorMessage>
                </FormControl>

                <Stack spacing={4} direction={{base: 'column', md: 'row'}}>
                  <FormControl isInvalid={!!errors.rideDateISO}>
                    <FormLabel>Date</FormLabel>
                    <Input
                      type="date"
                      {...register('rideDateISO', {
                        required: 'Date is required'
                      })}
                    />
                    <FormErrorMessage>
                      {errors.rideDateISO?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.rideTime}>
                    <FormLabel>Time</FormLabel>
                    <Input
                      type="time"
                      {...register('rideTime', {
                        required: 'Time is required'
                      })}
                    />
                    <FormErrorMessage>
                      {errors.rideTime?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>

                <FormControl isInvalid={!!errors.pickup}>
                  <FormLabel>Pickup</FormLabel>
                  <Input
                    placeholder="Hotel, address, etc."
                    {...register('pickup', {
                      required: 'Pickup is required'
                    })}
                  />
                  <FormErrorMessage>{errors.pickup?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.dropoff}>
                  <FormLabel>Dropoff</FormLabel>
                  <Input
                    placeholder="Airport, address, etc."
                    {...register('dropoff', {
                      required: 'Dropoff is required'
                    })}
                  />
                  <FormErrorMessage>{errors.dropoff?.message}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Room / Name</FormLabel>
                  <Input
                    placeholder="Room 101 / Mr. Smith"
                    {...register('roomOrName')}
                  />
                </FormControl>

                <Stack spacing={4} direction={{base: 'column', md: 'row'}}>
                  <FormControl>
                    <FormLabel>Vehicle class</FormLabel>
                    <Select placeholder="Select class" {...register('carClass')}>
                      {fleetCategories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isDisabled={!selectedCarClass}>
                    <FormLabel>Vehicle</FormLabel>
                    <Select
                      placeholder={
                        selectedCarClass ? 'Select vehicle' : 'Select class first'
                      }
                      {...register('carTitle')}>
                      {vehicleOptions.map(model => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Stack spacing={4} direction={{base: 'column', md: 'row'}}>
                  <FormControl>
                    <FormLabel>Amount (EUR)</FormLabel>
                    <Input placeholder="100,00" {...register('amountEUR')} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Payment method</FormLabel>
                    <Select
                      placeholder="Select payment method"
                      {...register('payment')}>
                      {PAYMENT_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <ButtonGroup isDisabled={!isDirty}>
                <Button type="submit" isLoading={isSubmitting}>
                  Create
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Button leftIcon={<Icon as={FaPlus} />} size="sm" onClick={onOpen}>
        Add transfer
      </Button>
    </>
  )
}

// ---------------------------
// Page
// ---------------------------

const Page: React.FC = () => {
  const auth = useAuth()
  const {user} = useAuthUser()

  const authUser = auth.user
  const isJaenAdminRaw: boolean | undefined = authUser
    ? checkUserRoles(authUser, ['jaen:admin'])
    : undefined

  /**
   * IMPORTANT FIX:
   * If admin state is not resolved yet (undefined),
   * treat user as non-admin so we at least fetch driver transfers.
   * When roles resolve to true, the hook will re-run and fetch all transfers.
   */
  const resolvedIsAdmin =
    typeof isJaenAdminRaw === 'boolean' ? isJaenAdminRaw : false

  const isAdminUI = isJaenAdminRaw === true
  const currentUserId: string | undefined = user?.id

  const driverFilterUserId =
    resolvedIsAdmin === false && currentUserId ? currentUserId : undefined

  const {
    transfers,
    isLoading,
    assignDriver,
    assignPrice,
    completeTransfer,
    terminateTransfer,
    refetch,
    createTransfer
  } = useTransfers(driverFilterUserId, {isAdmin: resolvedIsAdmin}) as any

  // assign modal
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [selectedTransferId, setSelectedTransferId] = React.useState<
    string | null
  >(null)

  // complete modal
  const {
    isOpen: isCompleteOpen,
    onOpen: onOpenComplete,
    onClose: onCloseComplete
  } = useDisclosure()
  const [transferIdToComplete, setTransferIdToComplete] =
    React.useState<string | null>(null)
  const [isCompleting, setIsCompleting] = React.useState(false)

  // terminate modal
  const {
    isOpen: isTerminateOpen,
    onOpen: onOpenTerminate,
    onClose: onCloseTerminate
  } = useDisclosure()
  const [transferIdToTerminate, setTransferIdToTerminate] =
    React.useState<string | null>(null)
  const [isTerminating, setIsTerminating] = React.useState(false)

  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilter>('all')

  const isMobile = useBreakpointValue({base: true, md: false}) ?? true

  const filteredTransfers = React.useMemo(
    () =>
      statusFilter === 'all'
        ? transfers
        : transfers.filter((t: any) => t.state === statusFilter),
    [transfers, statusFilter]
  )

  const sortedTransfers = React.useMemo(
    () => [...filteredTransfers].reverse(),
    [filteredTransfers]
  )

  const selectedTransfer = React.useMemo(
    () =>
      sortedTransfers.find((t: any) => t.id === selectedTransferId) ??
      null,
    [sortedTransfers, selectedTransferId]
  )

  const openAssignModal = (transferId: string) => {
    setSelectedTransferId(transferId)
    onOpen()
  }

  const handleCloseModal = () => {
    setSelectedTransferId(null)
    onClose()
  }

  const openCompleteModal = (transferId: string) => {
    setTransferIdToComplete(transferId)
    onOpenComplete()
  }

  const handleCloseCompleteModal = () => {
    if (isCompleting) return
    setTransferIdToComplete(null)
    onCloseComplete()
  }

  const handleConfirmComplete = async () => {
    if (!transferIdToComplete || typeof completeTransfer !== 'function') return
    setIsCompleting(true)
    try {
      const ok = await completeTransfer(transferIdToComplete)
      if (ok !== false && typeof refetch === 'function') {
        await refetch()
        setTransferIdToComplete(null)
        onCloseComplete()
      }
    } finally {
      setIsCompleting(false)
    }
  }

  const openTerminateModal = (transferId: string) => {
    setTransferIdToTerminate(transferId)
    onOpenTerminate()
  }

  const handleCloseTerminateModal = () => {
    if (isTerminating) return
    setTransferIdToTerminate(null)
    onCloseTerminate()
  }

  const handleConfirmTerminate = async () => {
    if (!transferIdToTerminate || typeof terminateTransfer !== 'function')
      return
    setIsTerminating(true)
    try {
      const ok = await terminateTransfer(transferIdToTerminate)
      if (ok !== false && typeof refetch === 'function') {
        await refetch()
        setTransferIdToTerminate(null)
        onCloseTerminate()
      }
    } finally {
      setIsTerminating(false)
    }
  }

  const renderStatusFilterControl = () => {
    if (!transfers.length) return <span />

    if (isMobile) {
      return (
        <FormControl maxW="200px">
          <Select
            size="sm"
            value={statusFilter}
            onChange={e =>
              setStatusFilter(e.target.value as StatusFilter)
            }>
            {STATUS_FILTERS.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </Select>
        </FormControl>
      )
    }

    return (
      <ButtonGroup size="sm" variant="outline">
        {STATUS_FILTERS.map(filter => (
          <Button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            isActive={statusFilter === filter.value}>
            {filter.label}
          </Button>
        ))}
      </ButtonGroup>
    )
  }

  return (
    <>
      <Stack spacing={{base: 4, md: 6}}>
        <HStack justify="space-between" align="center">
          <Heading size={isMobile ? 'md' : 'lg'}>
            Transfers ({transfers.length})
          </Heading>

          {isAdminUI && (
            <AddTransferControl
              createTransfer={createTransfer}
              onCreated={refetch}
            />
          )}
        </HStack>

        <HStack
          spacing={3}
          justify="space-between"
          align="center"
          flexWrap="wrap">
          {renderStatusFilterControl()}
        </HStack>

        {/* Mobile: card list */}
        <Stack spacing={3} display={{base: 'flex', md: 'none'}}>
          {isLoading &&
            !sortedTransfers.length &&
            [...Array(3)].map((_, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="md"
                p={3}>
                <Skeleton h="4" mb={2} />
                <Skeleton h="4" mb={2} />
                <Skeleton h="4" />
              </Box>
            ))}

          {sortedTransfers.map((transfer: any) => {
            const canCompleteAdmin =
              isAdminUI &&
              currentUserId &&
              transfer.driverId &&
              transfer.driverId === currentUserId &&
              (transfer.state === 'pending' ||
                transfer.state === 'confirmed')

            const canCompleteDriver =
              !isAdminUI &&
              currentUserId &&
              transfer.driverId &&
              transfer.driverId === currentUserId &&
              (transfer.state === 'pending' ||
                transfer.state === 'confirmed')

            const showCompleteButton =
              typeof completeTransfer === 'function' &&
              (canCompleteAdmin || canCompleteDriver)

            const canTerminate =
              isAdminUI &&
              typeof terminateTransfer === 'function' &&
              !['terminated', 'canceled', 'complete'].includes(
                transfer.state
              )

            const canAssign =
              isAdminUI && transfer.state !== 'complete'

            const dateText = formatDate(
              transfer.rideDateISO || transfer.requestedAtISO
            )

            const timeText = transfer.rideTime || '—'
            const customerText =
              transfer.customerName || transfer.customerId || '—'
            const driverText =
              transfer.driverName || transfer.driverId || '—'

            return (
              <Box
                key={transfer.id}
                borderWidth="1px"
                borderRadius="lg"
                p={3}>
                <HStack justify="space-between" align="flex-start" mb={2}>
                  <Stack spacing={0}>
                    <Text fontSize="sm" fontWeight="semibold">
                      {dateText}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {timeText}
                    </Text>
                  </Stack>
                  <Badge
                    textTransform="none"
                    fontSize="0.7rem"
                    colorScheme={getStatusColor(transfer.state)}>
                    {transfer.state}
                  </Badge>
                </HStack>

                <Stack spacing={1} mb={2}>
                  <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
                    {transfer.pickup}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    ↓
                  </Text>
                  <Text fontSize="sm" noOfLines={2}>
                    {transfer.dropoff}
                  </Text>
                </Stack>

                <Stack spacing={1} mb={3} fontSize="xs" color="gray.600">
                  <Text>
                    <strong>Customer:</strong> {customerText}
                  </Text>
                  {isAdminUI && (
                    <Text>
                      <strong>Driver:</strong> {driverText}
                    </Text>
                  )}
                  {isAdminUI && typeof transfer.amountEUR === 'number' && (
                    <Text>
                      <strong>Revenue:</strong>{' '}
                      {formatAmount(transfer.amountEUR)}
                    </Text>
                  )}
                  {transfer.payment && (
                    <Text>
                      <strong>Payment:</strong> {transfer.payment}
                    </Text>
                  )}
                </Stack>

                <HStack justify="flex-end" spacing={2} flexWrap="wrap">
                  {canAssign && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => openAssignModal(transfer.id)}>
                      Assign
                    </Button>
                  )}

                  {canTerminate && (
                    <Button
                      size="xs"
                      variant="outline"
                      colorScheme="red"
                      onClick={() => openTerminateModal(transfer.id)}>
                      Terminate
                    </Button>
                  )}

                  {showCompleteButton && (
                    <Button
                      size="xs"
                      colorScheme="green"
                      onClick={() => openCompleteModal(transfer.id)}>
                      Complete
                    </Button>
                  )}

                  {isAdminUI && (
                    <Button
                      as={GatsbyLink}
                      size="xs"
                      variant="outline"
                      leftIcon={<Icon as={FaEdit} />}
                      to={transfer.id}>
                      Edit
                    </Button>
                  )}
                </HStack>
              </Box>
            )
          })}
        </Stack>

        {/* Desktop: table view */}
        <Table size="sm" display={{base: 'none', md: 'table'}}>
          <Thead position="sticky" top={0} zIndex={1} borderColor="black">
            <Tr>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Customer</Th>
              <Th>Driver</Th>
              <Th>Pickup</Th>
              <Th>Dropoff</Th>
              {isAdminUI && <Th isNumeric>Revenue</Th>}
              <Th>Payment</Th>
              <Th>Status</Th>
              <Th textAlign="right"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading &&
              [...Array(3)].map((_, index) => (
                <Tr key={index}>
                  {Array.from({length: isAdminUI ? 9 : 8}).map((__, idx) => (
                    <Td key={idx}>
                      <Skeleton w="full" h="4" />
                    </Td>
                  ))}
                  <Td>
                    <Skeleton w="16" h="8" />
                  </Td>
                </Tr>
              ))}

            {sortedTransfers.map((transfer: any) => {
              const canCompleteAdmin =
                isAdminUI &&
                currentUserId &&
                transfer.driverId &&
                transfer.driverId === currentUserId &&
                (transfer.state === 'pending' ||
                  transfer.state === 'confirmed')

              const canCompleteDriver =
                !isAdminUI &&
                currentUserId &&
                transfer.driverId &&
                transfer.driverId === currentUserId &&
                (transfer.state === 'pending' ||
                  transfer.state === 'confirmed')

              const showCompleteButton =
                typeof completeTransfer === 'function' &&
                (canCompleteAdmin || canCompleteDriver)

              const canTerminate =
                isAdminUI &&
                typeof terminateTransfer === 'function' &&
                !['terminated', 'canceled', 'complete'].includes(
                  transfer.state
                )

              const canAssign =
                isAdminUI && transfer.state !== 'complete'

              return (
                <Tr key={transfer.id}>
                  <Td>
                    <Text fontSize="sm">
                      {formatDate(
                        transfer.rideDateISO || transfer.requestedAtISO
                      )}
                    </Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">
                      {transfer.rideTime || '—'}
                    </Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">
                      {transfer.customerName ||
                        transfer.customerId ||
                        '—'}
                    </Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">
                      {transfer.driverName ||
                        transfer.driverId ||
                        '—'}
                    </Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">{transfer.pickup}</Text>
                  </Td>

                  <Td>
                    <Text fontSize="sm">{transfer.dropoff}</Text>
                  </Td>

                  {isAdminUI && (
                    <Td isNumeric>
                      <Text fontSize="sm">
                        {formatAmount(transfer.amountEUR)}
                      </Text>
                    </Td>
                  )}

                  <Td>
                    <Text fontSize="sm">
                      {transfer.payment || '—'}
                    </Text>
                  </Td>

                  <Td>
                    <Badge
                      textTransform="none"
                      fontSize="0.75rem"
                      colorScheme={getStatusColor(transfer.state)}>
                      {transfer.state}
                    </Badge>
                  </Td>

                  <Td textAlign="right">
                    <ButtonGroup size="xs" spacing="2">
                      {canAssign && (
                        <Button onClick={() => openAssignModal(transfer.id)}>
                          Assign
                        </Button>
                      )}

                      {canTerminate && (
                        <Button
                          colorScheme="red"
                          variant="outline"
                          onClick={() => openTerminateModal(transfer.id)}>
                          Terminate
                        </Button>
                      )}

                      {showCompleteButton && (
                        <Button
                          colorScheme="green"
                          onClick={() =>
                            openCompleteModal(transfer.id)
                          }>
                          Complete
                        </Button>
                      )}

                      {isAdminUI && (
                        <Button
                          as={GatsbyLink}
                          variant="outline"
                          leftIcon={<Icon as={FaEdit} />}
                          to={transfer.id}>
                          Edit
                        </Button>
                      )}
                    </ButtonGroup>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Stack>

      <AssignDriverModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        transferId={selectedTransferId}
        currentPriceEUR={selectedTransfer?.amountEUR}
        assignDriver={assignDriver}
        assignPrice={assignPrice}
      />

      <Modal
        isOpen={isCompleteOpen}
        onClose={handleCloseCompleteModal}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mark transfer as complete?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm">
              Are you sure you want to mark this transfer as complete?
              This action might not be easily reversible.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={handleCloseCompleteModal}
              isDisabled={isCompleting}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleConfirmComplete}
              isLoading={isCompleting}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isTerminateOpen}
        onClose={handleCloseTerminateModal}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terminate transfer?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm">
              Are you sure you want to terminate this transfer? This action is
              usually final.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={handleCloseTerminateModal}
              isDisabled={isTerminating}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirmTerminate}
              isLoading={isTerminating}>
              Terminate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: 'Transfers',
  icon: 'FaCarSide',
  menu: {
    type: 'app',
    group: 'resource',
    groupLabel: 'Resource',
    order: 510
  },
  layout: {
    name: 'jaen'
  },
  breadcrumbs: [
    {
      label: 'Resource',
      path: '/resources/'
    },
    {
      label: 'Transfers',
      path: '/resources/transfers/'
    }
  ],
  auth: {
    isRequired: true
  }
}

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`

export {Head} from 'jaen'
