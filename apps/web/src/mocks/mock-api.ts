import type { ApiClient } from '@/lib/api/client';
import { ApiClientError } from '@/lib/api/client';
import type {
  AuthenticatedUser,
  Task,
  TaskCreateInput,
  TaskFilter,
  TaskList,
  TaskUpdateInput,
} from '@/lib/api/contracts';

const BASE_DATE = '2026-08-02T09:00:00.000Z';
const SYNTHETIC_USER: AuthenticatedUser = {
  id: '10000000-0000-4000-8000-000000000001',
  telegram_user_id: 9_000_000_001,
  username: 'browser_mock',
  first_name: 'Avery',
  last_name: 'Starter',
  language_code: 'en',
  is_premium: false,
  photo_url: null,
  verified: true,
  authentication_mode: 'browser_mock',
};

const SEEDED_TASKS: Task[] = [
  {
    id: '20000000-0000-4000-8000-000000000001',
    text: 'Review the Telegram theme adapter',
    is_completed: true,
    created_at: BASE_DATE,
    updated_at: '2026-08-02T10:15:00.000Z',
    completed_at: '2026-08-02T10:15:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000002',
    text: 'Run the production readiness checklist',
    is_completed: false,
    created_at: '2026-08-02T11:00:00.000Z',
    updated_at: '2026-08-02T11:00:00.000Z',
    completed_at: null,
  },
  {
    id: '20000000-0000-4000-8000-000000000003',
    text: 'Customize Starter Space for your product',
    is_completed: false,
    created_at: '2026-08-02T12:00:00.000Z',
    updated_at: '2026-08-02T12:00:00.000Z',
    completed_at: null,
  },
];

let tasks = structuredClone(SEEDED_TASKS);
let shouldFail = false;
let shouldAppearOffline = false;
let latencyMs = 120;

async function simulateNetwork(): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, latencyMs));
  if (shouldAppearOffline)
    throw new ApiClientError('Mock device is offline.', 'network_error', 0, null);
  if (shouldFail)
    throw new ApiClientError(
      'The mock API is intentionally failing.',
      'mock_failure',
      503,
      'mock-request',
    );
}

export function configureMockApi(options: {
  fail?: boolean;
  offline?: boolean;
  empty?: boolean;
  latencyMs?: number;
}): void {
  if (options.fail !== undefined) shouldFail = options.fail;
  if (options.offline !== undefined) shouldAppearOffline = options.offline;
  if (options.empty !== undefined) tasks = options.empty ? [] : structuredClone(SEEDED_TASKS);
  if (options.latencyMs !== undefined) latencyMs = options.latencyMs;
}

export function resetMockApi(): void {
  tasks = structuredClone(SEEDED_TASKS);
  shouldFail = false;
  shouldAppearOffline = false;
  latencyMs = 120;
}

export const mockApiClient: ApiClient = {
  async getMe(): Promise<AuthenticatedUser> {
    await simulateNetwork();
    return SYNTHETIC_USER;
  },
  async listTasks(filter: TaskFilter): Promise<TaskList> {
    await simulateNetwork();
    const items = tasks.filter(
      (task) => filter === 'all' || (filter === 'done') === task.is_completed,
    );
    return { items: structuredClone(items), total: items.length };
  },
  async createTask(input: TaskCreateInput): Promise<Task> {
    await simulateNetwork();
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      text: input.text.trim(),
      is_completed: false,
      created_at: now,
      updated_at: now,
      completed_at: null,
    };
    tasks = [task, ...tasks];
    return structuredClone(task);
  },
  async updateTask(taskId: string, input: TaskUpdateInput): Promise<Task> {
    await simulateNetwork();
    const task = tasks.find((item) => item.id === taskId);
    if (!task) throw new ApiClientError('Task not found.', 'task_not_found', 404, 'mock-request');
    if (input.text !== undefined) task.text = input.text.trim();
    if (input.is_completed !== undefined) {
      task.is_completed = input.is_completed;
      task.completed_at = input.is_completed ? new Date().toISOString() : null;
    }
    task.updated_at = new Date().toISOString();
    return structuredClone(task);
  },
  async deleteTask(taskId: string): Promise<void> {
    await simulateNetwork();
    if (!tasks.some((task) => task.id === taskId)) {
      throw new ApiClientError('Task not found.', 'task_not_found', 404, 'mock-request');
    }
    tasks = tasks.filter((task) => task.id !== taskId);
  },
};
