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
  Pencil,
  Plus,
  Search,
  Trash,
  User2,
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import type { User } from '@/types/types'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import Modal from '@/components/Modal'
import RegistrationForm from '@/components/forms/RegistrationForm'
import { useDeleteUser, useUsers } from '@/hooks/useUser'

const UsersTable = () => {
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: users, error, refetch } = useUsers()
  const { isPending, removeUser } = useDeleteUser()
  console.log('Users data:', users)
  const columnHelper = createColumnHelper<User>()

  const handleRegistrationSuccess = () => {
    setIsModalOpen(false)
    refetch()
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'doctor':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'admin':
        return 'bg-purple-50 text-purple-700 border border-purple-200'
      case 'patient':
        return 'bg-green-50 text-green-700 border border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'user',
        header: 'User',
        cell: (info) => {
          const user = info.row.original
          const fullName = `${user.firstname} ${user.lastname}`
          const imageUrl = user.imagelink

          return (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}
                >
                  <User2 className="w-6 h-6 text-gray-400" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 truncate">
                  {fullName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {user.email}
                </div>
                <div className="text-xs text-gray-400">ID: {user.id}</div>
              </div>
            </div>
          )
        },
        size: 300,
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => (
          <div className="flex justify-start">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(info.getValue())}`}
            >
              {info.getValue().charAt(0).toUpperCase() +
                info.getValue().slice(1).toLowerCase()}
            </span>
          </div>
        ),
        size: 120,
      }),
      columnHelper.display({
        id: 'contact',
        header: 'Contact',
        cell: (info) => {
          const user = info.row.original
          const contact = user.patient?.contact || user.doctor?.contact || 'N/A'

          return (
            <div className="text-sm text-gray-900">
              {contact !== 'N/A' ? (
                <a
                  href={`tel:${contact}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {contact}
                </a>
              ) : (
                <span className="text-gray-400">Not provided</span>
              )}
            </div>
          )
        },
        size: 150,
      }),
      columnHelper.display({
        id: 'address',
        header: 'Address',
        cell: (info) => {
          const user = info.row.original
          const address = user.patient?.address || 'Not provided'

          return (
            <div className="text-sm text-gray-900 max-w-xs">
              {address !== 'Not provided' ? (
                <div className="truncate" title={address}>
                  {address}
                </div>
              ) : (
                <span className="text-gray-400">Not provided</span>
              )}
            </div>
          )
        },
        size: 200,
      }),
      columnHelper.display({
        id: 'additional_info',
        header: 'Additional Info',
        cell: (info) => {
          const user = info.row.original

          if (user.role.toLowerCase() === 'patient' && user.patient) {
            return (
              <div className="text-sm">
                {user.patient.age && (
                  <div className="text-gray-900">
                    <span className="font-medium">Age:</span> {user.patient.age}
                  </div>
                )}
                {user.patient.gender && (
                  <div className="text-gray-600">
                    <span className="font-medium">Gender:</span>{' '}
                    {user.patient.gender}
                  </div>
                )}
              </div>
            )
          }

          if (user.role.toLowerCase() === 'doctor' && user.doctor) {
            return (
              <div className="text-sm">
                {user.doctor.specialization && (
                  <div className="text-gray-900">
                    <span className="font-medium">Specialty:</span>{' '}
                    {user.doctor.specialization}
                  </div>
                )}
                {user.doctor.experience && (
                  <div className="text-gray-600">
                    <span className="font-medium">Experience:</span>{' '}
                    {user.doctor.experience} years
                  </div>
                )}
              </div>
            )
          }

          return <span className="text-gray-400 text-sm">N/A</span>
        },
        size: 180,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeUser(info.row.original.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              disabled={isPending}
              title="Delete user"
            >
              <Trash className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
            </button>
            <button
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
              title="Edit user"
            >
              <Pencil className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </button>
          </div>
        ),
        size: 100,
        enableSorting: false,
      }),
    ],
    [isPending, removeUser, columnHelper],
  )

  // Global filter function
  const globalFilter = useMemo(() => {
    return (row: any, _columnId: string, value: string) => {
      const searchValue = value.toLowerCase()
      const rowData = row.original

      return (
        rowData.firstname?.toLowerCase().includes(searchValue) ||
        rowData.lastname?.toLowerCase().includes(searchValue) ||
        rowData.email?.toLowerCase().includes(searchValue) ||
        rowData.role?.toLowerCase().includes(searchValue) ||
        rowData.id?.toString().includes(searchValue) ||
        rowData.patient?.contact?.toLowerCase().includes(searchValue) ||
        rowData.patient?.address?.toLowerCase().includes(searchValue) ||
        rowData.doctor?.specialization?.toLowerCase().includes(searchValue) ||
        rowData.doctor?.contact?.toLowerCase().includes(searchValue)
      )
    }
  }, [])

  const table = useReactTable({
    data: users || [],
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
        <div className="text-blue-600">Deleting user...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 rounded-xl">
        <div className="text-red-600 text-center">
          <div className="font-semibold">Error fetching users</div>
          <div className="text-sm">{error.message}</div>
        </div>
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Users Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and view all system users
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New User</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search users by name, email, role, contact, or address..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
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
                                ? 'cursor-pointer select-none hover:text-blue-600 transition-colors'
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
                      <td key={cell.id} className="px-6 py-4 text-sm">
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
            <User2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </div>
            <div className="text-gray-500">
              {search
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first user'}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {table.getRowModel().rows.length} of{' '}
            {table.getPrePaginationRowModel().rows.length} users
            {search && ` (filtered from ${users?.length || 0} total)`}
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

        {/* Modal for Registration Form */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New User"
          size="lg"
        >
          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        </Modal>
      </div>
    </div>
  )
}

export default UsersTable
