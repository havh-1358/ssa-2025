"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { KeyVisual } from "@/components/background/KeyVisual";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { LoginButton } from "@/components/auth/LoginButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

type LoginClientProps = {
  errorParam: string | null;
};

export function LoginClient({ errorParam }: LoginClientProps) {
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorParam);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] flex flex-col"
    >
      {/* Screen-reader loading announcement */}
      <div aria-live="polite" className="sr-only">
        {isLoading ? t("signingIn") : ""}
      </div>

      <KeyVisual />

      {/* Header — z-[1] to float above background and gradients */}
      <div className="relative z-[1] shrink-0">
        <Header />
      </div>

      {/* Main content */}
      <main
        className="relative flex-1 flex flex-col
          px-[var(--spacing-content-px)] pt-[var(--spacing-content-pt)] pb-[var(--spacing-content-pb)]
          sm:px-6 sm:pt-20 sm:pb-8"
      >
        <div className="flex flex-col gap-[var(--spacing-sections-gap)] sm:gap-10">
          {/* [B.1] SAA 2025 brand logo */}
          <Image
            src="/assets/auth/logos/saa-2025-logo.png"
            alt="SAA 2025"
            width={451}
            height={200}
            className="object-contain sm:w-[240px] sm:h-[106px]"
            priority
          />

          {/* [Frame 550] Tagline + Login Button + Error */}
          <div
            className="flex flex-col gap-[var(--spacing-content-gap)]
              pl-[var(--spacing-content-left-pad)] sm:pl-0"
          >
            <p
              className="w-[480px] font-[family-name:var(--font-montserrat)] font-bold
                text-[20px] leading-[40px] tracking-[0.5px] text-[var(--color-text-primary)]
                whitespace-pre-line
                sm:w-full sm:text-[16px] sm:leading-7"
            >
              {t("tagline")}
            </p>

            <LoginButton
              isLoading={isLoading}
              onLoadingChange={setIsLoading}
              onError={setError}
            />

            {error !== null && <ErrorMessage message={t("error")} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative shrink-0">
        <Footer />
      </div>
    </div>
  );
}
