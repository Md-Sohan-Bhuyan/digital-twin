import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Role-based permissions
const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
  MAINTENANCE: 'maintenance',
};

const PERMISSIONS = {
  [ROLES.ADMIN]: ['all'],
  [ROLES.OPERATOR]: ['view', 'monitor', 'export', 'alerts'],
  [ROLES.VIEWER]: ['view', 'export'],
  [ROLES.MAINTENANCE]: ['view', 'monitor', 'maintenance', 'logs'],
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      permissions: [],

      // Login
      login: (email, password) => {
        // In production, this would call an API
        // For demo, we'll simulate authentication
        const users = {
          'admin@digitaltwin.com': { 
            id: 'admin-1', 
            email: 'admin@digitaltwin.com', 
            name: 'Admin User', 
            role: ROLES.ADMIN,
            avatar: null 
          },
          'operator@digitaltwin.com': { 
            id: 'operator-1', 
            email: 'operator@digitaltwin.com', 
            name: 'Operator', 
            role: ROLES.OPERATOR,
            avatar: null 
          },
          'viewer@digitaltwin.com': { 
            id: 'viewer-1', 
            email: 'viewer@digitaltwin.com', 
            name: 'Viewer', 
            role: ROLES.VIEWER,
            avatar: null 
          },
        };

        const user = users[email];
        if (user && password === 'password123') {
          const token = `token_${Date.now()}`;
          set({
            user,
            isAuthenticated: true,
            token,
            permissions: PERMISSIONS[user.role] || [],
          });
          return { success: true, user };
        }
        return { success: false, error: 'Invalid credentials' };
      },

      // Logout
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          permissions: [],
        });
      },

      // Check permission
      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes('all') || permissions.includes(permission);
      },

      // Update user profile
      updateProfile: (updates) => {
        set((prev) => ({
          user: { ...prev.user, ...updates },
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated, 
        token: state.token,
        permissions: state.permissions 
      }),
    }
  )
);

export default useAuthStore;
export { ROLES, PERMISSIONS };
