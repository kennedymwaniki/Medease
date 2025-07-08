import React, { useMemo, useState } from 'react'
import { CompactTable } from '@table-library/react-table-library/compact'
import { useTheme } from '@table-library/react-table-library/theme'
import { getTheme } from '@table-library/react-table-library/baseline'
import { usePagination } from '@table-library/react-table-library/pagination'
import { useSort } from '@table-library/react-table-library/sort'
import { PencilIcon, Trash } from 'lucide-react'
import type { TUser } from '@/types/types'
import { useUsers } from '@/hooks/useUser'
// import { useDeleteUser, useUsers } from '@/hooks/useUsers'
// import { Item } from '@radix-ui/react-select'

const UsersTable = () => {
  const theme = useTheme(getTheme())
  const [search, setSearch] = useState('')
  const { users, error } = useUsers()
  const { isPending, removeUser } = useDeleteUser()

  if (isPending) {
    ;<div className="p-4 text-blue-600">Deleting user...</div>
  }

  // Filter users based on search
  const filteredData = useMemo(
    () => ({
      nodes: users
        ? users.data?.filter(
            (user: {
              name: string
              username: string
              email: string
              id: { toString: () => string | Array<string> }
            }) =>
              user.name.toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase()) ||
              user.id.toString().includes(search.toLowerCase()),
          )
        : [],
    }),
    [users, search],
  )

  // Pagination setup
  const pagination = usePagination(filteredData, {
    state: {
      page: 0,
      size: 10, // Show 10 users per page
    },
    onChange: onPaginationChange,
  })
  // Sorting setup
  const sort = useSort(
    filteredData,
    {
      onChange: onSortChange,
    },
    {
      sortFns: {
        ID: (array) => array.sort((a: any, b: any) => a.id - b.id),
        NAME: (array) =>
          array.sort((a: any, b: any) => a.name.localeCompare(b.name)),

        EMAIL: (array) =>
          array.sort((a: any, b: any) => a.email.localeCompare(b.email)),
        ROLE: (array) =>
          array.sort((a: any, b: any) => a.role.localeCompare(b.role)),
      },
    },
  )

  function onPaginationChange(action: unknown, state: unknown) {
    console.log(action, state)
  }

  function onSortChange(action: unknown, state: unknown) {
    console.log(action, state)
  }
  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error fetching users: {error.message}
      </div>
    )
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }
  const COLUMNS = [
    {
      label: 'ID',
      renderCell: (item: TUser) => item.id.toString(),
      sort: { sortKey: 'ID' },
    },
    {
      label: 'Name',
      renderCell: (item: TUser) => (
        <div className="max-w-xs truncate" title={item.name}>
          {item.name}
        </div>
      ),
      sort: { sortKey: 'NAME' },
    },

    {
      label: 'Email',
      renderCell: (item: TUser) => (
        <div className="max-w-md truncate" title={item.email}>
          {item.email}
        </div>
      ),
      sort: { sortKey: 'EMAIL' },
    },
    {
      label: 'Role',
      renderCell: (item: TUser) => (
        <div className="max-w-xs truncate" title={item.role}>
          {item.role}
        </div>
      ),
      sort: { sortKey: 'ROLE' },
    },
    {
      label: 'Actions',
      renderCell: (item: TUser) => (
        <div className="max-w-xs truncate flex gap-4" title="Edit User">
          <button onClick={() => removeUser(item.id)}>
            <Trash className="text-red-600" />
          </button>
          <button>
            <PencilIcon className="text-blue-600" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-4">
      <div className="mb-4">
        {' '}
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Search Users:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, username, email, or ID..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <CompactTable
          columns={COLUMNS}
          data={filteredData}
          theme={theme}
          pagination={pagination}
          sort={sort}
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {' '}
        <div className="text-sm text-gray-500">
          Total Pages: {pagination.state.getTotalPages(filteredData.nodes)} |
          Showing {filteredData.nodes.length} of {users?.meta.totalItems} users
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Page:</span>
          <div className="flex gap-1">
            {pagination.state
              .getPages(filteredData.nodes)
              .map((_: unknown, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => pagination.fns.onSetPage(index)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    pagination.state.page === index
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersTable
