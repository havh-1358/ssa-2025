"use client";

import { useState } from "react";

type CopyLinkButtonProps = {
  kudosId: number;
};

export function CopyLinkButton({ kudosId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/kudos#${kudosId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="min-h-[44px] px-3 py-2
        font-[family-name:var(--font-montserrat)] text-[14px] leading-5
        text-[var(--color-kudos-text)] opacity-60
        hover:opacity-100 transition-opacity duration-150
        focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
      aria-label={copied ? "Link copied!" : "Copy link to this kudos"}
    >
      {copied ? "✓ Copied" : "⧉"}
    </button>
  );
}
