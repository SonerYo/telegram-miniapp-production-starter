import { Badge, Card, InlineAlert } from '@/components/ui/primitives';

import styles from './pages.module.css';

export function AboutPage() {
  return (
    <div className={styles.page}>
      <img className={styles.aboutMark} src="/logo-mark.svg" alt="Starter Space mark" />
      <div className={styles.intro} style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <p className={styles.eyebrow}>Version 0.1.0</p>
          <h1>Starter Space</h1>
          <p>Telegram Mini App production patterns in one small product.</p>
        </div>
      </div>
      <Card className={styles.copy}>
        <p>
          <strong>Purpose.</strong> This repository packages the repetitive full-stack work that
          sits between a minimal Telegram example and an application teams can safely extend.
        </p>
        <p>
          <strong>Deliberate scope.</strong> It includes authentication, task CRUD, adaptive UI,
          testing, containers, CI, and operating guides. Payments, queues, analytics, and
          product-specific logic remain outside v0.1.0.
        </p>
        <Badge tone="accent">MIT licensed</Badge>
      </Card>
      <InlineAlert>
        This independent open-source project is not affiliated with, endorsed by, or sponsored by
        Telegram.
      </InlineAlert>
    </div>
  );
}
