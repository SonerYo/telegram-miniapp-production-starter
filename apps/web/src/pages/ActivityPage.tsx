import { Icon } from '@/components/ui/Icon';
import { Card, EmptyState, ErrorState, ListRow, Skeleton } from '@/components/ui/primitives';
import { useTasks } from '@/features/tasks/queries';

import styles from './pages.module.css';

export function ActivityPage() {
  const tasks = useTasks('all');
  if (tasks.isLoading)
    return (
      <div className={styles.page}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>Timeline</p>
            <h1>Activity</h1>
          </div>
        </div>
        <Card>
          <Skeleton height={210} />
        </Card>
      </div>
    );
  if (tasks.isError)
    return (
      <div className={styles.page}>
        <ErrorState
          description="Activity could not be built from your task history."
          onRetry={() => void tasks.refetch()}
        />
      </div>
    );
  const items = tasks.data?.items ?? [];
  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Timeline</p>
          <h1>Activity</h1>
          <p>A deterministic view of task changes.</p>
        </div>
      </div>
      {items.length === 0 ? (
        <Card>
          <EmptyState
            title="No activity yet"
            description="Task creation and completion events will appear here."
            icon="activity"
          />
        </Card>
      ) : (
        <section className={styles.activityGroup}>
          <h2>Recent</h2>
          <Card className={styles.listCard}>
            {items.map((task) => (
              <ListRow
                key={task.id}
                leading={
                  <span className={styles.eventIcon}>
                    <Icon name={task.is_completed ? 'check' : 'plus'} />
                  </span>
                }
                title={task.is_completed ? 'Task completed' : 'Task created'}
                subtitle={
                  <>
                    {task.text} · {formatRelative(task.updated_at)}
                  </>
                }
                trailing={
                  task.is_completed ? (
                    <span
                      style={{ color: 'var(--color-success)', fontSize: '.75rem', fontWeight: 700 }}
                    >
                      Done
                    </span>
                  ) : null
                }
              />
            ))}
          </Card>
        </section>
      )}
    </div>
  );
}

function formatRelative(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}
