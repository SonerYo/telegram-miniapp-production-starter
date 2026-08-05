import { useLayoutEffect, useMemo } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';

import { Icon, type IconName } from '@/components/ui/Icon';
import {
  Badge,
  BottomSheet,
  Button,
  Dialog,
  OfflineBanner,
  Toast,
} from '@/components/ui/primitives';
import { useTasks, useDeleteTask } from '@/features/tasks/queries';
import { TaskForm } from '@/features/tasks/TaskForm';
import { useTelegramRuntime, useTelegramSnapshot } from '@/lib/telegram/TelegramProvider';
import { useUiStore } from '@/app/ui-store';

import styles from './AppShell.module.css';

const navItems: readonly { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/tasks', label: 'Tasks', icon: 'tasks' },
  { to: '/activity', label: 'Activity', icon: 'activity' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
];

export function AppShell() {
  const runtime = useTelegramRuntime();
  const snapshot = useTelegramSnapshot();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useTasks('all');
  const taskSheet = useUiStore((state) => state.taskSheet);
  const deleteTaskId = useUiStore((state) => state.deleteDialogTaskId);
  const toast = useUiStore((state) => state.toast);
  const openCreate = useUiStore((state) => state.openCreateTask);
  const closeSheet = useUiStore((state) => state.closeTaskSheet);
  const confirmDelete = useUiStore((state) => state.confirmDelete);
  const clearToast = useUiStore((state) => state.clearToast);
  const showToast = useUiStore((state) => state.showToast);
  const deleteTask = useDeleteTask();
  const editingTask = useMemo(
    () => data?.items.find((task) => task.id === taskSheet.taskId),
    [data, taskSheet.taskId],
  );
  const deletingTask = data?.items.find((task) => task.id === deleteTaskId);
  const isNested = !['/', '/tasks', '/activity', '/profile'].includes(location.pathname);
  const needsBackButton = taskSheet.open || Boolean(deleteTaskId) || isNested;

  useLayoutEffect(() => {
    if (!needsBackButton) return;
    return runtime.showBackButton(() => {
      if (taskSheet.open) closeSheet();
      else if (deleteTaskId) confirmDelete(null);
      else void navigate(-1);
    });
  }, [closeSheet, confirmDelete, deleteTaskId, navigate, needsBackButton, runtime, taskSheet.open]);

  const remove = async () => {
    if (!deleteTaskId) return;
    try {
      await deleteTask.mutateAsync(deleteTaskId);
      confirmDelete(null);
      runtime.haptic('success');
      showToast('Task deleted', 'success');
    } catch {
      showToast('Task could not be deleted.', 'error');
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <img src="/logo-mark.svg" alt="" />
          <div className={styles.brandText}>
            <strong>Starter Space</strong>
            <span>Telegram Mini App patterns</span>
          </div>
        </div>
        <div className={styles.runtime}>
          <Badge tone={snapshot.kind === 'telegram' ? 'success' : 'accent'}>
            {snapshot.kind === 'telegram' ? (
              <>
                <Icon name="shield" />
                Telegram verified
              </>
            ) : (
              'Browser mock'
            )}
          </Badge>
        </div>
      </header>
      <main className={styles.content}>
        <OfflineBanner />
        <Outlet />
      </main>
      <div className={styles.navWrap}>
        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.slice(0, 2).map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          <button type="button" className={styles.add} aria-label="Add task" onClick={openCreate}>
            <Icon name="plus" />
          </button>
          {navItems.slice(2).map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </div>
      <BottomSheet
        open={taskSheet.open}
        title={editingTask ? 'Edit task' : 'Add a task'}
        onClose={closeSheet}
      >
        <TaskForm task={editingTask} />
      </BottomSheet>
      <Dialog
        open={Boolean(deleteTaskId)}
        title="Delete this task?"
        onClose={() => confirmDelete(null)}
        actions={
          <>
            <Button variant="secondary" onClick={() => confirmDelete(null)}>
              Keep it
            </Button>
            <Button variant="danger" disabled={deleteTask.isPending} onClick={() => void remove()}>
              {deleteTask.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </>
        }
      >
        <p>
          {deletingTask ? (
            <>“{deletingTask.text}” will be permanently removed.</>
          ) : (
            'This task will be permanently removed.'
          )}
        </p>
      </Dialog>
      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={clearToast} /> : null}
    </div>
  );
}

export function NavItem({ to, label, icon }: { to: string; label: string; icon: IconName }) {
  return (
    <NavLink to={to} end={to === '/'} className={styles.navItem ?? ''}>
      {({ isActive }) => (
        <span className={styles.navItem ?? ''} data-active={isActive}>
          <Icon name={icon} />
          <span>{label}</span>
        </span>
      )}
    </NavLink>
  );
}
