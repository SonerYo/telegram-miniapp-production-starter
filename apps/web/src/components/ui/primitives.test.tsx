import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BottomSheet, EmptyState, ErrorState, SegmentedControl } from './primitives';

describe('UI feedback and modal primitives', () => {
  it('opens a labelled bottom sheet, moves focus, and closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open title="Add a task" onClose={onClose}>
        <textarea aria-label="Task text" data-autofocus />
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog', { name: 'Add a task' })).toBeInTheDocument();
    await vi.waitFor(() => expect(screen.getByLabelText('Task text')).toHaveFocus());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('exposes selected tab state and changes it with the keyboard-accessible button', async () => {
    const change = vi.fn();
    const user = userEvent.setup();
    render(
      <SegmentedControl
        label="Filter"
        value="all"
        options={[
          { value: 'all', label: 'All' },
          { value: 'done', label: 'Done' },
        ]}
        onChange={change}
      />,
    );
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: 'Done' }));
    expect(change).toHaveBeenCalledWith('done');
  });

  it('renders meaningful empty and retry states', async () => {
    const retry = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<EmptyState title="No tasks" description="Add the first task." />);
    expect(screen.getByRole('heading', { name: 'No tasks' })).toBeVisible();
    rerender(<ErrorState description="API unavailable" onRetry={retry} />);
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
