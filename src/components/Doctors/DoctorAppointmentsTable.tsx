import React, { useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Plus,
  Video,
  XCircle,
} from 'lucide-react'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { useDoctor } from '@/hooks/useDoctors'
import { useAuthStore } from '@/store/authStore'
import Modal from '@/components/Modal'
import DoctorAppointmentForm from '@/components/Doctors/DoctorAppointmentForm'

interface DoctorAppointment {
  id: number
  date: string
  time: string
  status: string
  duration: number
  title: string
  admin_url?: string | null
  patient: {
    id: number
    name: string
    age: number | null
    gender: string | null
    contact: string | null
    address: string | null
    user: {
      firstname: string
      lastname: string
      imagelink?: string | null | undefined
    }
  }
}

const DoctorAppointmentsTable: React.FC = () => {
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const user = useAuthStore((state) => state.user)
  const doctorId = Number(user?.doctor?.id)

  const { data: doctorData, isLoading, error, refetch } = useDoctor(doctorId)

  const columnHelper = createColumnHelper<DoctorAppointment>()

  const handleZoomClick = (adminUrl: string) => {
    window.open(adminUrl, '_blank')
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200'
      case 'completed':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getTypeIcon = (title: string) => {
    const typeColors = [
      'bg-blue-100 text-blue-600',
      'bg-purple-100 text-purple-600',
      'bg-green-100 text-green-600',
      'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600',
    ]
    const index = title.length % typeColors.length
    return typeColors[index]
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'dateTime',
        header: 'Date & Time',
        cell: (info) => {
          const date = new Date(info.row.original.date)
          const time = info.row.original.time
          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-sm text-gray-500">{time}</div>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor('title', {
        header: 'Type',
        cell: (info) => (
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeIcon(info.getValue())}`}
            >
              <div className="w-3 h-3 rounded-full bg-current"></div>
            </div>
            <div>
              <div className="font-bold text-gray-900">{info.getValue()}</div>
              <div className="text-sm text-gray-500">
                {info.row.original.duration} min
              </div>
            </div>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'patient',
        header: 'Patient',
        cell: (info) => {
          const patient = info.row.original.patient
          const patientName = `${patient.user.firstname} ${patient.user.lastname}`
          return (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {patient.user.imagelink ? (
                  <img
                    src={patient.user.imagelink}
                    alt={patientName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {patientName}
                </div>
                <div className="text-xs text-gray-500">
                  {patient.age ? `Age: ${patient.age}` : 'Age: N/A'}
                </div>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(info.getValue())}`}
          >
            {getStatusIcon(info.getValue())}
            <span className="capitalize">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('admin_url', {
        header: 'Join Meeting',
        cell: (info) => {
          const adminUrl = info.getValue()
          const status = info.row.original.status.toLowerCase()
          const isDisabled = status === 'cancelled' || status === 'completed'

          return (
            <div className="flex items-center justify-center">
              {adminUrl && !isDisabled ? (
                <button
                  onClick={() => handleZoomClick(adminUrl)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Join Zoom Meeting"
                >
                  <Video className="w-4 h-4" />
                  <span className="text-sm font-medium">Join</span>
                </button>
              ) : adminUrl && isDisabled ? (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  title="Meeting unavailable"
                >
                  <Video className="w-4 h-4" />
                  <span className="text-sm font-medium">Join</span>
                </button>
              ) : (
                <span className="text-gray-400 text-sm">No meeting</span>
              )}
            </div>
          )
        },
        size: 140,
        enableSorting: false,
      }),
    ],
    [columnHelper],
  )

  // Global filter function
  const globalFilter = useMemo(() => {
    return (row: any, _columnId: string, value: string) => {
      const searchValue = value.toLowerCase()
      const rowData = row.original

      return (
        rowData.title?.toLowerCase().includes(searchValue) ||
        rowData.status?.toLowerCase().includes(searchValue) ||
        rowData.date?.toLowerCase().includes(searchValue) ||
        rowData.time?.toLowerCase().includes(searchValue) ||
        rowData.id?.toString().includes(searchValue) ||
        `${rowData.patient?.user?.firstname} ${rowData.patient?.user?.lastname}`
          .toLowerCase()
          .includes(searchValue)
      )
    }
  }, [])

  const table = useReactTable({
    data: doctorData?.appointments
      ? doctorData.appointments.map((appointment: any) => ({
          ...appointment,
          patient: {
            ...appointment.patient,
            name: appointment.patient.name ?? '',
          },
        }))
      : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    globalFilterFn: globalFilter,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
  })

  const handleAppointmentSuccess = (appointmentDetails: any) => {
    console.log('Appointment scheduled successfully:', appointmentDetails)
    setIsModalOpen(false)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-blue-600">Loading doctor appointments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">
          Error fetching doctor appointments: {error.message}
        </div>
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Schedule Appointment</span>
          </button>
        </div>
        <div className="relative">
          <input
            id="search"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search appointments..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-2 ${
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none hover:text-blue-600'
                            : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="flex flex-col">
                            <ChevronUp
                              className={`w-3 h-3 ${
                                header.column.getIsSorted() === 'asc'
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                            <ChevronDown
                              className={`w-3 h-3 -mt-1 ${
                                header.column.getIsSorted() === 'desc'
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium">No appointments found</div>
          <div>Try adjusting your search criteria</div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of{' '}
          {table.getPrePaginationRowModel().rows.length} appointments
          {search &&
            ` (filtered from ${doctorData?.appointments.length || 0} total)`}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {'<'}
          </button>

          <span className="flex items-center gap-1 px-3 py-2">
            <span className="text-sm text-gray-700">Page</span>
            <strong className="text-sm font-semibold">
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {'>>'}
          </button>
        </div>
      </div>

      {/* Modal for Doctor Appointment Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Appointment"
        size="full"
      >
        <DoctorAppointmentForm
          onAppointmentSuccess={handleAppointmentSuccess}
        />
      </Modal>
    </div>
  )
}

export default DoctorAppointmentsTable
