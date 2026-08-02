import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { Card, ErrorState } from '@/components/ui/primitives';

export function RouteError() {
  const error = useRouteError();
  const description = isRouteErrorResponse(error)
    ? `${String(error.status)} ${error.statusText}`
    : 'The route could not be rendered.';
  return (
    <div style={{ padding: '16px 0' }}>
      <Card>
        <ErrorState description={description} onRetry={() => window.location.reload()} />
      </Card>
    </div>
  );
}
