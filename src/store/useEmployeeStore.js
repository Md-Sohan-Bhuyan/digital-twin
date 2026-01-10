import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useEmployeeStore = create(
  persist(
    (set, get) => ({
      employees: [
        {
          id: 'emp-1',
          name: 'John Smith',
          email: 'john.smith@factory.com',
          role: 'operator',
          department: 'Production',
          sector: 'Sector A',
          machineId: 'device-1',
          status: 'online',
          lastSeen: new Date().toISOString(),
          avatar: null,
          phone: '+1234567890',
          skills: ['Machine Operation', 'Quality Control'],
          shift: 'Day',
          location: 'Factory Floor 1',
        },
        {
          id: 'emp-2',
          name: 'Sarah Johnson',
          email: 'sarah.j@factory.com',
          role: 'operator',
          department: 'Quality',
          sector: 'Sector B',
          machineId: 'device-2',
          status: 'online',
          lastSeen: new Date().toISOString(),
          avatar: null,
          phone: '+1234567891',
          skills: ['Quality Assurance', 'Testing'],
          shift: 'Day',
          location: 'Factory Floor 2',
        },
        {
          id: 'emp-3',
          name: 'Mike Wilson',
          email: 'mike.w@factory.com',
          role: 'operator',
          department: 'Packaging',
          sector: 'Sector C',
          machineId: 'device-3',
          status: 'offline',
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          avatar: null,
          phone: '+1234567892',
          skills: ['Packaging', 'Logistics'],
          shift: 'Night',
          location: 'Factory Floor 1',
        },
        {
          id: 'emp-4',
          name: 'Emily Davis',
          email: 'emily.d@factory.com',
          role: 'maintenance',
          department: 'Maintenance',
          sector: 'All Sectors',
          machineId: null,
          status: 'online',
          lastSeen: new Date().toISOString(),
          avatar: null,
          phone: '+1234567893',
          skills: ['Machine Repair', 'Preventive Maintenance'],
          shift: 'Day',
          location: 'Maintenance Bay',
        },
      ],

      sectors: [
        { id: 'sector-a', name: 'Sector A', location: 'Factory Floor 1', machines: ['device-1'] },
        { id: 'sector-b', name: 'Sector B', location: 'Factory Floor 2', machines: ['device-2'] },
        { id: 'sector-c', name: 'Sector C', location: 'Factory Floor 1', machines: ['device-3'] },
      ],

      assignments: [
        {
          id: 'assign-1',
          employeeId: 'emp-1',
          machineId: 'device-1',
          sectorId: 'sector-a',
          startTime: new Date().toISOString(),
          endTime: null,
          status: 'active',
          task: 'Production Line Operation',
        },
        {
          id: 'assign-2',
          employeeId: 'emp-2',
          machineId: 'device-2',
          sectorId: 'sector-b',
          startTime: new Date().toISOString(),
          endTime: null,
          status: 'active',
          task: 'Quality Control',
        },
      ],

      // Actions
      addEmployee: (employee) => {
        const newEmployee = {
          id: `emp-${Date.now()}`,
          ...employee,
          status: 'offline',
          lastSeen: new Date().toISOString(),
        };
        set((prev) => ({
          employees: [...prev.employees, newEmployee],
        }));
        return newEmployee.id;
      },

      updateEmployee: (employeeId, updates) => {
        set((prev) => ({
          employees: prev.employees.map((emp) =>
            emp.id === employeeId ? { ...emp, ...updates } : emp
          ),
        }));
      },

      deleteEmployee: (employeeId) => {
        set((prev) => ({
          employees: prev.employees.filter((emp) => emp.id !== employeeId),
          assignments: prev.assignments.filter((assign) => assign.employeeId !== employeeId),
        }));
      },

      updateEmployeeStatus: (employeeId, status) => {
        set((prev) => ({
          employees: prev.employees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, status, lastSeen: new Date().toISOString() }
              : emp
          ),
        }));
      },

      assignEmployeeToMachine: (employeeId, machineId, sectorId, task) => {
        const assignment = {
          id: `assign-${Date.now()}`,
          employeeId,
          machineId,
          sectorId,
          startTime: new Date().toISOString(),
          endTime: null,
          status: 'active',
          task,
        };
        set((prev) => ({
          assignments: [...prev.assignments, assignment],
          employees: prev.employees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, machineId, sector: prev.sectors.find((s) => s.id === sectorId)?.name || emp.sector }
              : emp
          ),
        }));
        return assignment.id;
      },

      unassignEmployee: (assignmentId) => {
        set((prev) => {
          const assignment = prev.assignments.find((a) => a.id === assignmentId);
          return {
            assignments: prev.assignments.map((a) =>
              a.id === assignmentId
                ? { ...a, endTime: new Date().toISOString(), status: 'completed' }
                : a
            ),
            employees: prev.employees.map((emp) =>
              emp.id === assignment?.employeeId
                ? { ...emp, machineId: null, sector: 'Unassigned' }
                : emp
            ),
          };
        });
      },

      getEmployeeByMachine: (machineId) => {
        const { employees, assignments } = get();
        const activeAssignment = assignments.find(
          (a) => a.machineId === machineId && a.status === 'active'
        );
        if (activeAssignment) {
          return employees.find((e) => e.id === activeAssignment.employeeId);
        }
        return null;
      },

      getEmployeesBySector: (sectorId) => {
        const { employees, assignments } = get();
        const sectorAssignments = assignments.filter(
          (a) => a.sectorId === sectorId && a.status === 'active'
        );
        return sectorAssignments.map((assign) =>
          employees.find((e) => e.id === assign.employeeId)
        ).filter(Boolean);
      },

      getActiveAssignments: () => {
        const { assignments } = get();
        return assignments.filter((a) => a.status === 'active');
      },
    }),
    {
      name: 'employee-storage',
    }
  )
);

export default useEmployeeStore;
