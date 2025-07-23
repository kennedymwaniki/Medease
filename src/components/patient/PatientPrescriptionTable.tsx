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
import { ChevronDown, ChevronUp, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import type { PaystackPushResponse } from '@/types/types'
import { usePatient } from '@/hooks/usePatients'
import { useAuthStore } from '@/store/authStore'
import { usePaymentsPaystack } from '@/hooks/usePayments'

interface PatientPrescription {
  id: number
  medicationName: string
  dosage: string
  frequency: string
  status: string
  startDate: Date
  endDate: Date
  isPaid: boolean
}

const PatientPrescriptionTable: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const userEmail = user?.email || ''

  const { payStackPaymentAsync, isPending, paymentError } =
    usePaymentsPaystack()

  // console.log('User from auth store:', user)
  const patientId = Number(user?.patient?.id)
  const {
    data: patientData,
    isLoading,
    error: patienterror,
  } = usePatient(patientId)
  // console.log('Patient Data for prescriptions:', patientData)

  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const columnHelper = createColumnHelper<PatientPrescription>()

  const handlePayment = async (
    prescriptionId: number,
    medicationName: string,
  ) => {
    const amount = 1000 // Example amount, replace with actual logic to get amount
    console.log('Payment initialized')

    try {
      toast.success(`Payment initialized for ${medicationName}`, {
        description: `Processing payment for prescription ID: ${prescriptionId}`,
      })

      const result = await payStackPaymentAsync({
        email: userEmail,
        amount,
      })
      console.log('Payment result from paystack:', result.data)

      if (result.data.data.authorization_url) {
        window.location.href = result.data.data.authorization_url
      }
      toast.success('Payment successful! Redirecting to payment page...')
    } catch (error) {
      console.error('Payment failed:', error)
      toast.error('Payment failed. Please try again.')
    }
  }

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
                  : info.getValue().toLowerCase() === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : info.getValue().toLowerCase() === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : info.getValue().toLowerCase() === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
              }`}
            >
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('isPaid', {
        header: 'Payment Status',
        cell: (info) => (
          <div className="max-w-xs truncate">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                info.getValue()
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {info.getValue() ? 'Paid' : 'Unpaid'}
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
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const isPaid = info.row.original.isPaid
          const isDisabled = isPaid || isPending

          return (
            <div className="flex justify-center">
              <button
                disabled={isDisabled}
                onClick={() =>
                  !isPaid &&
                  handlePayment(
                    info.row.original.id,
                    info.row.original.medicationName,
                  )
                }
                className={`flex items-center gap-1 px-3 py-1 text-white text-xs font-medium rounded transition-colors focus:outline-none focus:ring-2 ${
                  isPaid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDisabled
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }`}
                title={isPaid ? 'Already Paid' : 'Pay for Prescription'}
              >
                <CreditCard className="w-3 h-3" />
                {isPaid ? 'Paid' : isPending ? 'Paying.....' : 'Pay Now'}
              </button>
            </div>
          )
        },
        size: 100,
        enableSorting: false,
      }),
    ],
    [columnHelper, isPending],
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
        rowData.id?.toString().includes(searchValue)
      )
    }
  }, [])

  const table = useReactTable({
    data:
      patientData?.prescriptions.map((prescription) => ({
        ...prescription,
        startDate: prescription.startDate,
        endDate: new Date(prescription.endDate),
      })) || [],
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
      <div className="p-4 text-blue-600">Loading patient prescriptions...</div>
    )
  }

  if (patienterror) {
    return (
      <div className="p-4 text-red-600">
        Error fetching patient prescriptions: {patienterror.message}
      </div>
    )
  }

  if (paymentError) {
    return <p>An Error Ocurred</p>
  }

  if (isPending) {
    return <p>Loading......</p>
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <div className="p-1">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Patient Prescriptions
        </h2>
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
          placeholder="Search by medication, dosage, frequency, or status..."
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
          <tbody className="bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-6 py-0.5 text-sm text-gray-900"
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
            ` (filtered from ${patientData?.prescriptions.length || 0} total)`}
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

export default PatientPrescriptionTable
