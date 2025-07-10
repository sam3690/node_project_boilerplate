import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your Dashboard</h1>
        <p className="text-gray-600">Hello, {user?.firstName || user?.username}! Here's your account overview.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">Account Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <label className="font-medium text-gray-700">Username:</label>
              <span className="text-gray-900">{user?.username}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <label className="font-medium text-gray-700">Email:</label>
              <span className="text-gray-900">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <label className="font-medium text-gray-700">First Name:</label>
              <span className="text-gray-900">{user?.firstName || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <label className="font-medium text-gray-700">Last Name:</label>
              <span className="text-gray-900">{user?.lastName || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <label className="font-medium text-gray-700">Account Created:</label>
              <span className="text-gray-900">{formatDate(user?.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <label className="font-medium text-gray-700">Last Login:</label>
              <span className="text-gray-900">{formatDate(user?.lastLogin)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">Quick Actions</h3>
          <div className="space-y-4">
            <a href="/profile" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200 group">
              <div className="text-2xl mr-4">👤</div>
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Edit Profile</h4>
                <p className="text-gray-600 text-sm">Update your personal information</p>
              </div>
            </a>
            <a href="/profile" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200 group">
              <div className="text-2xl mr-4">🔒</div>
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Change Password</h4>
                <p className="text-gray-600 text-sm">Update your account security</p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">Application Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{user?.status === 1 ? 'Active' : 'Inactive'}</div>
              <div className="text-sm text-gray-600">Account Status</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl mr-3">🔐</div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Logged in successfully</p>
                <span className="text-sm text-gray-500">Just now</span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl mr-3">👤</div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Account created</p>
                <span className="text-sm text-gray-500">{formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
