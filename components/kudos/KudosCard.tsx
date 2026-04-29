"use client";

import { useState } from "react";
import type { Kudos } from "@/types/kudos";
import { KudosMessage } from "./KudosMessage";
import { HashtagList } from "./HashtagList";
import { ImageGallery } from "./ImageGallery";
import { LikeButton } from "./LikeButton";
import { CopyLinkButton } from "./CopyLinkButton";

const ANONYMOUS_NAME = "Ẩn danh";

type KudosCardProps = {
  kudos: Kudos;
  currentUserId?: string | null;
  onHashtagClick: (tag: string) => void;
  activeHashtag?: string | null;
  variant?: "feed" | "highlight";
};

function UserAvatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt=""
        className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-white"
      />
    );
  }
  return (
    <div
      className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center
        bg-[var(--color-accent-gold)] text-[var(--color-bg-base)] font-bold text-[20px]"
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function SendArrowIcon() {
  return (
    <svg
      width="26"
      height="22"
      viewBox="0 0 26 22"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M0 21.3333V0L25.3333 10.6667M2.66667 17.3333L18.4667 10.6667L2.66667 4V8.66667L10.6667 10.6667L2.66667 12.6667M2.66667 17.3333V4V12.6667V17.3333Z"
        fill="#00101A"
      />
    </svg>
  );
}

function GoldDivider() {
  return (
    <hr className="border-none h-px w-full bg-[var(--color-accent-gold)]" />
  );
}

export function KudosCard({
  kudos,
  currentUserId,
  onHashtagClick,
  activeHashtag,
  variant = "feed",
}: KudosCardProps) {
  const [expanded, setExpanded] = useState(false);

  const senderName = kudos.isAnonymous
    ? ANONYMOUS_NAME
    : (kudos.senderName ?? "Unknown");
  const senderAvatar = kudos.isAnonymous ? null : kudos.senderAvatar;

  const isOwnKudos = !!(currentUserId && kudos.senderId === currentUserId);

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(kudos.createdAt));

  const isLong = kudos.message.length > 180;

  const isHighlight = variant === "highlight";
  const innerWidth = isHighlight ? "480px" : "600px";

  return (
    <article
      id={`kudos-${kudos.id}`}
      className="bg-[var(--color-kudos-card-bg)] flex flex-col items-start"
      style={{
        width: isHighlight ? "528px" : "680px",
        height: isHighlight ? "525px" : undefined,
        borderRadius: isHighlight ? "16px" : "var(--radius-kudos-card)",
        border: isHighlight ? "4px solid #FFEA9E" : "none",
        padding: isHighlight ? "24px 24px 16px" : "40px 40px 16px 40px",
        gap: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Section 1 — Sender → Recipient row */}
      <div className="flex flex-row items-center justify-center gap-6" style={{ width: innerWidth }}>
        {/* Sender */}
        <div className="flex flex-col items-center gap-[8px]">
          <UserAvatar name={senderName} avatar={senderAvatar} />
          <div className="flex flex-col items-center gap-0.5">
            <p
              className="font-[family-name:var(--font-montserrat)] font-bold
                text-[var(--color-kudos-text)] text-center truncate"
              style={{ fontSize: isHighlight ? "16px" : "22px", lineHeight: isHighlight ? "24px" : "28px", maxWidth: isHighlight ? "120px" : "180px" }}
            >
              {senderName}
            </p>
            {kudos.senderDepartment && (
              <p className="font-[family-name:var(--font-montserrat)] text-[13px] leading-5 text-[var(--color-kudos-text)] opacity-60 text-center truncate"
                style={{ maxWidth: isHighlight ? "120px" : "180px" }}>
                {kudos.senderDepartment}
              </p>
            )}
          </div>
        </div>

        <SendArrowIcon />

        {/* Recipient */}
        <div className="flex flex-col items-center gap-[8px]">
          <UserAvatar
            name={kudos.recipientName ?? "?"}
            avatar={kudos.recipientAvatar}
          />
          <div className="flex flex-col items-center gap-0.5">
            <p
              className="font-[family-name:var(--font-montserrat)] font-bold
                text-[var(--color-kudos-text)] text-center truncate"
              style={{ fontSize: isHighlight ? "16px" : "22px", lineHeight: isHighlight ? "24px" : "28px", maxWidth: isHighlight ? "120px" : "180px" }}
            >
              {kudos.recipientName ?? "Unknown"}
            </p>
            {kudos.recipientDepartment && (
              <p className="font-[family-name:var(--font-montserrat)] text-[13px] leading-5 text-[var(--color-kudos-text)] opacity-60 text-center truncate"
                style={{ maxWidth: isHighlight ? "120px" : "180px" }}>
                {kudos.recipientDepartment}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Divider 1 */}
      <GoldDivider />

      {/* Section 2 — Content */}
      <div className="flex flex-col gap-4" style={{ width: innerWidth }}>
        {/* Timestamp */}
        <span
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[16px] leading-6 text-[var(--color-timestamp)]"
        >
          {formattedDate}
        </span>

        {/* Title */}
        {kudos.title && (
          <p
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[16px] leading-6 text-[var(--color-kudos-text)]"
          >
            {kudos.title}
          </p>
        )}

        {/* Message box */}
        <div
          className="border border-[var(--color-accent-gold)]
            bg-[var(--color-kudos-msg-bg)]
            px-6 py-4 rounded-[8px]"
        >
          <div className={!expanded ? "line-clamp-3" : ""}>
            <KudosMessage message={kudos.message} />
          </div>
        </div>

        {isLong && (
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
      </div>

      {/* Divider 2 */}
      <GoldDivider />

      {/* Section 3 — Action bar */}
      <div className="flex flex-row items-center justify-between" style={{ width: innerWidth, height: "56px" }}>
        {/* Left: Like */}
        <LikeButton
          kudosId={kudos.id}
          initialHeartCount={kudos.heartCount}
          isOwnKudos={isOwnKudos}
          likedByMeInitial={kudos.likedByMe ?? false}
        />

        {/* Center: Copy Link */}
        <CopyLinkButton kudosId={kudos.id} />

        {/* Right: Xem chi tiết — highlight only */}
        {isHighlight && (
          <a
            href={`/kudos/${kudos.id}`}
            className="flex items-center gap-1 font-[family-name:var(--font-montserrat)] font-bold
              text-[14px] leading-5 text-[var(--color-kudos-text)] hover:opacity-80 transition-opacity"
          >
            Xem chi tiết
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}
