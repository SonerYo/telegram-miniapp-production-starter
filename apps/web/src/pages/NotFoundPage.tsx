import { useNavigate } from 'react-router';

import { Button, Card, EmptyState } from '@/components/ui/primitives';

import styles from './pages.module.css';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <Card>
        <EmptyState
          title="This route is not in the starter"
          description="The requested screen does not exist or is disabled in this build."
          icon="info"
          action={<Button onClick={() => void navigate('/')}>Back home</Button>}
        />
      </Card>
    </div>
  );
}
