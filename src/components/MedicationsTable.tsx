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
  ChevronDown,
  ChevronUp,
  Factory,
  MapPin,
  Package,
  Pencil,
  Pill,
  Plus,
  Route,
  Trash,
  Truck,
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import type { Medication } from '@/types/types'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import Modal from '@/components/Modal'
import MedicationForm from '@/components/forms/DoctorMedicationForm'
import { useDeleteMedication, useMedications } from '@/hooks/useMedications'

const MedicationsTable = () => {
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { medications, isLoading, isError, error, refetch } = useMedications()
  const { isPending, removeMedication } = useDeleteMedication()

  const columnHelper = createColumnHelper<Medication>()

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tablet':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'capsule':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'liquid':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'injection':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'topical':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStockStatus = (stock: any) => {
    if (!stock) {
      return {
        status: 'No Stock',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
      }
    }

    const { currentQuantity, minimumQuantity } = stock
    if (currentQuantity <= 0) {
      return {
        status: 'Out of Stock',
        color: 'bg-red-100 text-red-800 border-red-200',
      }
    } else if (currentQuantity <= minimumQuantity) {
      return {
        status: 'Low Stock',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
      }
    } else {
      return {
        status: 'In Stock',
        color: 'bg-green-100 text-green-800 border-green-200',
      }
    }
  }

  const isExpired = (date: string) => new Date(date) < new Date()
  const isExpiringSoon = (date: string) =>
    new Date(date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'medication',
        header: 'Medication',
        cell: (info) => {
          const medication = info.row.original
          return (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 truncate">
                  {medication.name}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {medication.description}
                </div>
              </div>
            </div>
          )
        },
        size: 250,
      }),

      columnHelper.display({
        id: 'dosageType',
        header: 'Dosage & Type',
        cell: (info) => {
          const medication = info.row.original
          return (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full text-xs font-medium">
                  {medication.dosage}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(medication.type)}`}
                >
                  {medication.type}
                </span>
              </div>
            </div>
          )
        },
        size: 160,
      }),

      columnHelper.display({
        id: 'routeManufacturer',
        header: 'Route & Manufacturer',
        cell: (info) => {
          const medication = info.row.original
          return (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Route className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-600 capitalize">
                  {medication.route}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Factory className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-500 truncate">
                  {medication.manufacturer}
                </span>
              </div>
            </div>
          )
        },
        size: 180,
      }),

      columnHelper.display({
        id: 'expiration',
        header: 'Expiration',
        cell: (info) => {
          const medication = info.row.original
          const date = new Date(medication.expirationDate)
          const expired = isExpired(
            medication.expirationDate as unknown as string,
          )
          const expiringSoon = isExpiringSoon(
            medication.expirationDate as unknown as string,
          )

          let statusColor = 'bg-green-100 text-green-800 border-green-200'
          if (expired) {
            statusColor = 'bg-red-100 text-red-800 border-red-200'
          } else if (expiringSoon) {
            statusColor = 'bg-amber-100 text-amber-800 border-amber-200'
          }

          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-50 to-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor}`}
                >
                  {date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {expired
                    ? 'Expired'
                    : expiringSoon
                      ? 'Expiring Soon'
                      : 'Valid'}
                </div>
              </div>
            </div>
          )
        },
        size: 160,
      }),

      columnHelper.display({
        id: 'stock',
        header: 'Stock Information',
        cell: (info) => {
          const medication = info.row.original
          const stockInfo = getStockStatus(medication.stock)

          if (!medication.stock) {
            return (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${stockInfo.color}`}
                  >
                    {stockInfo.status}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    No stock data
                  </div>
                </div>
              </div>
            )
          }

          const { currentQuantity, minimumQuantity, location, batchNumber } =
            medication.stock

          return (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Package className="w-3 h-3 text-gray-400" />
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${stockInfo.color}`}
                >
                  {stockInfo.status}
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Qty:</span>
                  <span>
                    {currentQuantity}/{minimumQuantity} min
                  </span>
                </div>
                {location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
                {batchNumber && (
                  <div className="flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span className="truncate">{batchNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )
        },
        size: 200,
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeMedication(info.row.original.id)}
              disabled={isPending}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete medication"
            >
              <Trash className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
            <button
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
              title="Edit medication"
            >
              <Pencil className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
            </button>
          </div>
        ),
        size: 100,
        enableSorting: false,
      }),
    ],
    [isPending, removeMedication, columnHelper],
  )

  // Global filter function
  const globalFilter = useMemo(() => {
    return (row: any, _columnId: string, value: string) => {
      const searchValue = value.toLowerCase()
      const rowData = row.original

      return (
        rowData.name?.toLowerCase().includes(searchValue) ||
        rowData.description?.toLowerCase().includes(searchValue) ||
        rowData.dosage?.toLowerCase().includes(searchValue) ||
        rowData.type?.toLowerCase().includes(searchValue) ||
        rowData.route?.toLowerCase().includes(searchValue) ||
        rowData.manufacturer?.toLowerCase().includes(searchValue) ||
        rowData.stock?.location?.toLowerCase().includes(searchValue) ||
        rowData.stock?.batchNumber?.toLowerCase().includes(searchValue)
      )
    }
  }, [])

  const table = useReactTable({
    data: medications || [],
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
        <div className="text-blue-600 font-medium">Deleting medication...</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-blue-600 font-medium">Loading medications...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600 font-medium">
          Error fetching medications: {error?.message}
        </div>
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleMedicationSuccess = () => {
    handleModalClose()
    refetch() // Refresh the medications list
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Medications
              </h1>
              <p className="text-gray-600">
                Manage and view all medication inventory
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search medications..."
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
              No medications found
            </div>
            <div className="text-gray-500">
              {search
                ? 'Try adjusting your search criteria'
                : 'No medications have been added yet'}
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
            medications
            {search && (
              <span className="text-gray-500">
                {' '}
                (filtered from {medications?.length || 0} total)
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

        {/* Modal for Medication Form */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="Add New Medication"
          size="lg"
        >
          <MedicationForm onSuccess={handleMedicationSuccess} />
        </Modal>
      </div>
    </div>
  )
}

export default MedicationsTable
