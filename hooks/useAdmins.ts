import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

export const useAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async (): Promise<Admin[]> => {
      const response = await api.get(API_ROUTES.AUTH.ADMIN_LIST);
      return response.data.admins;
    },
  });
};
