import { Component } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';

import { Button, ErrorState } from '@/components/ui/primitives';

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(): void {
    // A downstream app can report this boundary through its chosen observability provider.
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 16 }}>
        <ErrorState
          title="Starter Space stopped unexpectedly"
          description="The top-level error boundary prevented a blank screen."
        />
        <Button onClick={() => window.location.reload()}>Reload app</Button>
      </main>
    );
  }
}
