import { createPortal } from 'react-dom';
import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

import { Icon, type IconName } from './Icon';
import styles from './primitives.module.css';

function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}

export function Button({
  variant = 'primary',
  full = false,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  full?: boolean;
}) {
  return (
    <button
      className={cx(styles.button, styles[variant], full && styles.full, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({
  label,
  icon,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: IconName }) {
  return (
    <button aria-label={label} className={cx(styles.iconButton, className)} {...props}>
      <Icon name={icon} />
    </button>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.card, className)} {...props} />;
}

export function Surface({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.surface, className)} {...props} />;
}

interface FieldProps {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & FieldProps
>(function Input({ label, error, hint, id: providedId, ...props }, ref) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <input
        ref={ref}
        id={id}
        className={styles.input}
        aria-label={label}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        {...props}
      />
      <span
        id={descriptionId}
        className={cx(styles.fieldHint, error && styles.fieldError)}
        role={error ? 'alert' : undefined}
      >
        {error ?? hint ?? ' '}
      </span>
    </label>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(function Textarea({ label, error, hint, id: providedId, ...props }, ref) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <textarea
        ref={ref}
        id={id}
        className={styles.textarea}
        aria-label={label}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        {...props}
      />
      <span
        id={descriptionId}
        className={cx(styles.fieldHint, error && styles.fieldError)}
        role={error ? 'alert' : undefined}
      >
        {error ?? hint ?? ' '}
      </span>
    </label>
  );
});

export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={styles.checkRow}>
      <span>{label}</span>
      <input className={styles.checkbox} type="checkbox" {...props} />
    </label>
  );
}

export function Switch({
  label,
  checked,
  onCheckedChange,
  description,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  description?: string;
}) {
  return (
    <div className={styles.switchRow}>
      <span>
        <span className={styles.listTitle}>{label}</span>
        {description ? <span className={styles.listSubtitle}>{description}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={styles.switch}
        data-checked={checked}
        onClick={() => onCheckedChange(!checked)}
      >
        <span className={styles.switchThumb} />
      </button>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.segmented} role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className={styles.segment}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export const Tabs = SegmentedControl;

export function Badge({
  tone = 'neutral',
  children,
}: PropsWithChildren<{ tone?: 'neutral' | 'accent' | 'success' | 'danger' }>) {
  return (
    <span className={styles.badge} data-tone={tone}>
      {children}
    </span>
  );
}

export function Avatar({
  name,
  src,
  size = 48,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return (
    <span
      className={styles.avatar}
      style={{ '--avatar-size': `${String(size)}px` } as React.CSSProperties}
    >
      {src ? <img src={src} alt="" /> : initials || '?'}
    </span>
  );
}

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onClick,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      {leading}
      <span className={styles.listBody}>
        <span className={styles.listTitle}>{title}</span>
        {subtitle ? <span className={styles.listSubtitle}>{subtitle}</span> : null}
      </span>
      {trailing}
    </>
  );
  return onClick ? (
    <button type="button" className={cx(styles.listRow, styles.listRowClickable)} onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={styles.listRow}>{content}</div>
  );
}

function useModalFocus(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const element = ref.current;
    const focusable = () =>
      Array.from(
        element?.querySelectorAll<HTMLElement>(
          'textarea:not([disabled]), input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    window.setTimeout(() => {
      const preferred = element?.querySelector<HTMLElement>('[data-autofocus]');
      (preferred ?? focusable()[0])?.focus();
    }, 0);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, close]);
  return ref;
}

export function BottomSheet({
  open,
  title,
  onClose,
  children,
}: PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>) {
  const ref = useModalFocus(open, onClose);
  if (!open) return null;
  return createPortal(
    <div className={styles.overlay}>
      <div
        ref={ref}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
      >
        <div className={styles.sheetHandle} />
        <header className={styles.modalHeader}>
          <h2 id="sheet-title">{title}</h2>
          <IconButton label="Close" icon="close" onClick={onClose} />
        </header>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function Dialog({
  open,
  title,
  onClose,
  children,
  actions,
}: PropsWithChildren<{ open: boolean; title: string; onClose: () => void; actions: ReactNode }>) {
  const ref = useModalFocus(open, onClose);
  if (!open) return null;
  return createPortal(
    <div className={styles.overlay}>
      <div
        ref={ref}
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h2 id="dialog-title">{title}</h2>
        <div>{children}</div>
        <div className={styles.dialogActions}>{actions}</div>
      </div>
    </div>,
    document.body,
  );
}

export function Toast({
  message,
  tone = 'neutral',
  onDismiss,
}: {
  message: string;
  tone?: 'neutral' | 'success' | 'error';
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 3200);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);
  return (
    <div className={styles.toast} data-tone={tone} role="status">
      <Icon name={tone === 'error' ? 'info' : 'check'} />
      <span>{message}</span>
    </div>
  );
}

export function InlineAlert({ children, icon = 'info' }: PropsWithChildren<{ icon?: IconName }>) {
  return (
    <div className={styles.alert} role="note">
      <Icon name={icon} />
      <span>{children}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon = 'spark',
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: IconName;
}) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>
        <Icon name={icon} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className={styles.error}>
      <span className={styles.emptyIcon}>
        <Icon name="refresh" />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          <Icon name="refresh" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function Skeleton({ width = '100%', height = 16 }: { width?: string; height?: number }) {
  return <span className={styles.skeleton} style={{ width, height }} aria-hidden="true" />;
}

export function Spinner({ label }: { label: string }) {
  return (
    <div className={styles.spinnerWrap} role="status">
      <span className={styles.spinner} />
      <span>{label}</span>
    </div>
  );
}

export function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);
  return online ? null : (
    <div className={styles.offline} role="status">
      <Icon name="wifi-off" />
      Offline — cached content may be stale
    </div>
  );
}
