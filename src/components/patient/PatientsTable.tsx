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
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import type { Patient } from '@/types/types'
import { usePatients } from '@/hooks/usePatients'
import Modal from '@/components/Modal'
import DoctorPrescriptionForm from '@/components/Doctors/DoctorPrescriptionForm'

const PatientsTable: React.FC = () => {
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null,
  )
  const [selectedPatientName, setSelectedPatientName] = useState<string>('')

  const { data: patientsData, isLoading, error } = usePatients()

  const columnHelper = createColumnHelper<Patient>()

  const handleAssignPrescription = (patient: Patient) => {
    setSelectedPatientId(patient.id)
    setSelectedPatientName(patient.name ?? '')
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedPatientId(null)
    setSelectedPatientName('')
  }

  const handlePrescriptionSuccess = () => {
    handleModalClose()
    // You can add a success notification here if needed
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
        size: 50,
      }),
      columnHelper.accessor('user.imagelink', {
        header: 'Image',
        cell: (info) => (
          <div className="flex justify-center">
            <img
              src={info.getValue() || ''}
              alt="Patient"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/40/40'
              }}
            />
          </div>
        ),
        size: 80,
        enableSorting: false,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <div
            className="max-w-xs truncate font-medium"
            title={info.getValue() || undefined}
          >
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('age', {
        header: 'Age',
        cell: (info) => (
          <div className="max-w-xs truncate" title={`${info.getValue()} years`}>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {info.getValue()} yrs
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('gender', {
        header: 'Gender',
        cell: (info) => (
          <div
            className="max-w-xs truncate"
            title={info.getValue() || 'unknown'}
          >
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                info.getValue()?.toLowerCase() === 'male'
                  ? 'bg-blue-100 text-blue-800'
                  : info.getValue()?.toLowerCase() === 'female'
                    ? 'bg-pink-100 text-pink-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {info.getValue() ?? 'To be specified'}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('contact', {
        header: 'Contact',
        cell: (info) => (
          <div
            className="max-w-xs truncate"
            title={info.getValue() || undefined}
          >
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {info.getValue() ?? '.......'}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: (info) => (
          <div
            className="max-w-md truncate"
            title={info.getValue() || undefined}
          >
            <span className="text-gray-700">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex justify-center">
            <button
              onClick={() => handleAssignPrescription(info.row.original)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Assign Prescription"
            >
              <FileText className="w-3 h-3" />
              Assign Prescription
            </button>
          </div>
        ),
        size: 10,
        enableSorting: false,
      }),
    ],
    [columnHelper],
  )

  // Global filter function
  const globalFilter = useMemo(() => {
    return (row: any, columnId: string, value: string) => {
      const searchValue = value.toLowerCase()
      const rowData = row.original

      return (
        rowData.name?.toLowerCase().includes(searchValue) ||
        rowData.gender?.toLowerCase().includes(searchValue) ||
        rowData.contact?.toLowerCase().includes(searchValue) ||
        rowData.address?.toLowerCase().includes(searchValue) ||
        rowData.age?.toString().includes(searchValue) ||
        rowData.id?.toString().includes(searchValue)
      )
    }
  }, [])

  const table = useReactTable({
    data: patientsData || [],
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
    return <div className="p-4 text-blue-600">Loading patients...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error fetching patients: {error.message}
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Patients</h2>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Search Patients:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, gender, contact, address, or age..."
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
          No patients found matching your search.
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Showing {table.getRowModel().rows.length} of{' '}
          {table.getPrePaginationRowModel().rows.length} patients
          {search && ` (filtered from ${patientsData?.length || 0} total)`}
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

      {/* Prescription Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={`Assign Prescription - ${selectedPatientName}`}
        size="lg"
      >
        {selectedPatientId && (
          <DoctorPrescriptionForm
            patientId={selectedPatientId}
            onSuccess={handlePrescriptionSuccess}
          />
        )}
      </Modal>
    </div>
  )
}

export default PatientsTable
