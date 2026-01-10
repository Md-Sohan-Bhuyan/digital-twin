import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAlertConfigStore = create(
  persist(
    (set, get) => ({
      alertRules: [
        {
          id: 'temp-high',
          name: 'High Temperature Alert',
          sensorType: 'temperature',
          condition: 'greaterThan',
          threshold: 30,
          severity: 'warning',
          enabled: true,
          notification: true,
          email: false,
          action: null,
        },
        {
          id: 'temp-critical',
          name: 'Critical Temperature Alert',
          sensorType: 'temperature',
          condition: 'greaterThan',
          threshold: 35,
          severity: 'critical',
          enabled: true,
          notification: true,
          email: false,
          action: null,
        },
        {
          id: 'vibration-high',
          name: 'High Vibration Alert',
          sensorType: 'vibration',
          condition: 'greaterThan',
          threshold: 7,
          severity: 'warning',
          enabled: true,
          notification: true,
          email: false,
          action: null,
        },
        {
          id: 'pressure-out-of-range',
          name: 'Pressure Out of Range',
          sensorType: 'pressure',
          condition: 'outOfRange',
          threshold: { min: 1000, max: 1050 },
          severity: 'warning',
          enabled: true,
          notification: true,
          email: false,
          action: null,
        },
      ],

      // Actions
      addAlertRule: (rule) => {
        const newRule = {
          id: `rule-${Date.now()}`,
          ...rule,
          enabled: rule.enabled !== undefined ? rule.enabled : true,
        };
        set((prev) => ({
          alertRules: [...prev.alertRules, newRule],
        }));
        return newRule.id;
      },

      updateAlertRule: (ruleId, updates) => {
        set((prev) => ({
          alertRules: prev.alertRules.map((rule) =>
            rule.id === ruleId ? { ...rule, ...updates } : rule
          ),
        }));
      },

      deleteAlertRule: (ruleId) => {
        set((prev) => ({
          alertRules: prev.alertRules.filter((rule) => rule.id !== ruleId),
        }));
      },

      toggleAlertRule: (ruleId) => {
        set((prev) => ({
          alertRules: prev.alertRules.map((rule) =>
            rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
          ),
        }));
      },

      // Check if sensor data triggers any alerts
      checkAlerts: (sensorData, deviceId = null) => {
        const { alertRules } = get();
        const triggeredAlerts = [];

        alertRules.forEach((rule) => {
          if (!rule.enabled) return;

          const sensorValue = sensorData[rule.sensorType];
          if (sensorValue === undefined || sensorValue === null) return;

          let triggered = false;

          switch (rule.condition) {
            case 'greaterThan':
              triggered = sensorValue > rule.threshold;
              break;
            case 'lessThan':
              triggered = sensorValue < rule.threshold;
              break;
            case 'equals':
              triggered = sensorValue === rule.threshold;
              break;
            case 'outOfRange':
              triggered =
                sensorValue < rule.threshold.min || sensorValue > rule.threshold.max;
              break;
            case 'inRange':
              triggered =
                sensorValue >= rule.threshold.min && sensorValue <= rule.threshold.max;
              break;
            default:
              break;
          }

          if (triggered) {
            triggeredAlerts.push({
              ruleId: rule.id,
              ruleName: rule.name,
              sensorType: rule.sensorType,
              sensorValue,
              severity: rule.severity,
              threshold: rule.threshold,
              deviceId,
              timestamp: new Date().toISOString(),
            });
          }
        });

        return triggeredAlerts;
      },

      getAlertRulesBySensor: (sensorType) => {
        const { alertRules } = get();
        return alertRules.filter((rule) => rule.sensorType === sensorType);
      },

      getEnabledAlertRules: () => {
        const { alertRules } = get();
        return alertRules.filter((rule) => rule.enabled);
      },
    }),
    {
      name: 'alert-config-storage',
    }
  )
);

export default useAlertConfigStore;
