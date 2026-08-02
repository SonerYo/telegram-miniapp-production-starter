import { useQuery } from '@tanstack/react-query';

import { useApiClient } from '@/lib/api/ApiProvider';

export const authKeys = { me: ['auth', 'me'] as const };

export function useCurrentUser() {
  const api = useApiClient();
  return useQuery({
    queryKey: authKeys.me,
    queryFn: ({ signal }) => api.getMe(signal),
    staleTime: 60_000,
  });
}
