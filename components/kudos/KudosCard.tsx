"use client";

import { useState } from "react";
import type { Kudos } from "@/types/kudos";
import { KudosMessage } from "./KudosMessage";
import { HashtagList } from "./HashtagList";
import { ImageGallery } from "./ImageGallery";
import { LikeButton } from "./LikeButton";
import { CopyLinkButton } from "./CopyLinkButton";

const ANONYMOUS_SENDER = {
  senderName: "Ẩn danh",
  senderAvatar: null,
} as const;

type KudosCardProps = {
  kudos: Kudos;
  currentUserId?: string | null;
  onHashtagClick: (tag: string) => void;
  activeHashtag?: string | null;
};

export function KudosCard({
  kudos,
  currentUserId,
  onHashtagClick,
  activeHashtag,
}: KudosCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Immutable anonymous display — never mutate prop
  const displaySender = kudos.isAnonymous
    ? ANONYMOUS_SENDER
    : { senderName: kudos.senderName ?? "Unknown", senderAvatar: kudos.senderAvatar };

  const isOwnKudos = !!(currentUserId && kudos.senderId === currentUserId);

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(kudos.createdAt));

  return (
    <article
      id={`kudos-${kudos.id}`}
      className="rounded-[var(--radius-kudos-card)]
        bg-[var(--color-kudos-card-bg)]
        p-6 flex flex-col gap-4"
    >
      {/* Header: sender → recipient */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center
              bg-[var(--color-accent-gold)] text-[var(--color-bg-base)] font-bold text-[14px]"
            aria-hidden="true"
          >
            {displaySender.senderName?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p
              className="font-[family-name:var(--font-montserrat)] font-bold
                text-[16px] leading-6 text-[var(--color-kudos-text)] truncate"
            >
              {displaySender.senderName}
            </p>
          </div>
        </div>

        <span
          className="font-[family-name:var(--font-montserrat)] text-[14px] leading-5
            text-[var(--color-kudos-text)] opacity-50 shrink-0"
          aria-hidden="true"
        >
          →
        </span>

        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0 text-right">
            <p
              className="font-[family-name:var(--font-montserrat)] font-bold
                text-[16px] leading-6 text-[var(--color-kudos-text)] truncate"
            >
              {kudos.recipientName ?? "Unknown"}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center
              bg-[var(--color-divider)] text-[var(--color-text-primary)] font-bold text-[14px]"
            aria-hidden="true"
          >
            {kudos.recipientName?.charAt(0).toUpperCase() ?? "?"}
          </div>
        </div>
      </div>

      {/* Kudos title */}
      {kudos.title && (
        <p
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[16px] leading-6 text-[var(--color-kudos-text)]"
        >
          {kudos.title}
        </p>
      )}

      {/* Message with line-clamp + expand toggle */}
      <div
        className={[
          "rounded-lg p-4 bg-[var(--color-kudos-msg-bg)]",
          !expanded ? "line-clamp-3" : "",
        ].join(" ")}
      >
        <KudosMessage message={kudos.message} />
      </div>

      {kudos.message.length > 200 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="self-start font-[family-name:var(--font-montserrat)] font-bold
            text-[14px] leading-5 text-[var(--color-kudos-text)] opacity-70
            hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--color-hashtag)]"
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}

      {/* Image gallery */}
      <ImageGallery imageUrls={kudos.imageUrls} />

      {/* Hashtags */}
      <HashtagList
        hashtags={kudos.hashtags}
        activeHashtag={activeHashtag}
        onHashtagClick={onHashtagClick}
      />

      {/* Footer: timestamp + actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-kudos-text)]/10">
        <span
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[16px] leading-6 text-[var(--color-timestamp)]"
        >
          {formattedDate}
        </span>
        <div className="flex items-center gap-1">
          <LikeButton
            kudosId={kudos.id}
            initialHeartCount={kudos.heartCount}
            isOwnKudos={isOwnKudos}
          />
          <CopyLinkButton kudosId={kudos.id} />
        </div>
      </div>
    </article>
  );
}
