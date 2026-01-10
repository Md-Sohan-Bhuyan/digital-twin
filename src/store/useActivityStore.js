import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useActivityStore = create(
  persist(
    (set, get) => ({
      activities: [],
      activityFilters: {
        type: 'all',
        user: 'all',
        dateRange: null,
      },

      // Add activity log
      addActivity: (activity) => {
        const newActivity = {
          id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          ...activity,
        };
        
        set((prev) => ({
          activities: [newActivity, ...prev.activities].slice(0, 1000), // Keep last 1000
        }));
        
        return newActivity;
      },

      // Filter activities
      getFilteredActivities: () => {
        const { activities, activityFilters } = get();
        let filtered = [...activities];

        if (activityFilters.type !== 'all') {
          filtered = filtered.filter((a) => a.type === activityFilters.type);
        }

        if (activityFilters.user !== 'all') {
          filtered = filtered.filter((a) => a.userId === activityFilters.user);
        }

        if (activityFilters.dateRange) {
          const { start, end } = activityFilters.dateRange;
          filtered = filtered.filter((a) => {
            const date = new Date(a.timestamp);
            return date >= start && date <= end;
          });
        }

        return filtered;
      },

      // Set filters
      setActivityFilters: (filters) => {
        set((prev) => ({
          activityFilters: { ...prev.activityFilters, ...filters },
        }));
      },

      // Clear old activities
      clearOldActivities: (daysToKeep = 30) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        set((prev) => ({
          activities: prev.activities.filter(
            (a) => new Date(a.timestamp) > cutoffDate
          ),
        }));
      },

      // Get activity stats
      getActivityStats: (timeRange = '24h') => {
        const { activities } = get();
        const now = new Date();
        let startDate;

        switch (timeRange) {
          case '1h':
            startDate = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case '24h':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }

        const recentActivities = activities.filter(
          (a) => new Date(a.timestamp) > startDate
        );

        const stats = {
          total: recentActivities.length,
          byType: {},
          byUser: {},
          hourly: Array(24).fill(0),
        };

        recentActivities.forEach((activity) => {
          // Count by type
          stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;

          // Count by user
          if (activity.userId) {
            stats.byUser[activity.userId] = (stats.byUser[activity.userId] || 0) + 1;
          }

          // Count by hour
          const hour = new Date(activity.timestamp).getHours();
          stats.hourly[hour]++;
        });

        return stats;
      },
    }),
    {
      name: 'activity-storage',
    }
  )
);

export default useActivityStore;
