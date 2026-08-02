import { useQueryClient } from '@tanstack/react-query';

import { Button, Card, InlineAlert, ListRow } from '@/components/ui/primitives';
import { taskKeys } from '@/features/tasks/queries';
import { configureMockApi, resetMockApi } from '@/mocks/mock-api';
import { useTelegramRuntime, useTelegramSnapshot } from '@/lib/telegram/TelegramProvider';

import styles from './pages.module.css';

export function DevPreviewPage() {
  const runtime = useTelegramRuntime();
  const snapshot = useTelegramSnapshot();
  const queryClient = useQueryClient();
  const refresh = async () => queryClient.invalidateQueries({ queryKey: taskKeys.all });
  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Development only</p>
          <h1>Mock environment controls</h1>
          <p>Exercise Telegram-specific states in a normal browser.</p>
        </div>
      </div>
      <InlineAlert icon="spark">
        This route is removed from production routing. It never represents real Telegram
        authentication.
      </InlineAlert>
      <div className={styles.devGrid}>
        <Card>
          <ListRow title="Runtime" subtitle={snapshot.kind} />
          <ListRow
            title="Viewport"
            subtitle={`${Math.round(snapshot.viewport.stableHeight)}px stable · ${snapshot.viewport.safeAreaInset.top}px top · ${snapshot.viewport.safeAreaInset.bottom}px bottom`}
          />
        </Card>
        <Card>
          <h2 style={{ marginTop: 0, fontSize: '1rem' }}>Theme and safe area</h2>
          <div className={styles.devActions}>
            <Button variant="secondary" onClick={() => runtime.setMockTheme?.('light')}>
              Light
            </Button>
            <Button variant="secondary" onClick={() => runtime.setMockTheme?.('dark')}>
              Dark
            </Button>
            <Button variant="secondary" onClick={() => runtime.setMockSafeArea?.(24, 18)}>
              iOS insets
            </Button>
            <Button variant="secondary" onClick={() => runtime.setMockSafeArea?.(0, 0)}>
              Clear insets
            </Button>
            <Button variant="secondary" onClick={() => runtime.emitMockBack?.()}>
              Emit BackButton
            </Button>
          </div>
        </Card>
        <Card>
          <h2 style={{ marginTop: 0, fontSize: '1rem' }}>API states</h2>
          <div className={styles.devActions}>
            <Button
              variant="secondary"
              onClick={() => {
                configureMockApi({ latencyMs: 1200, fail: false, offline: false });
                void refresh();
              }}
            >
              Slow loading
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                configureMockApi({ empty: true, fail: false, offline: false });
                void refresh();
              }}
            >
              Empty tasks
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                configureMockApi({ fail: true, offline: false });
                void refresh();
              }}
            >
              API error
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                configureMockApi({ offline: true, fail: false });
                void refresh();
              }}
            >
              Network error
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                resetMockApi();
                void refresh();
              }}
            >
              Reset data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
