import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import type { PropsWithChildren } from 'react';

import { Spinner } from '@/components/ui/primitives';

import { createTelegramRuntime } from './runtime';
import { applyTheme } from './theme';
import type { TelegramRuntimeAdapter, TelegramRuntimeSnapshot } from './types';
import { applyViewport } from './viewport';

const RuntimeContext = createContext<TelegramRuntimeAdapter | null>(null);

function RuntimeBootstrap({
  runtime,
  children,
}: PropsWithChildren<{ runtime: TelegramRuntimeAdapter }>) {
  const subscribe = useCallback((listener: () => void) => runtime.subscribe(listener), [runtime]);
  const getSnapshot = useCallback(() => runtime.getSnapshot(), [runtime]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    applyTheme(snapshot.themeParams, snapshot.colorScheme);
    applyViewport(snapshot.viewport);
  }, [snapshot]);

  useEffect(() => {
    runtime.expand();
    runtime.ready();
  }, [runtime]);

  return <RuntimeContext.Provider value={runtime}>{children}</RuntimeContext.Provider>;
}

export function TelegramProvider({ children }: PropsWithChildren) {
  const [runtime, setRuntime] = useState<TelegramRuntimeAdapter | null>(null);

  useEffect(() => {
    let active = true;
    void createTelegramRuntime().then((created) => {
      if (active) setRuntime(created);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!runtime) {
    return (
      <main className="bootstrap-loading" aria-label="Starting app">
        <Spinner label="Starting Starter Space" />
      </main>
    );
  }
  return <RuntimeBootstrap runtime={runtime}>{children}</RuntimeBootstrap>;
}

export function useTelegramRuntime(): TelegramRuntimeAdapter {
  const runtime = useContext(RuntimeContext);
  if (!runtime) throw new Error('useTelegramRuntime must be used inside TelegramProvider');
  return runtime;
}

export function useTelegramSnapshot(): TelegramRuntimeSnapshot {
  const runtime = useTelegramRuntime();
  const subscribe = useCallback((listener: () => void) => runtime.subscribe(listener), [runtime]);
  const getSnapshot = useCallback(() => runtime.getSnapshot(), [runtime]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
