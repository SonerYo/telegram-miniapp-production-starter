import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import { Spinner } from '@/components/ui/primitives';
import { AboutPage } from '@/pages/AboutPage';
import { ActivityPage } from '@/pages/ActivityPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { TasksPage } from '@/pages/TasksPage';

import { RouteError } from './route-error';

const DevPreviewPage = import.meta.env.DEV
  ? lazy(async () => {
      const module = await import('@/pages/DevPreviewPage');
      return { default: module.DevPreviewPage };
    })
  : null;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'about', element: <AboutPage /> },
      ...(DevPreviewPage
        ? [
            {
              path: 'dev/telegram-preview',
              element: (
                <Suspense fallback={<Spinner label="Loading preview controls" />}>
                  <DevPreviewPage />
                </Suspense>
              ),
            },
          ]
        : []),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
