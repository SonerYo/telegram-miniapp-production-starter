import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/primitives';
import type { Task } from '@/lib/api/contracts';
import { useTelegramRuntime } from '@/lib/telegram/TelegramProvider';
import { useUiStore } from '@/app/ui-store';

import { useUpdateTask } from './queries';
import styles from './tasks.module.css';

export function TaskItem({ task }: { task: Task }) {
  const runtime = useTelegramRuntime();
  const openEdit = useUiStore((state) => state.openEditTask);
  const confirmDelete = useUiStore((state) => state.confirmDelete);
  const update = useUpdateTask();

  const toggle = () => {
    runtime.haptic('selection');
    update.mutate({ taskId: task.id, input: { is_completed: !task.is_completed } });
  };

  return (
    <article className={styles.task} data-completed={task.is_completed}>
      <button
        type="button"
        className={styles.taskCheck}
        aria-label={task.is_completed ? `Mark ${task.text} open` : `Complete ${task.text}`}
        aria-pressed={task.is_completed}
        onClick={toggle}
      >
        {task.is_completed ? <Icon name="check" /> : null}
      </button>
      <div className={styles.taskBody}>
        <p>{task.text}</p>
        <span>
          {task.is_completed ? 'Completed' : 'Open'} ·{' '}
          {new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(
            new Date(task.updated_at),
          )}
        </span>
      </div>
      <div className={styles.taskActions}>
        <IconButton label={`Edit ${task.text}`} icon="edit" onClick={() => openEdit(task.id)} />
        <IconButton
          label={`Delete ${task.text}`}
          icon="trash"
          onClick={() => confirmDelete(task.id)}
        />
      </div>
    </article>
  );
}
