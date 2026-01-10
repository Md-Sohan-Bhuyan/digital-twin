import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDeviceStore = create(
  persist(
    (set, get) => ({
      devices: [
        {
          id: 'device-1',
          name: 'Production Line A',
          type: 'manufacturing',
          location: 'Factory Floor 1',
          status: 'operational',
          sensorData: {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            vibration: 0,
            energy: 0,
          },
          lastUpdate: null,
          metadata: {
            manufacturer: 'Industrial Systems Inc',
            model: 'DT-2024',
            serialNumber: 'DT-2024-001',
            installationDate: '2024-01-15',
          },
        },
        {
          id: 'device-2',
          name: 'Quality Control Station',
          type: 'quality',
          location: 'Factory Floor 2',
          status: 'operational',
          sensorData: {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            vibration: 0,
            energy: 0,
          },
          lastUpdate: null,
          metadata: {
            manufacturer: 'Quality Tech',
            model: 'QC-2024',
            serialNumber: 'QC-2024-001',
            installationDate: '2024-01-20',
          },
        },
        {
          id: 'device-3',
          name: 'Packaging Unit B',
          type: 'packaging',
          location: 'Factory Floor 1',
          status: 'operational',
          sensorData: {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            vibration: 0,
            energy: 0,
          },
          lastUpdate: null,
          metadata: {
            manufacturer: 'Pack Systems',
            model: 'PK-2024',
            serialNumber: 'PK-2024-001',
            installationDate: '2024-02-01',
          },
        },
      ],
      selectedDeviceId: 'device-1',
      deviceGroups: [
        { id: 'group-1', name: 'Factory Floor 1', deviceIds: ['device-1', 'device-3'] },
        { id: 'group-2', name: 'Factory Floor 2', deviceIds: ['device-2'] },
      ],

      // Actions
      addDevice: (device) => {
        const newDevice = {
          id: `device-${Date.now()}`,
          ...device,
          sensorData: {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            vibration: 0,
            energy: 0,
          },
          lastUpdate: null,
        };
        set((prev) => ({
          devices: [...prev.devices, newDevice],
        }));
        return newDevice.id;
      },

      updateDevice: (deviceId, updates) => {
        set((prev) => ({
          devices: prev.devices.map((device) =>
            device.id === deviceId ? { ...device, ...updates } : device
          ),
        }));
      },

      updateDeviceSensorData: (deviceId, sensorData) => {
        set((prev) => ({
          devices: prev.devices.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  sensorData,
                  lastUpdate: new Date().toISOString(),
                }
              : device
          ),
        }));
      },

      deleteDevice: (deviceId) => {
        set((prev) => ({
          devices: prev.devices.filter((device) => device.id !== deviceId),
          selectedDeviceId:
            prev.selectedDeviceId === deviceId
              ? prev.devices[0]?.id || null
              : prev.selectedDeviceId,
        }));
      },

      setSelectedDevice: (deviceId) => {
        set({ selectedDeviceId: deviceId });
      },

      getSelectedDevice: () => {
        const { devices, selectedDeviceId } = get();
        return devices.find((d) => d.id === selectedDeviceId) || devices[0];
      },

      getDeviceById: (deviceId) => {
        const { devices } = get();
        return devices.find((d) => d.id === deviceId);
      },

      // Device Groups
      addDeviceGroup: (group) => {
        const newGroup = {
          id: `group-${Date.now()}`,
          ...group,
        };
        set((prev) => ({
          deviceGroups: [...prev.deviceGroups, newGroup],
        }));
        return newGroup.id;
      },

      updateDeviceGroup: (groupId, updates) => {
        set((prev) => ({
          deviceGroups: prev.deviceGroups.map((group) =>
            group.id === groupId ? { ...group, ...updates } : group
          ),
        }));
      },

      deleteDeviceGroup: (groupId) => {
        set((prev) => ({
          deviceGroups: prev.deviceGroups.filter((group) => group.id !== groupId),
        }));
      },
    }),
    {
      name: 'device-storage',
    }
  )
);

export default useDeviceStore;
