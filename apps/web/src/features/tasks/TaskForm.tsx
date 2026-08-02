import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, InlineAlert, Textarea } from '@/components/ui/primitives';
import type { Task } from '@/lib/api/contracts';
import { useTelegramRuntime } from '@/lib/telegram/TelegramProvider';
import { useUiStore } from '@/app/ui-store';

import { useCreateTask, useUpdateTask } from './queries';

const taskFormSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Write a short task first.')
    .max(500, 'Keep tasks under 500 characters.'),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export function TaskForm({ task }: { task?: Task | undefined }) {
  const runtime = useTelegramRuntime();
  const close = useUiStore((state) => state.closeTaskSheet);
  const showToast = useUiStore((state) => state.showToast);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const mutation = task ? updateTask : createTask;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { text: task?.text ?? '' },
  });

  useEffect(() => reset({ text: task?.text ?? '' }), [task, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (task) await updateTask.mutateAsync({ taskId: task.id, input: { text: values.text } });
      else await createTask.mutateAsync({ text: values.text });
      runtime.haptic('success');
      close();
      showToast(task ? 'Task updated' : 'Task added', 'success');
    } catch {
      runtime.haptic('error');
      showToast('The task could not be saved. Try again.', 'error');
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <Textarea
        data-autofocus
        label="Task"
        placeholder="What should happen next?"
        maxLength={500}
        error={errors.text?.message}
        hint="Plain text only · 500 characters maximum"
        {...register('text')}
      />
      {mutation.isError ? (
        <InlineAlert icon="info">
          The API rejected the change. Your existing task data is still safe.
        </InlineAlert>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 8, marginTop: 16 }}>
        <Button type="button" variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? 'Saving…' : task ? 'Save changes' : 'Add task'}
        </Button>
      </div>
    </form>
  );
}
