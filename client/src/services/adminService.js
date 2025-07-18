import api from './api';

export const adminService = {
  // Users Management
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get users' };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  // Groups Management
  getAllGroups: async () => {
    try {
      const response = await api.get('/admin/groups');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get groups' };
    }
  },

  createGroup: async (groupData) => {
    try {
      const response = await api.post('/admin/groups', groupData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create group' };
    }
  },

  updateGroup: async (groupId, groupData) => {
    try {
      const response = await api.put(`/admin/groups/${groupId}`, groupData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update group' };
    }
  },

  deleteGroup: async (groupId) => {
    try {
      const response = await api.delete(`/admin/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete group' };
    }
  },

  // Pages Management
  getAllPages: async () => {
    try {
      const response = await api.get('/admin/pages');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get pages' };
    }
  },

  createPage: async (pageData) => {
    try {
      const response = await api.post('/admin/pages', pageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create page' };
    }
  },

  updatePage: async (pageId, pageData) => {
    try {
      const response = await api.put(`/admin/pages/${pageId}`, pageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update page' };
    }
  },

  deletePage: async (pageId) => {
    try {
      const response = await api.delete(`/admin/pages/${pageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete page' };
    }
  },

  // Page Permissions Management
  getPagePermissions: async (groupId) => {
    try {
      const response = await api.get(`/admin/permissions/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get permissions' };
    }
  },

  updatePagePermissions: async (groupId, permissions) => {
    try {
      const response = await api.put(`/admin/permissions/${groupId}`, { permissions });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update permissions' };
    }
  }
};
