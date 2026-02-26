/**
 * Shared UI components for the gatsby-jaen-app dashboard redesign.
 *
 * These components implement the DashboardReplica design language
 * (gold accent, alert cards, status badges, filter bars, date grouping,
 * detail panels, responsive table/card layouts) using Chakra UI.
 */
import React from 'react'
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'

import {FaSearch} from '@react-icons/all-files/fa/FaSearch'
import {FaExclamationTriangle} from '@react-icons/all-files/fa/FaExclamationTriangle'
import {FaExclamationCircle} from '@react-icons/all-files/fa/FaExclamationCircle'
import {FaInfoCircle} from '@react-icons/all-files/fa/FaInfoCircle'
import {FaCog} from '@react-icons/all-files/fa/FaCog'
import {FaGripVertical} from '@react-icons/all-files/fa/FaGripVertical'
import {FaUndo} from '@react-icons/all-files/fa/FaUndo'
import {FaSortAmountDown} from '@react-icons/all-files/fa/FaSortAmountDown'
import {FaSortAmountUp} from '@react-icons/all-files/fa/FaSortAmountUp'
// import {FaCalendarAlt} from '@react-icons/all-files/fa/FaCalendarAlt'

import {useUsersByRole} from '../'
import type {ResourceUser} from '../'

// ──────────────────────────────────────────────────────
// Color helpers
// ──────────────────────────────────────────────────────

/** Gold primary accent for buttons / highlights */
export const PRIMARY_COLOR_SCHEME = 'yellow'

/** Normalize transfer state to uppercase for consistent comparison */
export const normalizeState = (state: string): string =>
  typeof state === 'string' ? state.toUpperCase() : ''

/** Map transfer state → Chakra colorScheme for badges */
export const getStatusColor = (state: string): string => {
  switch (normalizeState(state)) {
    case 'PENDING':
      return 'yellow'
    case 'ASSIGNED':
      return 'blue'
    case 'AT_PICKUP':
      return 'cyan'
    case 'ON_THE_WAY':
      return 'teal'
    case 'ONGOING':
      return 'purple'
    case 'COMPLETED':
      return 'green'
    case 'CANCELED':
      return 'red'
    case 'TERMINATED':
      return 'pink'
    case 'ABORTED':
      return 'orange'
    case 'FAILED':
      return 'red'
    case 'NO_SHOW':
      return 'orange'
    case 'REJECTED':
      return 'red'
    default:
      return 'gray'
  }
}

/** Human-readable label for a transfer state */
export const getStatusLabel = (state: string): string => {
  switch (normalizeState(state)) {
    case 'PENDING':
      return 'Pending'
    case 'ASSIGNED':
      return 'Assigned'
    case 'AT_PICKUP':
      return 'At Pickup'
    case 'ON_THE_WAY':
      return 'On The Way'
    case 'ONGOING':
      return 'Ongoing'
    case 'COMPLETED':
      return 'Completed'
    case 'CANCELED':
      return 'Canceled'
    case 'TERMINATED':
      return 'Terminated'
    case 'ABORTED':
      return 'Aborted'
    case 'FAILED':
      return 'Failed'
    case 'NO_SHOW':
      return 'No Show'
    case 'REJECTED':
      return 'Rejected'
    default:
      return state || 'Unknown'
  }
}

// ──────────────────────────────────────────────────────
// Date helpers
// ──────────────────────────────────────────────────────

const pad2 = (n: number) => String(n).padStart(2, '0')

export const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export const tomorrowKey = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export const toDayKeyLocal = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

export const getTransferDayKey = (t: any): string => {
  const rideDateISO = t?.rideDateISO
  if (
    typeof rideDateISO === 'string' &&
    /^\d{4}-\d{2}-\d{2}/.test(rideDateISO)
  ) {
    return rideDateISO.slice(0, 10)
  }
  const pickupDT = t?.pickupDateTimeISO || t?.pickupDateTime
  if (pickupDT) {
    try {
      const d = new Date(pickupDT as any)
      if (!Number.isNaN(d.getTime())) return toDayKeyLocal(d)
    } catch {
      /* ignore */
    }
    if (typeof pickupDT === 'string' && /^\d{4}-\d{2}-\d{2}/.test(pickupDT)) {
      return pickupDT.slice(0, 10)
    }
  }
  const rawRequested = t?.requestedAtISO || t?.requestedAt
  if (!rawRequested) return '—'
  const d = new Date(rawRequested)
  if (Number.isNaN(d.getTime())) return String(rawRequested)
  return toDayKeyLocal(d)
}

