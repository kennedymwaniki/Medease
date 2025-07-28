/* eslint-disable @typescript-eslint/no-unnecessary-condition */
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
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Pencil,
  Pill,
  Stethoscope,
  Trash,
  User,
  XCircle,
} from 'lucide-react'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import type { Prescription } from '@/types/types'
import {
  useDeletePrescription,
  usePrescriptions,
} from '@/hooks/usePrescriptions'

const PrescriptionsTable = () => {
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const { prescriptions, isLoading, error } = usePrescriptions()
  const { isPending, removePrescription } = useDeletePrescription()

  const columnHelper = createColumnHelper<Prescription>()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />
      case 'inactive':
        return <AlertCircle className="w-3 h-3" />
      case 'expired':
        return <XCircle className="w-3 h-3" />
      case 'completed':
        return <CheckCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const UserAvatar = ({
    imageUrl,
    firstName,
    lastName,
    fallbackIcon,
  }: {
    imageUrl?: string | null
    firstName: string
    lastName: string
    fallbackIcon: React.ReactNode
  }) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div
          className={`${imageUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-sm font-semibold text-gray-600`}
        >
          {initials || fallbackIcon}
        </div>
      </div>
    )
  }

  const columns = useMemo(
    () => [
      // Removed 'id' column
      columnHelper.display({
        id: 'medication',
        header: 'Medication',
        cell: (info) => {
          const prescription = info.row.original
          const medication = prescription.medication
          return (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 truncate">
                  {prescription.medicationName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {medication.type && (
                    <span className="capitalize">{medication.type}</span>
                  )}
                  {medication.manufacturer && (
                    <span className="ml-2 text-xs">
                      • {medication.manufacturer}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        },
        size: 220,
      }),

      columnHelper.display({
        id: 'dosageFrequency',
        header: 'Dosage & Frequency',
        cell: (info) => {
          const prescription = info.row.original
          return (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full text-xs font-medium">
                  {prescription.dosage}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-medium">
                  {prescription.frequency}
                </span>
              </div>
            </div>
          )
        },
        size: 180,
      }),

      columnHelper.display({
        id: 'duration',
        header: 'Duration',
        cell: (info) => {
          const prescription = info.row.original
          const startDate = new Date(prescription.startDate)
          const endDate = new Date(prescription.endDate)

          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {startDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  -{' '}
                  {endDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.ceil(
                    (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{' '}
                  days
                </div>
              </div>
            </div>
          )
        },
        size: 160,
      }),

      columnHelper.display({
        id: 'patient',
        header: 'Patient',
        cell: (info) => {
          const patient = info.row.original.patient
          const user = patient.user
          const firstName = user.firstname || ''
          const lastName = user.lastname || ''
          const fullName =
            `${firstName} ${lastName}`.trim() ||
            patient.name ||
            'Unknown Patient'

          return (
            <div className="flex items-center space-x-3">
              <UserAvatar
                imageUrl={user.imagelink}
                firstName={firstName}
                lastName={lastName}
                fallbackIcon={<User className="w-4 h-4" />}
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 truncate">
                  {fullName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {patient.age && `${patient.age} years`}
                  {patient.gender && patient.age && ' • '}
                  {patient.gender}
                </div>
              </div>
            </div>
          )
        },
        size: 200,
      }),

      columnHelper.display({
        id: 'doctor',
        header: 'Prescribed By',
        cell: (info) => {
          const doctor = info.row.original.doctor

          if (!doctor) {
            return (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-sm text-gray-400">No doctor assigned</div>
              </div>
            )
          }

          const user = doctor.user
          const firstName = user.firstname || ''
          const lastName = user.lastname || ''
          const fullName = `${firstName} ${lastName}`.trim() || 'Unknown Doctor'

          return (
            <div className="flex items-center space-x-3">
              <UserAvatar
                imageUrl={user.imagelink}
                firstName={firstName}
                lastName={lastName}
                fallbackIcon={<Stethoscope className="w-4 h-4" />}
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 truncate">
                  Dr. {fullName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {doctor.specialization}
                </div>
                {doctor.experience && (
                  <div className="text-xs text-gray-400">
                    {doctor.experience} years exp.
                  </div>
                )}
              </div>
            </div>
          )
        },
        size: 200,
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(info.getValue())}`}
          >
            {getStatusIcon(info.getValue())}
            <span className="capitalize">{info.getValue()}</span>
          </div>
        ),
        size: 120,
      }),

      columnHelper.accessor('isPaid', {
        header: 'Payment',
        cell: (info) => (
          <div className="flex items-center justify-center">
            <div
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                info.getValue()
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>{info.getValue() ? 'Paid' : 'Unpaid'}</span>
            </div>
          </div>
        ),
        size: 120,
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => removePrescription(info.row.original.id)}
              disabled={isPending}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete prescription"
            >
              <Trash className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
            <button
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
              title="Edit prescription"
            >
              <Pencil className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
            </button>
          </div>
        ),
        size: 100,
        enableSorting: false,
      }),
    ],
    [isPending, removePrescription, columnHelper],
  )

  // Global filter function
  const globalFilter = useMemo(() => {
    return (row: any, _columnId: string, value: string) => {
      const searchValue = value.toLowerCase()
      const rowData = row.original

      const doctorName =
        rowData.doctor?.user?.firstname && rowData.doctor?.user?.lastname
          ? `${rowData.doctor.user.firstname} ${rowData.doctor.user.lastname}`
          : ''

      const patientName =
        rowData.patient?.user?.firstname && rowData.patient?.user?.lastname
          ? `${rowData.patient.user.firstname} ${rowData.patient.user.lastname}`
          : rowData.patient?.name || ''

      return (
        rowData.medicationName?.toLowerCase().includes(searchValue) ||
        rowData.dosage?.toLowerCase().includes(searchValue) ||
        rowData.frequency?.toLowerCase().includes(searchValue) ||
        rowData.status?.toLowerCase().includes(searchValue) ||
        patientName?.toLowerCase().includes(searchValue) ||
        doctorName.toLowerCase().includes(searchValue) ||
        rowData.id?.toString().includes(searchValue) ||
        rowData.doctor?.specialization?.toLowerCase().includes(searchValue) ||
        rowData.medication?.type?.toLowerCase().includes(searchValue) ||
        rowData.medication?.manufacturer?.toLowerCase().includes(searchValue)
      )
    }
  }, [])

  const table = useReactTable({
    data: prescriptions || [],
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

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-blue-600 font-medium">
          Deleting prescription...
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-blue-600 font-medium">
          Loading prescriptions...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600 font-medium">
          Error fetching prescriptions: {error.message}
        </div>
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prescriptions
          </h1>
          <p className="text-gray-600">
            Manage and view all medication prescriptions
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search prescriptions..."
              className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
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
                              <div className="flex flex-col">
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
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-900"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mt-4">
            <div className="text-gray-400 mb-4">
              <Pill className="w-12 h-12 mx-auto" />
            </div>
            <div className="text-lg font-medium text-gray-900 mb-2">
              No prescriptions found
            </div>
            <div className="text-gray-500">
              {search
                ? 'Try adjusting your search criteria'
                : 'No prescriptions have been created yet'}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-medium">
              {table.getRowModel().rows.length}
            </span>{' '}
            of{' '}
            <span className="font-medium">
              {table.getPrePaginationRowModel().rows.length}
            </span>{' '}
            prescriptions
            {search && (
              <span className="text-gray-500">
                {' '}
                (filtered from {prescriptions?.length || 0} total)
              </span>
            )}
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

            <span className="flex items-center gap-1 px-4 py-2">
              <span className="text-sm text-gray-700">Page</span>
              <strong className="text-sm font-semibold text-blue-600">
                {table.getState().pagination.pageIndex + 1}
              </strong>
              <span className="text-sm text-gray-700">of</span>
              <strong className="text-sm font-semibold">
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
    </div>
  )
}

export default PrescriptionsTable
