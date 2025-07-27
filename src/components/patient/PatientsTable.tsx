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
  ChevronDown,
  ChevronUp,
  FileText,
  Phone,
  Search,
  User,
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import type { Patient } from '@/types/types'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import DoctorPrescriptionForm from '@/components/Doctors/DoctorPrescriptionForm'
import Modal from '@/components/Modal'
import { usePatients } from '@/hooks/usePatients'

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
  }

  const getGenderColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'female':
        return 'bg-pink-50 text-pink-700 border border-pink-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'patient',
        header: 'Patient',
        cell: (info) => {
          const patient = info.row.original
          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {patient.user.imagelink ? (
                  <img
                    src={patient.user.imagelink}
                    alt={patient.name ?? 'Patient'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{patient.name}</div>
                <div className="text-sm text-gray-500">ID: {patient.id}</div>
              </div>
            </div>
          )
        },
        size: 220,
      }),
      columnHelper.accessor('age', {
        header: 'Age',
        cell: (info) => (
          <div className="text-center">
            <div className="font-bold text-gray-900">{info.getValue()}</div>
            <div className="text-xs text-gray-500">years</div>
          </div>
        ),
        size: 80,
      }),
      columnHelper.accessor('gender', {
        header: 'Gender',
        cell: (info) => (
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(info.getValue() ?? '')}`}
          >
            <span className="capitalize">{info.getValue() ?? 'Unknown'}</span>
          </div>
        ),
        size: 120,
      }),
      columnHelper.accessor('contact', {
        header: 'Contact',
        cell: (info) => (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-green-600" />
            <span className="text-gray-900">
              {info.getValue() ?? 'Not provided'}
            </span>
          </div>
        ),
        size: 160,
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: (info) => (
          <div
            className="text-gray-700 line-clamp-1"
            title={info.getValue() ?? ''}
          >
            {info.getValue() ?? 'Not provided'}
          </div>
        ),
        size: 200,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <button
            onClick={() => handleAssignPrescription(info.row.original)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Prescribe
          </button>
        ),
        size: 140,
        enableSorting: false,
      }),
    ],
    [columnHelper],
  )

  const globalFilter = useMemo(() => {
    return (row: any, _columnId: string, value: string) => {
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
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-blue-600">Loading patients...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">
          Error fetching patients: {error.message}
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
          <h2 className="text-2xl font-bold text-gray-900">Patients List</h2>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search patients by name, contact, address..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white  shadow-sm overflow-hidden">
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
          <div className="text-lg font-medium">No patients found</div>
          <div>Try adjusting your search criteria</div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of{' '}
          {table.getPrePaginationRowModel().rows.length} patients
          {search && ` (filtered from ${patientsData?.length || 0} total)`}
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
