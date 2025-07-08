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
import { ChevronDown, ChevronUp, Pencil, Trash } from 'lucide-react'
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
    pageSize: 10,
  })

  const { prescriptions, isLoading, error } = usePrescriptions()
  const { isPending, removePrescription } = useDeletePrescription()
  console.log('Prescriptions data:', prescriptions)

  const columnHelper = createColumnHelper<Prescription>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
        size: 80,
      }),
      columnHelper.accessor('medicationName', {
        header: 'Medication',
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            <span className="font-medium text-blue-900">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('dosage', {
        header: 'Dosage',
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('frequency', {
        header: 'Frequency',
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
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
                  : info.getValue().toLowerCase() === 'inactive'
                    ? 'bg-gray-100 text-gray-800'
                    : info.getValue().toLowerCase() === 'expired'
                      ? 'bg-red-100 text-red-800'
                      : info.getValue().toLowerCase() === 'completed'
                        ? 'bg-blue-100 text-blue-800'
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
      columnHelper.accessor('patient.name', {
        header: 'Patient',
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            <span className="font-medium text-gray-900">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex gap-2" title="Prescription Actions">
            <button
              onClick={() => removePrescription(info.row.original.id)}
              className="p-1 hover:bg-red-50 rounded transition-colors"
              disabled={isPending}
            >
              <Trash className="w-4 h-4 text-red-600" />
            </button>
            <button className="p-1 hover:bg-blue-50 rounded transition-colors">
              <Pencil className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        ),
        size: 100,
      }),
    ],
    [isPending, removePrescription, columnHelper],
  )

  // Global filter function
  const globalFilter = useMemo(() => {
    return (row: any, columnId: string, value: string) => {
      const searchValue = value.toLowerCase()
      const rowData = row.original

      return (
        rowData.medicationName?.toLowerCase().includes(searchValue) ||
        rowData.dosage?.toLowerCase().includes(searchValue) ||
        rowData.frequency?.toLowerCase().includes(searchValue) ||
        rowData.status?.toLowerCase().includes(searchValue) ||
        rowData.patient?.name?.toLowerCase().includes(searchValue) ||
        rowData.id?.toString().includes(searchValue)
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
    return <div className="p-4 text-blue-600">Deleting prescription...</div>
  }

  if (isLoading) {
    return <div className="p-4 text-blue-600">Loading prescriptions...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error fetching prescriptions: {error.message}
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <div className="p-4">
      <div className="mb-4">
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
          placeholder="Search by medication, dosage, frequency, status, or patient..."
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
          {search && ` (filtered from ${prescriptions?.length || 0} total)`}
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

export default PrescriptionsTable
