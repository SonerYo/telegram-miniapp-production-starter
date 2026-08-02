import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const create = vi.fn();
const update = vi.fn();
const haptic = vi.fn();

vi.mock('./queries', () => ({
  useCreateTask: () => ({ mutateAsync: create, isError: false, isPending: false }),
  useUpdateTask: () => ({ mutateAsync: update, isError: false, isPending: false }),
}));
vi.mock('@/lib/telegram/TelegramProvider', () => ({ useTelegramRuntime: () => ({ haptic }) }));

import { TaskForm } from './TaskForm';

beforeEach(() => {
  create.mockReset().mockResolvedValue({});
  update.mockReset().mockResolvedValue({});
  haptic.mockReset();
});

describe('TaskForm', () => {
  it('shows inline validation and prevents an empty submit', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Write a short task first.');
    expect(create).not.toHaveBeenCalled();
  });

  it('submits trimmed task text once', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);
    await user.type(screen.getByLabelText('Task'), '  Verify the build  ');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(create).toHaveBeenCalledOnce();
    expect(create).toHaveBeenCalledWith({ text: 'Verify the build' });
    expect(haptic).toHaveBeenCalledWith('success');
  });
});
