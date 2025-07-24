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
import { ChevronDown, ChevronUp, Plus, Video } from 'lucide-react'
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
}

const DoctorAppointmentsTable: React.FC = () => {
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const user = useAuthStore((state) => state.user)

  console.log('User from auth store:', user)
  const doctorId = Number(user?.doctor?.id)

  const { data: doctorData, isLoading, error, refetch } = useDoctor(doctorId)
  console.log('Doctor Data with appointments:', doctorData)

  const columnHelper = createColumnHelper<DoctorAppointment>()

  const handleZoomClick = (adminUrl: string) => {
    window.open(adminUrl, '_blank')
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
        size: 50,
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (info) => {
          const date = new Date(info.getValue())
          return (
            <div className="max-w-xs truncate" title={date.toDateString()}>
              {date.toLocaleDateString()}
            </div>
          )
        },
      }),
      columnHelper.accessor('time', {
        header: 'Time',
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                info.getValue().toLowerCase() === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : info.getValue().toLowerCase() === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : info.getValue().toLowerCase() === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : info.getValue().toLowerCase() === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
              }`}
            >
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('duration', {
        header: 'Duration',
        cell: (info) => (
          <div
            className="max-w-xs truncate"
            title={`${info.getValue()} minutes`}
          >
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
              {info.getValue()} min
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('title', {
        header: 'Appointment Type',
        cell: (info) => (
          <div className="max-w-md truncate" title={info.getValue()}>
            <span className="font-medium">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('admin_url', {
        header: 'Zoom Meeting',
        cell: (info) => {
          const adminUrl = info.getValue()
          return (
            <div className="flex items-center justify-center">
              {adminUrl ? (
                <button
                  onClick={() => handleZoomClick(adminUrl)}
                  className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  title="Join Zoom Meeting"
                >
                  <Video className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-gray-400 text-xs">No meeting link</span>
              )}
            </div>
          )
        },
        size: 120,
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
        rowData.id?.toString().includes(searchValue)
      )
    }
  }, [])

  const table = useReactTable({
    data: doctorData?.appointments || [],
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
    // Close the modal
    setIsModalOpen(false)
    // Refetch the doctor data to update the appointments list
    refetch()
  }

  if (isLoading) {
    return (
      <div className="p-4 text-blue-600">Loading doctor appointments...</div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error fetching doctor appointments: {error.message}
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  // Calculate appointment statistics
  const totalAppointments = doctorData?.appointments.length || 0
  const confirmedAppointments =
    doctorData?.appointments.filter((apt) => apt.status === 'confirmed')
      .length || 0
  const pendingAppointments =
    doctorData?.appointments.filter((apt) => apt.status === 'pending').length ||
    0

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          My Appointments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalAppointments}
            </div>
            <p className="text-sm text-blue-600">Total Appointments</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {confirmedAppointments}
            </div>
            <p className="text-sm text-green-600">Confirmed</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingAppointments}
            </div>
            <p className="text-sm text-yellow-600">Pending</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Search Appointments:
          </label>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Appointment</span>
          </button>
        </div>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by appointment type, date, time, or status..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-2 ${
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
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
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No appointments found matching your search.
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Showing {table.getRowModel().rows.length} of{' '}
          {table.getPrePaginationRowModel().rows.length} appointments
          {search &&
            ` (filtered from ${doctorData?.appointments.length || 0} total)`}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'<'}
          </button>

          <span className="flex items-center gap-1">
            <span className="text-sm text-gray-700">Page</span>
            <strong className="text-sm">
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
