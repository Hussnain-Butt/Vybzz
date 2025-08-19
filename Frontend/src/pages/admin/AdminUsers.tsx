import React, { useState, useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from 'react-icons/fi'

// User data type
interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'Active' | 'Inactive' | 'Suspended'
  lastLogin: string
}

// Dummy user data
const initialUsers: User[] = [
  {
    id: 1,
    name: 'Ali Hassan',
    email: 'ali.hassan@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-08-10',
  },
  {
    id: 2,
    name: 'Fatima Zahra',
    email: 'fatima.zahra@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2024-08-11',
  },
  {
    id: 3,
    name: 'Bilal Khan',
    email: 'bilal.khan@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '2024-07-25',
  },
  {
    id: 4,
    name: 'Ayesha Siddiqa',
    email: 'ayesha.s@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2024-08-12',
  },
  {
    id: 5,
    name: 'Usman Ghani',
    email: 'usman.g@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
    role: 'Viewer',
    status: 'Suspended',
    lastLogin: '2024-06-15',
  },
  {
    id: 6,
    name: 'Sana Javed',
    email: 'sana.javed@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2024-08-12',
  },
  // Add more users for pagination
  {
    id: 7,
    name: 'Ahmed Raza',
    email: 'ahmed.raza@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d',
    role: 'Viewer',
    status: 'Active',
    lastLogin: '2024-08-09',
  },
  {
    id: 8,
    name: 'Hina Altaf',
    email: 'hina.altaf@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026711d',
    role: 'Admin',
    status: 'Inactive',
    lastLogin: '2024-08-01',
  },
]

const USERS_PER_PAGE = 5

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // GSAP animations
  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    )
  }, [])

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    return users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((user) => statusFilter === 'All' || user.status === statusFilter)
  }, [users, searchTerm, statusFilter])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)

  // Handlers
  const handleAddUser = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDeleteUser = (id: number) => {
    setDeletingUserId(id)
    setIsConfirmModalOpen(true)
  }

  const confirmDelete = () => {
    if (deletingUserId) {
      setUsers(users.filter((user) => user.id !== deletingUserId))
    }
    setIsConfirmModalOpen(false)
    setDeletingUserId(null)
  }

  const handleSaveUser = (user: User) => {
    if (editingUser) {
      // Edit
      setUsers(users.map((u) => (u.id === user.id ? user : u)))
    } else {
      // Add
      setUsers([...users, { ...user, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  return (
    <div ref={containerRef} className="p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage Users</h1>
          <p className="text-lg text-[rgb(var(--color-text-secondary))] mt-1">
            Here you can manage all users.
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-[rgb(var(--color-primary-blue))] text-white font-semibold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          <FiPlus /> Add User
        </button>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="bg-[rgb(var(--color-surface-1))] p-4 rounded-xl mb-6 flex justify-between items-center gap-4">
        <div className="relative w-full max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[rgb(var(--color-surface-2))] text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-cyan))]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[rgb(var(--color-surface-2))] text-white pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-cyan))]"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-[rgb(var(--color-surface-1))] rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[rgb(var(--color-surface-2))]">
              <tr>
                <th className="p-4 font-semibold text-white">User</th>
                <th className="p-4 font-semibold text-white">Role</th>
                <th className="p-4 font-semibold text-white">Status</th>
                <th className="p-4 font-semibold text-white">Last Login</th>
                <th className="p-4 font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[rgb(var(--color-surface-2))] hover:bg-[rgb(var(--color-surface-2))/50] transition-colors"
                >
                  <td className="p-4 flex items-center gap-4">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-sm text-[rgb(var(--color-text-muted))]">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-white">{user.role}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        user.status === 'Active'
                          ? 'bg-green-500/20 text-green-400'
                          : user.status === 'Inactive'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-[rgb(var(--color-text-secondary))]">{user.lastLogin}</td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-[rgb(var(--color-surface-2))] flex justify-between items-center text-[rgb(var(--color-text-secondary))]">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-[rgb(var(--color-surface-3))] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-[rgb(var(--color-surface-3))] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <UserFormModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onClose={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  )
}

// UserFormModal Component (for Add/Edit)
const UserFormModal = ({
  user,
  onSave,
  onClose,
}: {
  user: User | null
  onSave: (user: User) => void
  onClose: () => void
}) => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Viewer',
    status: user?.status || 'Active',
    avatar: user?.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
    lastLogin: user?.lastLogin || new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, id: user?.id || Date.now() })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-[rgb(var(--color-surface-1))] rounded-xl p-8 w-full max-w-md animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{user ? 'Edit User' : 'Add New User'}</h2>
          <button
            onClick={onClose}
            className="text-[rgb(var(--color-text-muted))] hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[rgb(var(--color-surface-2))] p-2 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[rgb(var(--color-surface-2))] p-2 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              className="w-full bg-[rgb(var(--color-surface-2))] p-2 rounded-lg text-white"
            >
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-[rgb(var(--color-surface-3))] text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[rgb(var(--color-primary-blue))] text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ConfirmDeleteModal Component
const ConfirmDeleteModal = ({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void
  onClose: () => void
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-[rgb(var(--color-surface-1))] rounded-xl p-8 w-full max-w-sm animate-fadeIn">
        <h2 className="text-xl font-bold text-white mb-4">Are you sure?</h2>
        <p className="text-[rgb(var(--color-text-secondary))] mb-6">
          This action cannot be undone. This will permanently delete the user.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-[rgb(var(--color-surface-3))] text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-lg">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
