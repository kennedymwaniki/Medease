import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
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

  console.log('User from auth store:', user)
  const doctorId = Number(user?.doctor?.id)

  const { data: doctorData, isLoading, error } = useDoctor(doctorId)
  console.log('Doctor Data:', doctorData)

  const columnHelper = createColumnHelper<DoctorPrescription>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
        size: 50,
      }),
      columnHelper.accessor('medicationName', {
        header: 'Medication Name',
        cell: (info) => (
          <div className="max-w-md truncate" title={info.getValue()}>
            <span className="font-medium text-gray-900">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('dosage', {
        header: 'Dosage',
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('frequency', {
        header: 'Frequency',
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
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
                info.getValue().toLowerCase() === 'active'
                  ? 'bg-green-100 text-green-800'
                  : info.getValue().toLowerCase() === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : info.getValue().toLowerCase() === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : info.getValue().toLowerCase() === 'expired'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('startDate', {
        header: 'Start Date',
        cell: (info) => {
          const date = new Date(info.getValue())
          return (
            <div className="max-w-xs truncate" title={date.toDateString()}>
              {date.toLocaleDateString()}
            </div>
          )
        },
      }),
      columnHelper.accessor('endDate', {
        header: 'End Date',
        cell: (info) => {
          const date = new Date(info.getValue())
          return (
            <div className="max-w-xs truncate" title={date.toDateString()}>
              {date.toLocaleDateString()}
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
        rowData.id?.toString().includes(searchValue)
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
      <div className="p-4 text-blue-600">Loading doctor prescriptions...</div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error fetching doctor prescriptions: {error.message}
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

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your issued Prescriptions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalPrescriptions}
            </div>
            <p className="text-sm text-blue-600">Total Prescriptions</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {activePrescriptions}
            </div>
            <p className="text-sm text-green-600">Active</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {completedPrescriptions}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Search Prescriptions:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by medication name, dosage, frequency, or status..."
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
          No prescriptions found matching your search.
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Showing {table.getRowModel().rows.length} of{' '}
          {table.getPrePaginationRowModel().rows.length} prescriptions
          {search &&
            ` (filtered from ${doctorData?.prescriptions.length || 0} total)`}
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
    </div>
  )
}

export default DoctorPrescriptionsTable
