"use client";

type NotificationBellProps = {
  unreadCount?: number;
};

export function NotificationBell({ unreadCount = 0 }: NotificationBellProps) {
  const hasUnread = unreadCount > 0;

  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative flex items-center justify-center
        w-10 h-10 rounded-[4px]
        text-[var(--color-text-primary)]
        hover:bg-white/10
        active:bg-white/15
        focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]
        transition-colors duration-150"
    >
      {/* MM_MEDIA_Noti — 40×40px viewBox, bell + badge rect */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M29 27V28H11V27L13 25V19C13 15.9 15.03 13.17 18 12.29C18 12.19 18 12.1 18 12C18 11.4696 18.2107 10.9609 18.5858 10.5858C18.9609 10.2107 19.4696 10 20 10C20.5304 10 21.0391 10.2107 21.4142 10.5858C21.7893 10.9609 22 11.4696 22 12C22 12.1 22 12.19 22 12.29C24.97 13.17 27 15.9 27 19V25L29 27ZM22 29C22 29.5304 21.7893 30.0391 21.4142 30.4142C21.0391 30.7893 20.5304 31 20 31C19.4696 31 18.9609 30.7893 18.5858 30.4142C18.2107 30.0391 18 29.5304 18 29"
          fill="white"
        />
        {hasUnread && (
          <rect x="23" y="9" width="8" height="8" rx="4" fill="#D4271D" />
        )}
      </svg>
      {hasUnread && (
        <span
          aria-live="polite"
          aria-label={`${unreadCount} unread notifications`}
          className="sr-only"
        />
      )}
    </button>
  );
}
