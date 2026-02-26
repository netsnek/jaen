import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransfers, bookTransferMutation, type ResourceTransfer, type BookTransferArgs } from '../hooks'
import {
  cx, formatDateDisplay, formatPrice,
  StatusPill, ColumnPopover, SortDropdown, DateFilter, StatusFilter,
  CursorPagination, LoadingOverlay, EmptyState, ErrorBanner, DateGroupHeader,
  IconSearch, IconRefresh, IconPlus, IconX,
  type ColumnConfig, type SortOrder, type DateFilterValue,
} from '../components/ui'

const PAYMENT_OPTIONS = ['Cash', 'Card', 'Voucher', 'Invoice']

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'code', label: 'Code', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'route', label: 'Route', visible: true },
  { id: 'pickup', label: 'Pickup', visible: true },
  { id: 'vehicle', label: 'Vehicle', visible: true },
  { id: 'fare', label: 'Price', visible: true },
  { id: 'payment', label: 'Payment', visible: true },
  { id: 'category', label: 'Category', visible: false },
]

const COLUMN_WIDTHS: Record<string, number> = {
  code: 90, status: 110, route: 240, pickup: 140, vehicle: 150, fare: 100, payment: 100, category: 120,
}

const ITEMS_PER_PAGE = 15

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600'
  return (
    <div className={`fixed bottom-4 right-4 z-[60] ${bg} text-white px-4 py-3 rounded-lg shadow-lg text-sm max-w-sm`}>
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        <button className="text-white/80 hover:text-white" onClick={onClose}><IconX className="h-3 w-3" /></button>
      </div>
    </div>
  )
}

