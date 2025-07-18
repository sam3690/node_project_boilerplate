import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminService } from '../../services/adminService'
import { toast } from 'react-toastify'

const ManagePages = () => {
  const { user } = useAuth()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPage, setEditingPage] = useState(null)
  const [formData, setFormData] = useState({
    pageName: '',
    pageUrl: '',
    isParent: 0,
    idParent: '0',
    menuIcon: '',
    menuClass: '',
    isMenu: 1,
    isTitle: 0,
    titlePara: '',
    sort_no: 1,
    isActive: 1,
    langName: 'en'
  })

  // Check if user is superadmin
  useEffect(() => {
    if (user?.designation !== 'superadmin') {
      toast.error('Access denied. Only superadmin can access this page.')
      window.location.href = '/dashboard'
      return
    }
    loadPages()
  }, [user])

  const loadPages = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllPages()
      setPages(response.data)
    } catch (error) {
      toast.error(error.message || 'Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPage) {
        await adminService.updatePage(editingPage.idPages, formData)
        toast.success('Page updated successfully!')
      } else {
        await adminService.createPage(formData)
        toast.success('Page created successfully!')
      }
      setShowAddModal(false)
      setEditingPage(null)
      resetForm()
      loadPages()
    } catch (error) {
      toast.error(error.message || 'Failed to save page')
    }
  }

  const handleEdit = (page) => {
    setEditingPage(page)
    setFormData({
      pageName: page.pageName || '',
      pageUrl: page.pageUrl || '',
      isParent: page.isParent ? 1 : 0,
      idParent: page.idParent || '0',
      menuIcon: page.menuIcon || '',
      menuClass: page.menuClass || '',
      isMenu: page.isMenu ? 1 : 0,
      isTitle: page.isTitle || 0,
      titlePara: page.titlePara || '',
      sort_no: page.sort_no || 1,
      isActive: page.isActive ? 1 : 0,
      langName: page.langName || 'en'
    })
    setShowAddModal(true)
  }

  const handleDelete = async (pageId) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await adminService.deletePage(pageId)
        toast.success('Page deleted successfully!')
        loadPages()
      } catch (error) {
        toast.error(error.message || 'Failed to delete page')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      pageName: '',
      pageUrl: '',
      isParent: 0,
      idParent: '0',
      menuIcon: '',
      menuClass: '',
      isMenu: 1,
      isTitle: 0,
      titlePara: '',
      sort_no: 1,
      isActive: 1,
      langName: 'en'
    })
  }

  const getParentPages = () => {
    return pages.filter(page => page.isParent === 1 || page.isParent === true)
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Pages</h1>
          <p className="text-gray-600 mt-2">Configure pages and navigation structure</p>
        </div>
        <button
          onClick={() => {
            setEditingPage(null)
            resetForm()
            setShowAddModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Page
        </button>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.sort((a, b) => a.sort_no - b.sort_no).map((page) => (
              <tr key={page.idPages}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    {page.menuIcon && <span className="mr-2">{page.menuIcon}</span>}
                    {page.pageName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.pageUrl}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {page.isParent ? 'Parent' : 'Child'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {page.idParent === '0' ? 'None' : 
                   pages.find(p => p.idPages.toString() === page.idParent)?.pageName || page.idParent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.sort_no}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    page.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {page.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(page)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(page.idPages)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPage ? 'Edit Page' : 'Add New Page'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Page Name</label>
                    <input
                      type="text"
                      value={formData.pageName}
                      onChange={(e) => setFormData({...formData, pageName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Page URL</label>
                    <input
                      type="text"
                      value={formData.pageUrl}
                      onChange={(e) => setFormData({...formData, pageUrl: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Is Parent</label>
                    <select
                      value={formData.isParent}
                      onChange={(e) => setFormData({...formData, isParent: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Page</label>
                    <select
                      value={formData.idParent}
                      onChange={(e) => setFormData({...formData, idParent: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      disabled={formData.isParent === 1}
                    >
                      <option value="0">None</option>
                      {getParentPages().map((page) => (
                        <option key={page.idPages} value={page.idPages.toString()}>
                          {page.pageName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sort Number</label>
                    <input
                      type="number"
                      value={formData.sort_no}
                      onChange={(e) => setFormData({...formData, sort_no: parseInt(e.target.value) || 1})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Menu Icon</label>
                    <input
                      type="text"
                      value={formData.menuIcon}
                      onChange={(e) => setFormData({...formData, menuIcon: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      maxLength={20}
                      placeholder="e.g., 📄, 👥, ⚙️"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Menu Class</label>
                    <input
                      type="text"
                      value={formData.menuClass}
                      onChange={(e) => setFormData({...formData, menuClass: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Show in Menu</label>
                    <select
                      value={formData.isMenu}
                      onChange={(e) => setFormData({...formData, isMenu: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <input
                      type="text"
                      value={formData.langName}
                      onChange={(e) => setFormData({...formData, langName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingPage(null)
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
                    {editingPage ? 'Update' : 'Create'}
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

export default ManagePages
