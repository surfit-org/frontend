import { client } from '@/api';
import { useAuthStore } from '@/stores/auth.store';

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function ping() {
  const { data, error } = await client.GET('/ping', {
    headers: getAuthHeaders(),
  });
  if (error) throw new Error('ping failed');
  return data;
}