function BookTransferModal({ open, onClose, onCreate, loading }: {
  open: boolean; onClose: () => void; onCreate: (args: BookTransferArgs) => void; loading: boolean
}) {
  const [form, setForm] = useState({ pickupLocation: '', dropoffLocation: '', pickupDate: '', pickupTime: '', subject: '', paymentMethode: '' })
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  useEffect(() => { if (open) setForm({ pickupLocation: '', dropoffLocation: '', pickupDate: '', pickupTime: '', subject: '', paymentMethode: '' }) }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pickupLocation || !form.dropoffLocation || !form.pickupDate || !form.pickupTime) return
    const pickupDateTime = `${form.pickupDate}T${form.pickupTime}:00`
    onCreate({
      pickupLocation: form.pickupLocation,
      dropoffLocation: form.dropoffLocation,
      pickupDateTime,
      subject: form.subject || undefined,
      paymentMethode: form.paymentMethode || undefined,
    })
  }

  if (!open) return null

  const ic = "flex w-full rounded-md border border-input px-3 py-2 text-sm h-9 bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Book a transfer</h2>
          <button className="text-muted-foreground hover:text-foreground" onClick={onClose}><IconX className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Date *</label>
                <input type="date" className={ic} value={form.pickupDate} onChange={e => update('pickupDate', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Time *</label>
                <input type="time" className={ic} value={form.pickupTime} onChange={e => update('pickupTime', e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Pickup *</label>
              <input className={ic} placeholder="Hotel, address, etc." value={form.pickupLocation} onChange={e => update('pickupLocation', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Dropoff *</label>
              <input className={ic} placeholder="Airport, address, etc." value={form.dropoffLocation} onChange={e => update('dropoffLocation', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Room / Name</label>
              <input className={ic} placeholder="Room 101 / Mr. Smith" value={form.subject} onChange={e => update('subject', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Payment method</label>
              <select className={ic} value={form.paymentMethode} onChange={e => update('paymentMethode', e.target.value)}>
                <option value="">Select payment</option>
                {PAYMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="inline-flex items-center rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted" onClick={onClose}>Cancel</button>
              <button type="submit" className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50" disabled={loading || !form.pickupLocation || !form.dropoffLocation || !form.pickupDate || !form.pickupTime}>{loading ? 'Booking...' : 'Book'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export function BookingView() {
  const { transfers, isLoading, error, pagination, nextPage, prevPage, goToPage, refetch } = useTransfers(ITEMS_PER_PAGE)
  const navigate = useNavigate()

  const bookings = transfers

  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [mutating, setMutating] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleBookTransfer = useCallback(async (args: BookTransferArgs) => {
    setMutating(true)
    try {
      await bookTransferMutation(args)
      setToast({ message: 'Booking created successfully', type: 'success' })
      setBookModalOpen(false)
      refetch()
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to create booking', type: 'error' })
    } finally { setMutating(false) }
  }, [refetch])

  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS)
  const [colPopoverOpen, setColPopoverOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('earliest')
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('all')
  const [customRange, setCustomRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['Completed', 'Planned', 'In Progress', 'Cancelled']))
  const [searchQuery, setSearchQuery] = useState('')

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const tomorrow = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] }, [])

  const mapStatus = (state: string): string => {
    const s = state?.toLowerCase?.() ?? ''
    if (s === 'completed') return 'Completed'
    if (s === 'planned' || s === 'pending') return 'Planned'
    if (s === 'cancelled' || s === 'canceled' || s === 'terminated') return 'Cancelled'
    if (s === 'in_progress' || s === 'active') return 'In Progress'
    return 'Planned'
  }

  const filteredRows = useMemo(() => {
    let result = bookings.filter(t => selectedStatuses.has(mapStatus(t.state)))

    if (dateFilter === 'today') result = result.filter(t => t.rideDateISO === today)
    else if (dateFilter === 'tomorrow') result = result.filter(t => t.rideDateISO === tomorrow)
    else if (dateFilter === 'custom' && customRange.start && customRange.end) {
      const startStr = customRange.start.toISOString().split('T')[0]
      const endStr = customRange.end.toISOString().split('T')[0]
      result = result.filter(t => t.rideDateISO >= startStr && t.rideDateISO <= endStr)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t =>
        (t.referenceId?.toLowerCase().includes(q)) ||
        (t.pickup?.toLowerCase().includes(q)) ||
        (t.dropoff?.toLowerCase().includes(q)) ||
        (t.customerName?.toLowerCase().includes(q))
      )
    }

    result = [...result].sort((a, b) => {
      const dtA = `${a.rideDateISO} ${a.rideTime}`
      const dtB = `${b.rideDateISO} ${b.rideTime}`
      return sortOrder === 'earliest' ? dtA.localeCompare(dtB) : dtB.localeCompare(dtA)
    })

    return result
  }, [bookings, selectedStatuses, dateFilter, today, tomorrow, sortOrder, customRange, searchQuery])

  const paginatedRows = filteredRows

  const rowsByDate = useMemo(() => {
    const map: Record<string, ResourceTransfer[]> = {}
    paginatedRows.forEach(r => { const k = r.rideDateISO || 'unknown'; if (!map[k]) map[k] = []; map[k].push(r) })
    return map
  }, [paginatedRows])

  const sortedDates = useMemo(() => Object.keys(rowsByDate).sort(), [rowsByDate])
  const visibleColumns = columns.filter(c => c.visible)
  const totalMinWidth = visibleColumns.reduce((sum, col) => sum + (COLUMN_WIDTHS[col.id] || 100), 60)

  const renderCell = (t: ResourceTransfer, colId: string) => {
    const w = COLUMN_WIDTHS[colId] || 100
    const tdClass = 'p-4 align-middle'
    switch (colId) {
      case 'code': return <td key={colId} className={tdClass} style={{ width: w }}><span className="font-medium whitespace-nowrap">{t.referenceId || t.id.slice(0, 8)}</span></td>
      case 'status': return <td key={colId} className={tdClass} style={{ width: w }}><StatusPill status={t.state} /></td>
      case 'route': return <td key={colId} className={tdClass} style={{ width: w }}><div className="space-y-1"><div className="text-sm font-medium">{t.pickup}</div><div className="text-sm text-muted-foreground/60">{t.dropoff}</div></div></td>
      case 'pickup': return <td key={colId} className={tdClass} style={{ width: w }}><div className="space-y-1 whitespace-nowrap"><div className="text-sm font-medium">{formatDateDisplay(t.rideDateISO)}</div><div className="text-sm text-muted-foreground/60">{t.rideTime}</div></div></td>
      case 'vehicle': return <td key={colId} className={tdClass} style={{ width: w }}><div className="text-sm">{t.vehicle || '-'}</div></td>
      case 'fare': return <td key={colId} className={tdClass} style={{ width: w }}><div className="font-semibold whitespace-nowrap">{formatPrice(t.price)}</div></td>
      case 'payment': return <td key={colId} className={tdClass} style={{ width: w }}><div className="text-sm">{t.paymentMethode || '-'}</div></td>
      case 'category': return <td key={colId} className={tdClass} style={{ width: w }}><div className="text-sm">{t.transferCategory || '-'}</div></td>
      default: return null
    }
  }

  const getDateBorderColor = (dateStr: string) => dateStr === today ? '#22c55e' : dateStr === tomorrow ? '#eab308' : 'transparent'
  const getDateHeaderBg = (dateStr: string) => dateStr === today ? 'bg-success/10 text-success' : dateStr === tomorrow ? 'bg-warning/10 text-warning' : 'bg-muted/30 text-muted-foreground'

  return (
    <div className="p-4 md:p-6 max-w-full space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <BookTransferModal open={bookModalOpen} onClose={() => setBookModalOpen(false)} onCreate={handleBookTransfer} loading={mutating} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-1">Customer booking overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 h-9 text-sm font-medium hover:bg-primary/90 transition-colors" onClick={() => setBookModalOpen(true)}>
            <IconPlus className="h-4 w-4" /> Book transfer
          </button>
          <button className="inline-flex items-center gap-2 border border-input rounded-md px-3 h-9 text-sm hover:bg-muted transition-colors" onClick={refetch}>
            <IconRefresh className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <DateFilter value={dateFilter} onChange={setDateFilter} customRange={customRange} onCustomRangeChange={setCustomRange} />
        <div className="w-full md:w-[180px]">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="flex w-full rounded-md border border-input px-3 py-2 text-sm pl-9 h-9 bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <StatusFilter selected={selectedStatuses} onChange={setSelectedStatuses} />
        <SortDropdown value={sortOrder} onChange={setSortOrder} />
      </div>

      {/* Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{filteredRows.length} bookings</span>
          <ColumnPopover columns={columns} onColumnsChange={setColumns} onReset={() => setColumns(DEFAULT_COLUMNS)} open={colPopoverOpen} onOpenChange={setColPopoverOpen} />
        </div>

        {error && <ErrorBanner message={error} />}

        <div className="rounded-lg border bg-card shadow-sm relative overflow-visible">
          {isLoading && <LoadingOverlay />}
          {!isLoading && filteredRows.length === 0 ? (
            <EmptyState message="No bookings found" />
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full caption-bottom text-sm table-fixed" style={{ minWidth: totalMinWidth }}>
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b hover:bg-muted/50">
                      {visibleColumns.map(col => (
                        <th key={col.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground" style={{ width: COLUMN_WIDTHS[col.id] || 100 }}>{col.label}</th>
                      ))}
                      <th className="h-12 px-4" style={{ width: 60 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDates.map(dateStr => (
                      <React.Fragment key={dateStr}>
                        <tr style={{ borderLeft: `4px solid ${getDateBorderColor(dateStr)}` }}>
                          <td colSpan={visibleColumns.length + 1} className="p-0">
                            <div className={cx('px-4 py-2 font-semibold text-sm', getDateHeaderBg(dateStr))}>
                              {new Date(dateStr + 'T00:00:00').toLocaleDateString('de-AT', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </td>
                        </tr>
                        {rowsByDate[dateStr].map(t => (
                          <tr key={t.id} className={cx('border-b transition-colors hover:bg-muted/50', mapStatus(t.state) === 'Completed' ? 'bg-muted/30 text-muted-foreground/60' : '')}>
                            {visibleColumns.map(col => renderCell(t, col.id))}
                            <td className="p-4 align-middle" style={{ width: 60 }}>
                              <button className="text-sm text-primary hover:underline" onClick={() => navigate(`/booking/${t.id}`)}>Details</button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-3 p-4">
                {sortedDates.map(dateStr => (
                  <React.Fragment key={dateStr}>
                    <DateGroupHeader dateStr={dateStr} today={today} tomorrow={tomorrow} />
                    {rowsByDate[dateStr].map(t => (
                      <div key={t.id} className="rounded-lg border bg-card p-4 space-y-3 cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/booking/${t.id}`)}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{t.referenceId || t.id.slice(0, 8)}</span>
                          <StatusPill status={t.state} />
                        </div>
                        <div className="text-sm"><div className="font-medium">{t.pickup}</div><div className="text-muted-foreground">{t.dropoff}</div></div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{formatDateDisplay(t.rideDateISO)} {t.rideTime}</span>
                          <span className="font-semibold">{formatPrice(t.price)}</span>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
        <CursorPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onNext={nextPage}
          onPrev={prevPage}
          onFirst={() => goToPage(1)}
        />
      </div>
    </div>
  )
}
