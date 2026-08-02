import { useState } from 'react';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  SegmentedControl,
  Skeleton,
} from '@/components/ui/primitives';
import { TaskItem } from '@/features/tasks/TaskItem';
import { useTasks } from '@/features/tasks/queries';
import type { TaskFilter } from '@/lib/api/contracts';
import { useUiStore } from '@/app/ui-store';

import styles from './pages.module.css';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'done', label: 'Done' },
] as const;

export function TasksPage() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const openCreate = useUiStore((state) => state.openCreateTask);
  const tasks = useTasks(filter);
  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Demo data</p>
          <h1>Tasks</h1>
          <p>Owner-scoped CRUD with optimistic state.</p>
        </div>
      </div>
      <SegmentedControl label="Task filter" value={filter} options={filters} onChange={setFilter} />
      {tasks.isLoading ? (
        <Card>
          <Skeleton height={76} />
          <div style={{ height: 1, background: 'var(--color-border)' }} />
          <Skeleton height={76} />
          <div style={{ height: 1, background: 'var(--color-border)' }} />
          <Skeleton height={76} />
        </Card>
      ) : null}
      {tasks.isError ? (
        <Card>
          <ErrorState
            description="The task API is unavailable. Existing cached data was not discarded."
            onRetry={() => void tasks.refetch()}
          />
        </Card>
      ) : null}
      {tasks.data && tasks.data.items.length === 0 ? (
        <Card>
          <EmptyState
            title={filter === 'all' ? 'A clear starting point' : `No ${filter} tasks`}
            description={
              filter === 'all'
                ? 'Add a task to exercise the complete frontend and API flow.'
                : 'Change the filter or update a task to see it here.'
            }
            action={
              filter === 'all' ? <Button onClick={openCreate}>Add first task</Button> : undefined
            }
            icon="tasks"
          />
        </Card>
      ) : null}
      {tasks.data && tasks.data.items.length > 0 ? (
        <Card className={styles.listCard}>
          {tasks.data.items.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </Card>
      ) : null}
    </div>
  );
}
