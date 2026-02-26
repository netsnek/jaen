// src/pages/resources/booking.tsx
import {PageConfig, useAuthUser} from 'jaen'
import React from 'react'
import {graphql} from 'gatsby'

import {FaCarSide} from '@react-icons/all-files/fa/FaCarSide'
import {FaPlus} from '@react-icons/all-files/fa/FaPlus'

import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  HStack,
  useBreakpointValue
} from '@chakra-ui/react'

import {useForm} from 'react-hook-form'
import {useIntl} from 'react-intl'

import {
  useBookings,
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
// AddBookingControl
// ---------------------------

interface BookingFormValues {
  rideDateISO: string
  rideTime: string
  pickup: string
  dropoff: string
  roomOrName?: string
  carClass?: string
  carTitle?: string
  payment?: string
}

interface AddBookingControlProps {
  onBooked?: () => void
  bookTransfer: (values: TransferCreateInput) => Promise<boolean>
}

const AddBookingControl: React.FC<AddBookingControlProps> = ({
  onBooked,
  bookTransfer
}) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const intl = useIntl()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {errors, isSubmitting, isDirty}
  } = useForm<BookingFormValues>({})

  // --- Fleet & categories from react-intl (similar to BookingModal.tsx) ---
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

    // Fallback if there is no fleet data at all
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
    // Clear vehicle selection when class changes
    setValue('carTitle', '')
  }, [selectedCarClass, setValue])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: BookingFormValues) => {
    const payload: TransferCreateInput = {
      rideDateISO: values.rideDateISO,
      rideTime: values.rideTime,
      pickup: values.pickup,
      dropoff: values.dropoff
    }

    if (values.roomOrName) payload.roomOrName = values.roomOrName

    // Combine carClass + carTitle into a single vehicle string
    const vehicleCombined =
      values.carTitle && values.carClass
        ? `${values.carClass} - ${values.carTitle}`
        : values.carTitle || values.carClass

    if (vehicleCombined) {
      payload.vehicle = vehicleCombined
    }

    if (values.payment) payload.payment = values.payment

    const ok = await bookTransfer(payload)
    if (ok) {
      if (onBooked) {
        await onBooked()
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
            <ModalHeader>Book a transfer</ModalHeader>
            <ModalCloseButton onClick={handleClose} />
            <ModalBody pb={6}>
              <Stack spacing={4}>
                <Stack
                  spacing={4}
                  direction={{base: 'column', md: 'row'}}>
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
                  <FormErrorMessage>
                    {errors.pickup?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.dropoff}>
                  <FormLabel>Dropoff</FormLabel>
                  <Input
                    placeholder="Airport, address, etc."
                    {...register('dropoff', {
                      required: 'Dropoff is required'
                    })}
                  />
                  <FormErrorMessage>
                    {errors.dropoff?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Room / Name</FormLabel>
                  <Input
                    placeholder="Room 101 / Mr. Smith"
                    {...register('roomOrName')}
                  />
                </FormControl>

                <Stack
                  spacing={4}
                  direction={{base: 'column', md: 'row'}}>
                  <FormControl>
                    <FormLabel>Vehicle class</FormLabel>
                    <Select
                      placeholder="Select class"
                      {...register('carClass')}>
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
                        selectedCarClass
                          ? 'Select vehicle'
                          : 'Select class first'
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

                <Stack
                  spacing={4}
                  direction={{base: 'column', md: 'row'}}>
                  <FormControl>
                    <FormLabel>Payment method</FormLabel>
                    <Select
                      placeholder="Select payment"
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

      <Button
        leftIcon={<Icon as={FaPlus} />}
        size="sm"
        onClick={onOpen}>
        Book transfer
      </Button>
    </>
  )
}

// ---------------------------
// Page (customer bookings)
// ---------------------------

const Page: React.FC = () => {
  const {user} = useAuthUser()
  const currentUserId: string | undefined = user?.id

  const {bookings, isLoading, bookTransfer, cancelBooking, refetch} =
    useBookings(currentUserId)

  const isMobile = useBreakpointValue({base: true, md: false}) ?? true

  const sortedBookings = React.useMemo(
    () => [...bookings].reverse(),
    [bookings]
  )

  // cancel modal
  const {
    isOpen: isCancelOpen,
    onOpen: onOpenCancel,
    onClose: onCloseCancel
  } = useDisclosure()
  const [bookingIdToCancel, setBookingIdToCancel] = React.useState<
    string | null
  >(null)
  const [isCancelling, setIsCancelling] = React.useState(false)

  const openCancelModal = (transferId: string) => {
    setBookingIdToCancel(transferId)
    onOpenCancel()
  }

  const handleCloseCancelModal = () => {
    if (isCancelling) return
    setBookingIdToCancel(null)
    onCloseCancel()
  }

  const handleConfirmCancel = async () => {
    if (!bookingIdToCancel) return
    setIsCancelling(true)
    try {
      const ok = await cancelBooking(bookingIdToCancel)
      if (ok !== false) {
        await refetch()
        setBookingIdToCancel(null)
        onCloseCancel()
      }
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <>
      <Stack spacing={4}>
        <Stack
          direction={{base: 'column', md: 'row'}}
          justify="space-between"
          align={{base: 'flex-start', md: 'center'}}
          spacing={3}>
          <Heading size={isMobile ? 'md' : 'lg'}>
            My bookings ({bookings.length})
          </Heading>

          <AddBookingControl
            bookTransfer={bookTransfer}
            onBooked={refetch}
          />
        </Stack>

        {/* Mobile: card list */}
        <Stack spacing={3} display={{base: 'flex', md: 'none'}}>
          {isLoading &&
            !sortedBookings.length &&
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

          {sortedBookings.map(transfer => {
            const canCancel =
              transfer.state === 'pending' ||
              transfer.state === 'confirmed'

            const dateText = formatDate(
              transfer.rideDateISO || transfer.requestedAtISO
            )
            const timeText = transfer.rideTime || '—'

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
                    <strong>Vehicle:</strong> {transfer.vehicle || '—'}
                  </Text>
                  <Text>
                    <strong>Price:</strong>{' '}
                    {formatAmount(transfer.amountEUR)}
                  </Text>
                  {transfer.payment && (
                    <Text>
                      <strong>Payment:</strong> {transfer.payment}
                    </Text>
                  )}
                </Stack>

                <HStack justify="flex-end">
                  {canCancel && (
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => openCancelModal(transfer.id)}>
                      Cancel
                    </Button>
                  )}
                </HStack>
              </Box>
            )
          })}
        </Stack>

        {/* Desktop: table view */}
        <Table
          size="sm"
          display={{base: 'none', md: 'table'}}>
          <Thead position="sticky" top={0} zIndex={1} borderColor="black">
            <Tr>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Pickup</Th>
              <Th>Dropoff</Th>
              <Th>Vehicle</Th>
              <Th>Price</Th>
              <Th>Payment</Th>
              <Th>Status</Th>
              <Th textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading &&
              [...Array(3)].map((_, index) => (
                <Tr key={index}>
                  {Array.from({length: 9}).map((__, idx) => (
                    <Td key={idx}>
                      <Skeleton w="full" h="4" />
                    </Td>
                  ))}
                </Tr>
              ))}

            {sortedBookings.map(transfer => {
              const canCancel =
                transfer.state === 'pending' ||
                transfer.state === 'confirmed'

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
                    <Text fontSize="sm">{transfer.pickup}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">{transfer.dropoff}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {transfer.vehicle || '—'}
                    </Text>
                  </Td>
                  <Td isNumeric>
                    <Text fontSize="sm">
                      {formatAmount(transfer.amountEUR)}
                    </Text>
                  </Td>
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
                    {canCancel && (
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => openCancelModal(transfer.id)}>
                        Cancel
                      </Button>
                    )}
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Stack>

      <Modal
        isOpen={isCancelOpen}
        onClose={handleCloseCancelModal}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel this booking?</ModalHeader>
          <ModalCloseButton onClick={handleCloseCancelModal} />
          <ModalBody>
            <Text fontSize="sm">
              Are you sure you want to cancel this transfer booking?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={handleCloseCancelModal}
              isDisabled={isCancelling}>
              Keep booking
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirmCancel}
              isLoading={isCancelling}>
              Cancel booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: 'Bookings',
  icon: 'FaCarSide',
  // menu: {
  //   type: 'app',
  //   group: 'resource',
  //   groupLabel: 'Resource',
  //   order: 520
  // },
  layout: {
    name: 'jaen'
  },
  breadcrumbs: [
    {
      label: 'Resource',
      path: '/resources/'
    },
    {
      label: 'Bookings',
      path: '/resources/booking/'
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
