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
  CreditCard,
  User,
  XCircle,
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { useAuthStore } from '@/store/authStore'
import { usePaymentsPaystack } from '@/hooks/usePayments'
import { usePatient } from '@/hooks/usePatients'
// import type { AnyDataTag } from '@tanstack/react-query'

interface PatientPrescription {
  id: number
  medicationName: string
  dosage: string
  frequency: string
  status: string
  startDate: Date
  endDate: Date
  isPaid: boolean
  doctor: {
    id: number
    prescription: any
    user: {
      firstname: string
      lastname: string
      imagelink: string
    }
  }
}

const PatientPrescriptionTable: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const userEmail = user?.email || ''

  const { payStackPaymentAsync, isPending, paymentError } =
    usePaymentsPaystack()

  const patientId = Number(user?.patient?.id)
  const {
    data: patientData,
    isLoading,
    error: patienterror,
  } = usePatient(patientId)

  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const columnHelper = createColumnHelper<PatientPrescription>()

  const handlePayment = async (prescriptionId: number) => {
    const amount = 1000 // Example amount, replace with actual logic to get amount
    console.log('Payment initialized')

    try {
      toast.success(
        `Payment initialized for prescription ID: ${prescriptionId}`,
        {
          description: `Processing payment for prescription ID: ${prescriptionId}`,
        },
      )

      const result = await payStackPaymentAsync({
        email: userEmail,
        amount,
        prescriptionId,
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
        header: 'Dates',
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
        id: 'prescribedBy',
        header: 'Prescribed By',
        cell: (info) => {
          const doctor = info.row.original.doctor
          const doctorName = `${doctor.user.firstname} ${doctor.user.lastname}`
          return (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {doctor.user.imagelink ? (
                  <img
                    src={doctor.user.imagelink}
                    alt={doctorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {doctorName}
                </div>
              </div>
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
                onClick={() => !isPaid && handlePayment(info.row.original.id)}
                className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 ${
                  isPaid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDisabled
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 hover:shadow-md'
                }`}
                title={isPaid ? 'Already Paid' : 'Pay for Prescription'}
              >
                <CreditCard className="w-4 h-4" />
                {isPaid ? 'Paid' : isPending ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          )
        },
        size: 120,
        enableSorting: false,
      }),
    ],
    [columnHelper, isPending],
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
        `${rowData.doctor?.user?.firstname} ${rowData.doctor?.user?.lastname}`
          .toLowerCase()
          .includes(searchValue)
      )
    }
  }, [])

  const table = useReactTable({
    data:
      patientData?.prescriptions.map((prescription) => ({
        ...prescription,
        startDate: new Date(prescription.startDate),
        endDate: new Date(prescription.endDate),
        doctor: prescription.doctor || {
          id: 0,
          user: {
            firstname: 'Unknown',
            lastname: 'Doctor',
            imagelink: '',
          },
        },
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
      <div className="flex items-center justify-center p-8">
        <div className="text-blue-600">Loading patient prescriptions...</div>
      </div>
    )
  }

  if (patienterror) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">
          Error fetching patient prescriptions: {patienterror.message}
        </div>
      </div>
    )
  }

  if (paymentError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">An Error Occurred</div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-blue-600">Loading...</div>
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Patient Prescriptions
        </h2>
        <div className="relative">
          <input
            id="search"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search prescriptions..."
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
          <div className="text-lg font-medium">No prescriptions found</div>
          <div>Try adjusting your search criteria</div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of{' '}
          {table.getPrePaginationRowModel().rows.length} prescriptions
          {search &&
            ` (filtered from ${patientData?.prescriptions.length || 0} total)`}
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

export default PatientPrescriptionTable
