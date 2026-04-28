"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/constants/routes";

type GoogleIconProps = { className?: string };

function GoogleIcon({ className }: GoogleIconProps) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="60"
        strokeDashoffset="20"
        strokeLinecap="round"
      />
    </svg>
  );
}

type LoginButtonProps = {
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
  onError: (message: string | null) => void;
};

export function LoginButton({
  isLoading,
  onLoadingChange,
  onError,
}: LoginButtonProps) {
  const t = useTranslations("auth");

  const handleClick = async () => {
    onError(null);
    onLoadingChange(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${ROUTES.AUTH_CALLBACK}`,
        },
      });

      if (error) {
        onLoadingChange(false);
        onError(t("error"));
      }
      // On success the browser navigates away — no reset needed
    } catch {
      onLoadingChange(false);
      onError(t("error"));
    }
  };

  return (
    <button
      type="button"
      aria-label={t("loginButton")}
      aria-busy={isLoading}
      disabled={isLoading}
      onClick={handleClick}
      className={`
        flex items-center gap-2
        w-[305px] h-[60px]
        px-[var(--spacing-btn-px)] py-[var(--spacing-btn-py)]
        rounded-[var(--radius-btn-google)]
        font-[family-name:var(--font-montserrat)] font-bold text-[22px] leading-7
        text-[var(--color-btn-google-text)]
        bg-[var(--color-btn-google-bg)]
        hover:bg-[var(--color-btn-google-hover)]
        active:scale-[0.98]
        focus:outline-2 focus:outline-[var(--color-btn-google-bg)] focus:outline-offset-2
        disabled:bg-[var(--color-btn-google-disabled)] disabled:cursor-not-allowed
        transition-colors duration-150 ease-in-out
        motion-reduce:transition-none motion-reduce:transform-none
        cursor-pointer
        sm:w-full sm:text-[18px]
      `}
    >
      <span className="flex-1 text-center leading-7">
        {isLoading ? t("signingIn") : t("loginButton")}
      </span>
      {isLoading ? (
        <Spinner />
      ) : (
        <GoogleIcon className="shrink-0" />
      )}
    </button>
  );
}
