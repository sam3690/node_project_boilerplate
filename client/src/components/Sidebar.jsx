import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Sidebar = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/permissions/user/menu');
        if (response.data.success) {
          // Sort menu items by sort_no
          const sortedItems = response.data.data.sort((a, b) => a.sort_no - b.sort_no);
          setMenuItems(sortedItems);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        // Fallback to basic menu items if permission system fails
        setMenuItems([
          { idPages: 1, pageName: 'Dashboard', pageUrl: '/dashboard', menuIcon: 'fas fa-tachometer-alt', sort_no: 1 },
          { idPages: 2, pageName: 'Dashboard Users', pageUrl: '/dashboard/users', menuIcon: 'fas fa-users', sort_no: 2 },
          { idPages: 3, pageName: 'Groups', pageUrl: '/groups', menuIcon: 'fas fa-layer-group', sort_no: 3 },
          { idPages: 4, pageName: 'Pages', pageUrl: '/pages', menuIcon: 'fas fa-file-alt', sort_no: 4 },
          { idPages: 5, pageName: 'Profile', pageUrl: '/profile', menuIcon: 'fas fa-user', sort_no: 5 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMenuItems();
    }
  }, [user]);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        {user && (
          <p className="text-sm text-gray-400 mt-1">
            Welcome, {user.name}
          </p>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.idPages}>
              <Link
                to={item.pageUrl}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActiveLink(item.pageUrl)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <i className={`${item.menuIcon} mr-3`}></i>
                <span>{item.pageName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p>Role: {user?.designation || 'User'}</p>
          <p>Group: {user?.groupName || 'Default'}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
