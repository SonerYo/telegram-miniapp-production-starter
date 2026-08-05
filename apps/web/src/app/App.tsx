import { RouterProvider } from 'react-router';

import { AppErrorBoundary } from './error-boundary';
import { AppProviders } from './providers';
import { router } from './router';

export function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </AppErrorBoundary>
  );
}
