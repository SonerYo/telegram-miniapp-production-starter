import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { Spinner } from '@/components/ui/primitives';
import { useTelegramRuntime } from '@/lib/telegram/TelegramProvider';

import { createApiClient, type ApiClient } from './client';

const ApiContext = createContext<ApiClient | null>(null);

export function ApiProvider({ children }: PropsWithChildren) {
  const runtime = useTelegramRuntime();
  const [client, setClient] = useState<ApiClient | null>(null);

  useEffect(() => {
    let active = true;
    void createApiClient(runtime).then((created) => {
      if (active) setClient(created);
    });
    return () => {
      active = false;
    };
  }, [runtime]);

  if (!client) return <Spinner label="Connecting to the API" />;
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}

export function useApiClient(): ApiClient {
  const client = useContext(ApiContext);
  if (!client) throw new Error('useApiClient must be used within ApiProvider');
  return client;
}
