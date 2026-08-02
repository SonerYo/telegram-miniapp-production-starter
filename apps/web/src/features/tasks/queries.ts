import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiClient } from '@/lib/api/ApiProvider';
import type {
  Task,
  TaskCreateInput,
  TaskFilter,
  TaskList,
  TaskUpdateInput,
} from '@/lib/api/contracts';

export const taskKeys = {
  all: ['tasks'] as const,
  list: (filter: TaskFilter) => ['tasks', filter] as const,
};

export function useTasks(filter: TaskFilter = 'all') {
  const api = useApiClient();
  return useQuery({
    queryKey: taskKeys.list(filter),
    queryFn: ({ signal }) => api.listTasks(filter, signal),
  });
}

export function useCreateTask() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskCreateInput) => api.createTask(input),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useUpdateTask() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: TaskUpdateInput }) =>
      api.updateTask(taskId, input),
    onMutate: async ({ taskId, input }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const snapshots = queryClient.getQueriesData<TaskList>({ queryKey: taskKeys.all });
      queryClient.setQueriesData<TaskList>({ queryKey: taskKeys.all }, (current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.map((task) =>
            task.id === taskId ? optimisticTask(task, input) : task,
          ),
        };
      });
      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: async () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

function optimisticTask(task: Task, input: TaskUpdateInput): Task {
  const completed = input.is_completed ?? task.is_completed;
  return {
    ...task,
    ...(input.text === undefined ? {} : { text: input.text }),
    is_completed: completed,
    completed_at: completed ? (task.completed_at ?? new Date().toISOString()) : null,
    updated_at: new Date().toISOString(),
  };
}

export function useDeleteTask() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => api.deleteTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const snapshots = queryClient.getQueriesData<TaskList>({ queryKey: taskKeys.all });
      queryClient.setQueriesData<TaskList>({ queryKey: taskKeys.all }, (current) =>
        current
          ? {
              ...current,
              items: current.items.filter((task) => task.id !== taskId),
              total: Math.max(0, current.total - 1),
            }
          : current,
      );
      return { snapshots };
    },
    onError: (_error, _taskId, context) => {
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: async () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
