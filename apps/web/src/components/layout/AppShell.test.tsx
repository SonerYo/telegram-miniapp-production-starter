import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { NavItem } from './AppShell';

describe('Bottom navigation', () => {
  it('marks the current destination independently of color', () => {
    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <NavItem to="/tasks" label="Tasks" icon="tasks" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Tasks').closest('[data-active]')).toHaveAttribute(
      'data-active',
      'true',
    );
  });
});
