import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminService } from '../../services/adminService'
import { toast } from 'react-toastify'

const ManageGroups = () => {
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [formData, setFormData] = useState({
    groupName: '',
    isActive: 1
  })

  // Check if user is superadmin
  useEffect(() => {
    if (user?.designation !== 'superadmin') {
      toast.error('Access denied. Only superadmin can access this page.')
      window.location.href = '/dashboard'
      return
    }
    loadGroups()
  }, [user])

  const loadGroups = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllGroups()
      setGroups(response.data)
    } catch (error) {
      toast.error(error.message || 'Failed to load groups')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingGroup) {
        await adminService.updateGroup(editingGroup.idGroup, formData)
        toast.success('Group updated successfully!')
      } else {
        await adminService.createGroup(formData)
        toast.success('Group created successfully!')
      }
      setShowAddModal(false)
      setEditingGroup(null)
      resetForm()
      loadGroups()
    } catch (error) {
      toast.error(error.message || 'Failed to save group')
    }
  }

  const handleEdit = (group) => {
    setEditingGroup(group)
    setFormData({
      groupName: group.groupName,
      isActive: group.isActive
    })
    setShowAddModal(true)
  }

  const handleDelete = async (groupId) => {
    if (groupId === 1) {
      toast.error('Cannot delete superadmin group')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await adminService.deleteGroup(groupId)
        toast.success('Group deleted successfully!')
        loadGroups()
      } catch (error) {
        toast.error(error.message || 'Failed to delete group')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      groupName: '',
      isActive: 1
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Groups</h1>
          <p className="text-gray-600 mt-2">Configure user groups and roles</p>
        </div>
        <button
          onClick={() => {
            setEditingGroup(null)
            resetForm()
            setShowAddModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Group
        </button>
      </div>

      {/* Groups Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group) => (
              <tr key={group.idGroup}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.idGroup}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.groupName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {group.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.createdBy}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(group.createdDateTime).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(group)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  {group.idGroup !== 1 && (
                    <button
                      onClick={() => handleDelete(group.idGroup)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingGroup ? 'Edit Group' : 'Add New Group'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Group Name</label>
                  <input
                    type="text"
                    value={formData.groupName}
                    onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingGroup(null)
                      resetForm()
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {editingGroup ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageGroups
