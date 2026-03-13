import api from './api';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  hourlyWage: number;
  email: string;
  status: 'active' | 'inactive';
  hireDate: string;
}

export const employeesApi = {
  getAll: () =>
    api.get<Employee[]>('/employees'),

  getById: (id: string) =>
    api.get<Employee>(`/employees/${id}`),

  create: (payload: Omit<Employee, 'id'>) =>
    api.post<Employee>('/employees', payload),

  update: (id: string, payload: Partial<Employee>) =>
    api.put<Employee>(`/employees/${id}`, payload),

  delete: (id: string) =>
    api.delete(`/employees/${id}`),
};