/** Format EUR amounts (de-AT locale) */
export const formatEUR = (value: number) =>
  new Intl.NumberFormat('de-AT', {style: 'currency', currency: 'EUR'}).format(
    Number.isFinite(value) ? value : 0
  )

/** Format percentage */
export const formatPercent = (value: number) =>
  new Intl.NumberFormat('de-AT', {
    style: 'percent',
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0)

// ──────────────────────────────────────────────────────
// PageHeader
// ──────────────────────────────────────────────────────

export interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions
}) => {
  const subtitleColor = useColorModeValue('gray.500', 'gray.400')

  return (
    <Flex
      justify="space-between"
      align="start"
      flexWrap="wrap"
      gap={4}>
      <VStack align="start" spacing={1}>
        <Heading size="lg">{title}</Heading>
        {subtitle && (
          <Text color={subtitleColor} fontSize="sm">
            {subtitle}
          </Text>
        )}
      </VStack>
      {actions && <HStack spacing={2} flexWrap="wrap">{actions}</HStack>}
    </Flex>
  )
}

// ──────────────────────────────────────────────────────
// AlertCard
// ──────────────────────────────────────────────────────

export type AlertSeverity = 'destructive' | 'warning' | 'info'

export interface AlertCardProps {
  severity: AlertSeverity
  title: string
  description?: string
  onClick?: () => void
}

const SEVERITY_MAP: Record<
  AlertSeverity,
  {borderColor: string; iconColor: string; icon: React.ElementType}
> = {
  destructive: {
    borderColor: 'red.500',
    iconColor: 'red.500',
    icon: FaExclamationCircle
  },
  warning: {
    borderColor: 'orange.400',
    iconColor: 'orange.400',
    icon: FaExclamationTriangle
  },
  info: {
    borderColor: 'blue.400',
    iconColor: 'blue.400',
    icon: FaInfoCircle
  }
}

export const AlertCard: React.FC<AlertCardProps> = ({
  severity,
  title,
  description,
  onClick
}) => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const {
    borderColor: accentColor,
    iconColor,
    icon: SeverityIcon
  } = SEVERITY_MAP[severity]

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderLeftWidth="4px"
      borderLeftColor={accentColor}
      borderRadius="lg"
      p={4}
      shadow="sm"
      cursor={onClick ? 'pointer' : undefined}
      _hover={onClick ? {shadow: 'md'} : undefined}
      onClick={onClick}
      transition="box-shadow 0.2s">
      <HStack spacing={3} align="start">
        <Icon as={SeverityIcon} color={iconColor} boxSize={5} mt="2px" />
        <VStack align="start" spacing={0}>
          <Text fontWeight="semibold" fontSize="sm">
            {title}
          </Text>
          {description && (
            <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
              {description}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  )
}

// ──────────────────────────────────────────────────────
// StatusBadge
// ──────────────────────────────────────────────────────

export interface StatusBadgeProps {
  state: string
  size?: 'sm' | 'md'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({state, size = 'sm'}) => (
  <Badge
    colorScheme={getStatusColor(state)}
    borderRadius="full"
    px={2}
    py={0.5}
    fontSize={size === 'sm' ? 'xs' : 'sm'}
    textTransform="capitalize">
    {getStatusLabel(state)}
  </Badge>
)

// ──────────────────────────────────────────────────────
// DateFilterBar
// ──────────────────────────────────────────────────────

export type DateFilterValue = 'today' | 'tomorrow' | 'all' | 'custom'

export interface DateFilterBarProps {
  value: DateFilterValue
  onChange: (value: DateFilterValue) => void
  customDate?: string
  onCustomDateChange?: (date: string) => void
}

export const DateFilterBar: React.FC<DateFilterBarProps> = ({
  value,
  onChange,
  customDate,
  onCustomDateChange
}) => {
  const activeBg = useColorModeValue('yellow.400', 'yellow.500')
  const activeColor = useColorModeValue('black', 'black')

  const makeBtn = (label: string, val: DateFilterValue) => (
    <Button
      key={val}
      size="sm"
      variant={value === val ? 'solid' : 'outline'}
      bg={value === val ? activeBg : undefined}
      color={value === val ? activeColor : undefined}
      _hover={value === val ? {bg: 'yellow.500'} : undefined}
      onClick={() => onChange(val)}>
      {label}
    </Button>
  )

  return (
    <HStack spacing={2} flexWrap="wrap">
      <ButtonGroup size="sm" isAttached variant="outline">
        {makeBtn('Today', 'today')}
        {makeBtn('Tomorrow', 'tomorrow')}
        {makeBtn('All', 'all')}
        {makeBtn('Custom', 'custom')}
      </ButtonGroup>
      {value === 'custom' && (
        <Input
          type="date"
          size="sm"
          w="auto"
          value={customDate || ''}
          onChange={e => onCustomDateChange?.(e.target.value)}
        />
      )}
    </HStack>
  )
}

// ──────────────────────────────────────────────────────
// SearchInput
// ──────────────────────────────────────────────────────

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search…'
}) => {
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <InputGroup size="sm" maxW={{base: 'full', md: '260px'}}>
      <InputLeftElement pointerEvents="none">
        <Icon as={FaSearch} color="gray.400" />
      </InputLeftElement>
      <Input
        bg={bg}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        borderRadius="md"
      />
    </InputGroup>
  )
}

