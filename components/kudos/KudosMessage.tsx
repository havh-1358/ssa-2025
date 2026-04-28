"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";

type KudosMessageProps = {
  message: string;
};

export function KudosMessage({ message }: KudosMessageProps) {
  const sanitized = useMemo(() => {
    if (typeof window === "undefined") return message;
    return DOMPurify.sanitize(message, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }, [message]);

  return (
    <p
      className="font-[family-name:var(--font-montserrat)] font-bold
        text-[20px] leading-7 text-[var(--color-kudos-text)]"
    >
      {sanitized}
    </p>
  );
}
