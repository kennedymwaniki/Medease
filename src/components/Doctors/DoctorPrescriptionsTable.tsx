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
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  XCircle,
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { useDoctor } from '@/hooks/useDoctors'
import { useAuthStore } from '@/store/authStore'

interface DoctorPrescription {
  id: number
  frequency: string
  medicationName: string
  dosage: string
  status: string
  startDate: string
  endDate: string
  isPaid: boolean
  patient: {
    id: number
    name: string
    age: number
    gender: string
    contact: string
    address: string
    user: {
      firstname: string
      lastname: string
      imagelink?: string | null
    }
  }
}

const DoctorPrescriptionsTable: React.FC = () => {
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const user = useAuthStore((state) => state.user)
  const doctorId = Number(user?.doctor?.id)

  const { data: doctorData, isLoading, error } = useDoctor(doctorId)

  const columnHelper = createColumnHelper<DoctorPrescription>()

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'inactive':
        return <Clock className="w-4 h-4" />
      case 'expired':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'completed':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'inactive':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      case 'expired':
        return 'bg-red-50 text-red-700 border border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getPaymentStatusIcon = (isPaid: boolean) => {
    return isPaid ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <Clock className="w-4 h-4" />
    )
  }

  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid
      ? 'bg-green-50 text-green-700 border border-green-200'
      : 'bg-orange-50 text-orange-700 border border-orange-200'
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('medicationName', {
        header: 'Medication',
        cell: (info) => (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
            </div>
            <div>
              <div className="font-medium text-gray-900">{info.getValue()}</div>
              <div className="text-sm text-gray-500">
                {info.row.original.dosage}
              </div>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('frequency', {
        header: 'Frequency',
        cell: (info) => (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {info.getValue()}
          </span>
        ),
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
      columnHelper.accessor('isPaid', {
        header: 'Payment',
        cell: (info) => (
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(info.getValue())}`}
          >
            {getPaymentStatusIcon(info.getValue())}
            <span>{info.getValue() ? 'Fulfilled' : 'Pending'}</span>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'dates',
        header: 'Duration',
        cell: (info) => {
          const startDate = new Date(info.row.original.startDate)
          const endDate = new Date(info.row.original.endDate)
          return (
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {startDate.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className="text-gray-500">
                to{' '}
                {endDate.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: 'prescribedTo',
        header: 'Prescribed To',
        cell: (info) => {
          const patient = info.row.original.patient
          const patientName = `${patient.user.firstname} ${patient.user.lastname}`
          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {patient.user.imagelink ? (
                  <img
                    src={patient.user.imagelink}
                    alt={patientName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 text-sm truncate">
                  {patientName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {patient.age} years • {patient.gender}
                </div>
              </div>
            </div>
          )
        },
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
        rowData.medicationName?.toLowerCase().includes(searchValue) ||
        rowData.dosage?.toLowerCase().includes(searchValue) ||
        rowData.frequency?.toLowerCase().includes(searchValue) ||
        rowData.status?.toLowerCase().includes(searchValue) ||
        rowData.id?.toString().includes(searchValue) ||
        `${rowData.patient?.user?.firstname} ${rowData.patient?.user?.lastname}`
          .toLowerCase()
          .includes(searchValue) ||
        rowData.patient?.name?.toLowerCase().includes(searchValue)
      )
    }
  }, [])

  const transformedData = useMemo(() => {
    return (
      doctorData?.prescriptions.map((prescription) => ({
        ...prescription,
        startDate:
          prescription.startDate instanceof Date
            ? prescription.startDate.toISOString()
            : prescription.startDate,
        endDate:
          prescription.endDate instanceof Date
            ? prescription.endDate.toISOString()
            : prescription.endDate,
        patient: {
          ...prescription.patient,
          name: prescription.patient.name ?? '', // Ensure name is always a string
        },
      })) || []
    )
  }, [doctorData?.prescriptions])

  const table = useReactTable({
    data: transformedData,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-blue-600">Loading prescriptions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">
          Error fetching prescriptions: {error.message}
        </div>
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  // Calculate prescription statistics
  const totalPrescriptions = doctorData?.prescriptions.length || 0
  const activePrescriptions =
    doctorData?.prescriptions.filter(
      (prescription) => prescription.status === 'active',
    ).length || 0
  const completedPrescriptions =
    doctorData?.prescriptions.filter(
      (prescription) => prescription.status === 'completed',
    ).length || 0
  const paidPrescriptions =
    doctorData?.prescriptions.filter(
      (prescription) => prescription.isPaid === true,
    ).length || 0

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Issued Prescriptions
        </h2>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {totalPrescriptions}
            </div>
            <p className="text-sm text-blue-600 font-medium">
              Total Prescriptions
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {activePrescriptions}
            </div>
            <p className="text-sm text-green-600 font-medium">Active</p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-gray-700">
              {completedPrescriptions}
            </div>
            <p className="text-sm text-gray-600 font-medium">Completed</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-700">
              {paidPrescriptions}
            </div>
            <p className="text-sm text-emerald-600 font-medium">Paid</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            id="search"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by medication, patient name, status..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
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
                  <td key={cell.id} className="px-6 py-4 text-sm">
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
          <div className="text-lg font-medium">No prescriptions found</div>
          <div>Try adjusting your search criteria</div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of{' '}
          {table.getPrePaginationRowModel().rows.length} prescriptions
          {search &&
            ` (filtered from ${doctorData?.prescriptions.length || 0} total)`}
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
    </div>
  )
}

export default DoctorPrescriptionsTable