// ──────────────────────────────────────────────────────
// StatCard
// ──────────────────────────────────────────────────────

export interface StatCardProps {
  label: string
  value: React.ReactNode
  helpText?: React.ReactNode
  isLoading?: boolean
  children?: React.ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  helpText,
  isLoading,
  children
}) => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      shadow="sm">
      <Text
        fontSize="xs"
        fontWeight="medium"
        textTransform="uppercase"
        letterSpacing="wider"
        color={useColorModeValue('gray.500', 'gray.400')}
        mb={1}>
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" mb={1}>
        {isLoading ? <Spinner size="sm" /> : value}
      </Text>
      {helpText && (
        <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
          {helpText}
        </Text>
      )}
      {children}
    </Box>
  )
}

// ──────────────────────────────────────────────────────
// DetailDrawer
// ──────────────────────────────────────────────────────

export interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  headerGradient?: string
  footer?: React.ReactNode
  children: React.ReactNode
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerGradient,
  footer,
  children
}) => {
  const defaultGradient = useColorModeValue(
    'linear(to-r, yellow.400, orange.400)',
    'linear(to-r, yellow.500, orange.500)'
  )

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton color="white" />
        <DrawerHeader
          bgGradient={headerGradient || defaultGradient}
          color="white"
          pb={4}>
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold">
              {title}
            </Text>
            {subtitle && (
              <Text fontSize="sm" opacity={0.85}>
                {subtitle}
              </Text>
            )}
          </VStack>
        </DrawerHeader>
        <DrawerBody py={4}>{children}</DrawerBody>
        {footer && <DrawerFooter borderTopWidth="1px">{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  )
}

// ──────────────────────────────────────────────────────
// DateGroupHeader
// ──────────────────────────────────────────────────────

export interface DateGroupHeaderProps {
  dayKey: string
  label?: string
}

export const DateGroupHeader: React.FC<DateGroupHeaderProps> = ({
  dayKey,
  label
}) => {
  const today = todayKey()
  const tomorrow = tomorrowKey()

  let color: string
  if (dayKey === today) color = 'green.500'
  else if (dayKey === tomorrow) color = 'orange.400'
  else color = useColorModeValue('gray.400', 'gray.500')

  const displayLabel =
    label ||
    (dayKey === today
      ? 'Today'
      : dayKey === tomorrow
        ? 'Tomorrow'
        : formatDayKey(dayKey))

  return (
    <HStack spacing={3} my={3}>
      <Box flex="1" h="1px" bg={color} />
      <Text
        fontSize="xs"
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="wider"
        color={color}
        whiteSpace="nowrap">
        {displayLabel}
      </Text>
      <Box flex="1" h="1px" bg={color} />
    </HStack>
  )
}

/** Format a YYYY-MM-DD day key to a human-readable date (de-AT) */
const formatDayKey = (dayKey: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return dayKey
  const [y, m, d] = dayKey.split('-')
  const date = new Date(Number(y), Number(m!) - 1, Number(d))
  if (Number.isNaN(date.getTime())) return dayKey

  const parts = new Intl.DateTimeFormat('de-AT', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).formatToParts(date)

  const weekday = (parts.find(p => p.type === 'weekday')?.value || '').replace(
    /\./g,
    ''
  )
  const day = parts.find(p => p.type === 'day')?.value || ''
  const month = parts.find(p => p.type === 'month')?.value || ''
  const year = parts.find(p => p.type === 'year')?.value || ''
  return [weekday, day, month, year].filter(Boolean).join(' ')
}

// ──────────────────────────────────────────────────────
// AssignDriverModal
// ──────────────────────────────────────────────────────

export interface AssignDriverModalProps {
  isOpen: boolean
  onClose: () => void
  transferId: string | null
  currentPriceEUR?: number
  assignDriver: (transferId: string, driverUserId: string) => Promise<boolean>
  assignPrice?: (transferId: string, priceEUR: number) => Promise<boolean>
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  isOpen,
  onClose,
  transferId,
  currentPriceEUR,
  assignDriver,
  assignPrice
}) => {
  const {users: drivers = [], isLoading} = useUsersByRole('limosen:driver')
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
    if (okDriver && priceEUR && assignPrice) {
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

  const driverLabel = (driver: ResourceUser) => {
    const fullName = [driver.details?.firstName, driver.details?.lastName]
      .filter(Boolean)
      .join(' ')
    return fullName || driver.username || driver.id
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Driver</ModalHeader>
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
                    {driver.driverColor
                      ? ` ● ${driver.driverColor}`
                      : ''}
                  </option>
                ))}
              </Select>
            </FormControl>

            {typeof currentPriceEUR === 'number' && (
              <FormControl>
                <FormLabel>Current price</FormLabel>
                <Text>{formatEUR(currentPriceEUR)}</Text>
              </FormControl>
            )}

            {assignPrice && (
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
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme={PRIMARY_COLOR_SCHEME}
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

// ──────────────────────────────────────────────────────
// AssignCarModal
// ──────────────────────────────────────────────────────

export interface CarOption {
  id: string
  carName?: string
  licensePlate?: string
  carClass?: string
  color?: string
}

export interface AssignCarModalProps {
  isOpen: boolean
  onClose: () => void
  transferId: string | null
  cars: CarOption[]
  isLoadingCars?: boolean
  assignCar: (transferId: string, carId: string) => Promise<boolean>
}

export const AssignCarModal: React.FC<AssignCarModalProps> = ({
  isOpen,
  onClose,
  transferId,
  cars,
  isLoadingCars,
  assignCar
}) => {
  const [selectedCarId, setSelectedCarId] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedCarId('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleAssign = async () => {
    if (!transferId || !selectedCarId) return
    setIsSubmitting(true)

    const ok = await assignCar(transferId, selectedCarId)
    setIsSubmitting(false)
    if (ok) {
      onClose()
    }
  }

  const carLabel = (car: CarOption) => {
    const parts = [car.carName, car.licensePlate, car.carClass].filter(Boolean)
    return parts.join(' · ') || car.id
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Vehicle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Vehicle</FormLabel>
            <Select
              placeholder={
                isLoadingCars ? 'Loading vehicles…' : 'Select vehicle'
              }
              value={selectedCarId}
              onChange={e => setSelectedCarId(e.target.value)}
              isDisabled={isLoadingCars}>
              {cars.map(car => (
                <option key={car.id} value={car.id}>
                  {carLabel(car)}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme={PRIMARY_COLOR_SCHEME}
            onClick={handleAssign}
            isLoading={isSubmitting}
            isDisabled={!selectedCarId || !transferId}>
            Assign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// ──────────────────────────────────────────────────────
// Status filter options (all 12 TransferState values)
// ──────────────────────────────────────────────────────

export type StatusFilter =
  | 'PENDING'
  | 'ASSIGNED'
  | 'AT_PICKUP'
  | 'ON_THE_WAY'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELED'
  | 'TERMINATED'
  | 'ABORTED'
  | 'FAILED'
  | 'NO_SHOW'
  | 'REJECTED'

export const STATUS_FILTERS: {value: StatusFilter; label: string}[] = [
  {value: 'PENDING', label: 'Pending'},
  {value: 'ASSIGNED', label: 'Assigned'},
  {value: 'AT_PICKUP', label: 'At Pickup'},
  {value: 'ON_THE_WAY', label: 'On The Way'},
  {value: 'ONGOING', label: 'Ongoing'},
  {value: 'COMPLETED', label: 'Completed'},
  {value: 'CANCELED', label: 'Canceled'},
  {value: 'TERMINATED', label: 'Terminated'},
  {value: 'ABORTED', label: 'Aborted'},
  {value: 'FAILED', label: 'Failed'},
  {value: 'NO_SHOW', label: 'No Show'},
  {value: 'REJECTED', label: 'Rejected'}
]

// ──────────────────────────────────────────────────────
// Column Customization (toggle visibility + drag reorder)
// ──────────────────────────────────────────────────────

export type ColumnConfig = {
  id: string
  label: string
  visible: boolean
}

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  {id: 'code', label: 'Code', visible: true},
  {id: 'status', label: 'Status', visible: true},
  {id: 'route', label: 'Route', visible: true},
  {id: 'pickup', label: 'Pickup', visible: true},
  {id: 'capacity', label: 'Capacity', visible: true},
  {id: 'flight', label: 'Flight', visible: true},
  {id: 'driver', label: 'Driver', visible: true},
  {id: 'vehicle', label: 'Vehicle', visible: true},
  {id: 'fare', label: 'Fare', visible: true},
  {id: 'traveller', label: 'Traveller', visible: false},
  {id: 'vehicleCategory', label: 'Category', visible: false},
  {id: 'driverComments', label: 'Comments', visible: false}
]

/**
 * Popover to toggle column visibility and drag-reorder columns.
 * Port of the DashboardReplica ColumnPopover to Chakra UI.
 */
export const ColumnPopover: React.FC<{
  columns: ColumnConfig[]
  onColumnsChange: (columns: ColumnConfig[]) => void
  onReset: () => void
}> = ({columns, onColumnsChange, onReset}) => {
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const handleToggle = (id: string) => {
    onColumnsChange(
      columns.map(col => (col.id === id ? {...col, visible: !col.visible} : col))
    )
  }

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return
    const draggedIndex = columns.findIndex(col => col.id === draggedId)
    const targetIndex = columns.findIndex(col => col.id === targetId)
    if (draggedIndex === -1 || targetIndex === -1) return
    const next = [...columns]
    const removed = next.splice(draggedIndex, 1)[0]!
    next.splice(targetIndex, 0, removed)
    onColumnsChange(next)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
  }

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Icon as={FaCog} />}
          aria-label="Customize columns">
          <Text display={{base: 'none', sm: 'inline'}}>Columns</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="260px" bg={bg} borderColor={borderColor}>
        <PopoverHeader
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={2}
          px={3}
          fontSize="sm"
          fontWeight="medium">
          Customize Columns
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<Icon as={FaUndo} boxSize={3} />}
            onClick={onReset}>
            Reset
          </Button>
        </PopoverHeader>
        <PopoverBody p={2} maxH="300px" overflowY="auto">
          {columns.map(col => (
            <HStack
              key={col.id}
              draggable
              onDragStart={() => handleDragStart(col.id)}
              onDragOver={e => handleDragOver(e, col.id)}
              onDragEnd={handleDragEnd}
              p={2}
              borderRadius="md"
              cursor="grab"
              opacity={draggedId === col.id ? 0.5 : 1}
              _hover={{bg: hoverBg}}
              transition="all 0.2s"
              spacing={2}>
              <Icon as={FaGripVertical} boxSize={3} color="gray.400" />
              <Checkbox
                size="sm"
                isChecked={col.visible}
                onChange={() => handleToggle(col.id)}
                colorScheme={PRIMARY_COLOR_SCHEME}>
                <Text fontSize="sm">{col.label}</Text>
              </Checkbox>
            </HStack>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

// ──────────────────────────────────────────────────────
// Sort Order Select
// ──────────────────────────────────────────────────────

export type SortOrder = 'earliest' | 'latest'

export const SortOrderSelect: React.FC<{
  value: SortOrder
  onChange: (v: SortOrder) => void
}> = ({value, onChange}) => {
  return (
    <Select
      size="sm"
      w={{base: 'full', md: '220px'}}
      value={value}
      onChange={e => onChange(e.target.value as SortOrder)}
      icon={value === 'earliest' ? <FaSortAmountUp /> : <FaSortAmountDown />}>
      <option value="earliest">Pickup: Earliest first</option>
      <option value="latest">Pickup: Latest first</option>
    </Select>
  )
}

// ──────────────────────────────────────────────────────
// SectionTitle (for detail panels)
// ──────────────────────────────────────────────────────

export const SectionTitle: React.FC<{children: React.ReactNode}> = ({
  children
}) => (
  <Text
    fontSize="xs"
    fontWeight="bold"
    textTransform="uppercase"
    letterSpacing="wider"
    color={useColorModeValue('gray.500', 'gray.400')}
    mb={2}
    mt={4}>
    {children}
  </Text>
)

// ──────────────────────────────────────────────────────
// CardContainer (consistent surface wrapper)
// ──────────────────────────────────────────────────────

export const CardContainer: React.FC<{
  children: React.ReactNode
  borderLeftColor?: string
  [key: string]: any
}> = ({children, borderLeftColor, ...rest}) => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderLeftWidth={borderLeftColor ? '4px' : '1px'}
      borderLeftColor={borderLeftColor || borderColor}
      borderRadius="lg"
      shadow="sm"
      {...rest}>
      {children}
    </Box>
  )
}
