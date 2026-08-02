import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button, Card, InlineAlert, SegmentedControl, Switch } from '@/components/ui/primitives';
import { useTelegramRuntime } from '@/lib/telegram/TelegramProvider';
import { useUiStore } from '@/app/ui-store';

import styles from './pages.module.css';

const schema = z.object({
  theme: z.enum(['telegram', 'system', 'light', 'dark']),
  haptics: z.boolean(),
  closing: z.boolean(),
});
type Values = z.infer<typeof schema>;
const themes = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

export function SettingsPage() {
  const runtime = useTelegramRuntime();
  const store = useUiStore();
  const [mainButtonDemo, setMainButtonDemo] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      theme: store.themePreference,
      haptics: store.hapticsEnabled,
      closing: store.closingConfirmation,
    },
  });
  const closing = useWatch({ control, name: 'closing' });

  useEffect(() => {
    runtime.setClosingConfirmation(closing);
  }, [closing, runtime]);
  useEffect(() => {
    if (!mainButtonDemo) return;
    return runtime.configureMainButton({
      text: 'Save settings',
      visible: true,
      enabled: true,
      onClick: () => store.showToast('Telegram MainButton handler fired', 'success'),
    });
  }, [mainButtonDemo, runtime, store]);

  const save = handleSubmit(async (values) => {
    await Promise.resolve();
    store.setThemePreference(values.theme);
    store.setHapticsEnabled(values.haptics);
    store.setClosingConfirmation(values.closing);
    if (values.theme === 'light' || values.theme === 'dark') runtime.setMockTheme?.(values.theme);
    if (values.theme === 'system')
      runtime.setMockTheme?.(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (values.haptics) runtime.haptic('success');
    store.showToast('Local preferences saved', 'success');
  });

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Local preferences</p>
          <h1>Settings</h1>
          <p>No auth material is persisted in the browser.</p>
        </div>
      </div>
      <form onSubmit={save}>
        <div className={styles.settingsSection}>
          <h2>Appearance</h2>
          <Card>
            <Controller
              control={control}
              name="theme"
              render={({ field }) => (
                <SegmentedControl
                  label="Theme preference"
                  value={field.value}
                  options={themes}
                  onChange={field.onChange}
                />
              )}
            />
          </Card>
        </div>
        <div className={styles.settingsSection}>
          <h2>Telegram behavior</h2>
          <Card>
            <Controller
              control={control}
              name="haptics"
              render={({ field }) => (
                <Switch
                  label="Haptic feedback"
                  description="Uses Telegram HapticFeedback when available"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="closing"
              render={({ field }) => (
                <Switch
                  label="Closing confirmation"
                  description="Asks Telegram to confirm accidental closes"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Switch
              label="MainButton recipe"
              description="Mirrors a save action into Telegram MainButton"
              checked={mainButtonDemo}
              onCheckedChange={setMainButtonDemo}
            />
          </Card>
        </div>
        <InlineAlert>
          Theme overrides are previewed only by the browser mock. In Telegram, the host theme
          remains the source of truth.
        </InlineAlert>
        <div className={styles.formActions}>
          <Button full type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save preferences'}
          </Button>
        </div>
      </form>
    </div>
  );
}
