import { useNavigate } from 'react-router';

import { Icon } from '@/components/ui/Icon';
import { Avatar, Badge, Card, ErrorState, ListRow, Skeleton } from '@/components/ui/primitives';
import { useCurrentUser } from '@/features/auth/queries';
import { useTelegramSnapshot } from '@/lib/telegram/TelegramProvider';

import styles from './pages.module.css';

export function ProfilePage() {
  const navigate = useNavigate();
  const snapshot = useTelegramSnapshot();
  const user = useCurrentUser();
  if (user.isLoading)
    return (
      <div className={styles.page}>
        <Card>
          <Skeleton height={220} />
        </Card>
      </div>
    );
  if (user.isError || !user.data)
    return (
      <div className={styles.page}>
        <ErrorState
          description="Your identity could not be verified by the API."
          onRetry={() => void user.refetch()}
        />
      </div>
    );
  const fullName = [user.data.first_name, user.data.last_name].filter(Boolean).join(' ');
  return (
    <div className={styles.page}>
      <Card className={styles.profileHero}>
        <Avatar name={fullName} src={user.data.photo_url} size={78} />
        <h1>{fullName}</h1>
        <p>{user.data.username ? `@${user.data.username}` : 'No public username'}</p>
        <Badge tone="success">
          <Icon name="shield" />
          Verified by backend
        </Badge>
      </Card>
      <div className={styles.settingsSection}>
        <h2>Starter</h2>
        <Card className={styles.listCard}>
          <ListRow
            title="Runtime"
            subtitle={
              snapshot.kind === 'telegram'
                ? 'Official Telegram WebApp bridge'
                : 'Explicit browser development mock'
            }
            leading={
              <span className={styles.eventIcon}>
                <Icon name="spark" />
              </span>
            }
          />
          <ListRow
            title="Settings"
            subtitle="Theme, haptics, and closing behavior"
            leading={
              <span className={styles.eventIcon}>
                <Icon name="settings" />
              </span>
            }
            trailing={<Icon name="chevron" />}
            onClick={() => void navigate('/settings')}
          />
          <ListRow
            title="About"
            subtitle="Architecture, version, and license"
            leading={
              <span className={styles.eventIcon}>
                <Icon name="info" />
              </span>
            }
            trailing={<Icon name="chevron" />}
            onClick={() => void navigate('/about')}
          />
        </Card>
      </div>
      {import.meta.env.DEV ? (
        <Card>
          <ListRow
            title="Developer identity details"
            subtitle={`Synthetic Telegram ID: ${String(user.data.telegram_user_id)}`}
            leading={
              <span className={styles.eventIcon}>
                <Icon name="shield" />
              </span>
            }
          />
        </Card>
      ) : null}
    </div>
  );
}
