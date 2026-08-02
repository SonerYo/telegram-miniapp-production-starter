import { Link, useNavigate } from 'react-router';

import { Icon } from '@/components/ui/Icon';
import { Card, ErrorState, Skeleton } from '@/components/ui/primitives';
import { useCurrentUser } from '@/features/auth/queries';
import { useTasks } from '@/features/tasks/queries';
import { useUiStore } from '@/app/ui-store';

import styles from './pages.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const openCreate = useUiStore((state) => state.openCreateTask);
  const user = useCurrentUser();
  const tasks = useTasks('all');
  if (user.isLoading || tasks.isLoading) return <HomeSkeleton />;
  if (user.isError || tasks.isError)
    return (
      <ErrorState
        description="We could not load your verified profile and tasks."
        onRetry={() => {
          void user.refetch();
          void tasks.refetch();
        }}
      />
    );
  const items = tasks.data?.items ?? [];
  const completed = items.filter((task) => task.is_completed).length;
  const open = items.length - completed;
  const name = user.data?.first_name ?? 'Builder';

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Overview</p>
          <h1>Good to see you, {name}</h1>
          <p>Your production patterns are ready to explore.</p>
        </div>
      </div>
      <Card className={styles.hero}>
        <div>
          <h2>A practical Mini App foundation, already connected.</h2>
          <p>Inspect auth, adaptive UI, typed data flows, and deployment-ready boundaries.</p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <strong>{items.length}</strong>
            <span>Total tasks</span>
          </div>
          <div className={styles.heroStat}>
            <strong>{open}</strong>
            <span>Open</span>
          </div>
          <div className={styles.heroStat}>
            <strong>{completed}</strong>
            <span>Done</span>
          </div>
        </div>
      </Card>
      <div className={styles.sectionHeader}>
        <h2>Quick actions</h2>
        <Link to="/about">About starter</Link>
      </div>
      <div className={styles.quickGrid}>
        <Card
          className={styles.quick}
          role="button"
          tabIndex={0}
          onClick={openCreate}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') openCreate();
          }}
        >
          <Icon name="plus" />
          <div>
            <strong>Add a task</strong>
            <span>Bottom sheet + validated form</span>
          </div>
        </Card>
        <Card
          className={styles.quick}
          role="button"
          tabIndex={0}
          onClick={() => void navigate(import.meta.env.DEV ? '/dev/telegram-preview' : '/settings')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              void navigate(import.meta.env.DEV ? '/dev/telegram-preview' : '/settings');
            }
          }}
        >
          <Icon name="spark" />
          <div>
            <strong>Preview runtime</strong>
            <span>Theme and safe-area controls</span>
          </div>
        </Card>
      </div>
      <div className={styles.sectionHeader}>
        <h2>What this demonstrates</h2>
      </div>
      <Card>
        <div className={styles.stack}>
          <Feature
            icon="shield"
            title="Server-validated identity"
            text="The API trusts raw init data only after signature and age checks."
          />
          <Feature
            icon="activity"
            title="Resilient data state"
            text="TanStack Query owns server state, retries, and safe optimistic updates."
          />
          <Feature
            icon="settings"
            title="Telegram-aware layout"
            text="Theme, viewport, BackButton, and safe-area behavior live behind one adapter."
          />
        </div>
      </Card>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: 'shield' | 'activity' | 'settings';
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <span className={styles.eventIcon}>
        <Icon name={icon} />
      </span>
      <div>
        <strong>{title}</strong>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '.8rem', marginTop: 3 }}>
          {text}
        </div>
      </div>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className={styles.page} aria-label="Loading home">
      <div className={styles.intro}>
        <div>
          <Skeleton width="90px" height={12} />
          <div style={{ height: 8 }} />
          <Skeleton width="250px" height={34} />
        </div>
      </div>
      <Card className={styles.hero}>
        <Skeleton width="70%" height={28} />
        <Skeleton width="100%" height={80} />
      </Card>
      <div className={styles.quickGrid}>
        <Card>
          <Skeleton height={92} />
        </Card>
        <Card>
          <Skeleton height={92} />
        </Card>
      </div>
    </div>
  );
}
