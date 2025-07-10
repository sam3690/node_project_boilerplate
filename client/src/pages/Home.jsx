import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to Node React MSSQL Boilerplate
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              A secure, production-ready boilerplate application built with Node.js, React, and MSSQL
            </p>
            
            {isAuthenticated ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Welcome back, {user?.firstName || user?.username}!
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/dashboard" 
                    className="inline-flex items-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Go to Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="inline-flex items-center px-8 py-3 text-base font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-8 py-3 text-base font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Authentication</h3>
              <p className="text-gray-600">Session-based authentication with password hashing and security management</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">🗄️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">MSSQL Integration</h3>
              <p className="text-gray-600">Robust database connection with SQL Server using mssql package</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Modern React</h3>
              <p className="text-gray-600">React 18 with hooks, context API, and modern development practices</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Vite Build Tool</h3>
              <p className="text-gray-600">Lightning-fast development with Vite's modern build system</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tailwind CSS</h3>
              <p className="text-gray-600">Utility-first CSS framework for rapid UI development</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Production Ready</h3>
              <p className="text-gray-600">Environment variables, error handling, and deployment-ready configuration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Backend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Node.js + Express</li>
                <li>MSSQL Database</li>
                <li>Session Authentication</li>
                <li>bcrypt Password Hashing</li>
                <li>Express Validator</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>React 18</li>
                <li>Vite Build Tool</li>
                <li>React Router v6</li>
                <li>React Hook Form</li>
                <li>Tailwind CSS v3</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Security</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Helmet.js</li>
                <li>CORS Protection</li>
                <li>Rate Limiting</li>
                <li>Input Sanitization</li>
                <li>Environment Variables</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
