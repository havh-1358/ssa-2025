-- ==========================================
-- SSA 2025 Database Schema
-- Generated from Figma designs + spec analysis
-- Platform: Supabase (PostgreSQL)
-- Generated: 2026-04-28
-- ==========================================
-- Screens analyzed:
--   8PJQswPZmU  Countdown Prelaunch  (no DB entities)
--   GzbNeVGJHz  Login                (users profile)
--   hUyaaugye2  Language Selector    (no DB entities)
--   i87tDx10uM  Homepage SAA         (award_categories — static MVP)
--   zFYDgyj_pD  Award System         (award_categories — static MVP)
--   MaZUn5xHXZ  Sun* Kudos           (kudos, likes, hashtags, spotlight_boards, special_days)
--   ihQ26W78P2  Viet Kudos modal     (kudos POST, users search, upload)
-- ==========================================

-- ==========================================
-- EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- trigram index for name search

-- ==========================================
-- DEPARTMENTS
-- (master list; used by users for department filter on Sun* Kudos feed)
-- ==========================================
CREATE TABLE departments (
    id          BIGSERIAL   PRIMARY KEY,
    name        TEXT        NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- USERS (public profile)
-- Mirrors auth.users identity; created by application layer on first OAuth login.
-- Supabase Auth owns auth.users; this table extends it with profile data.
-- ==========================================
CREATE TABLE users (
    id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name         TEXT        NOT NULL,
    avatar_url   TEXT,
    department_id BIGINT     REFERENCES departments(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: name search (iLIKE pattern via trigram for GET /api/users/search)
CREATE INDEX idx_users_name_trgm
    ON users USING GIN (name gin_trgm_ops);

-- Index: department filtering (feed filter by department)
CREATE INDEX idx_users_department_id
    ON users(department_id);

-- ==========================================
-- KUDOS
-- Core content entity. Sender identity redacted at API layer when is_anonymous=true.
-- heart_count is a denormalized counter — updated by kudos-service.ts on like/unlike.
-- image_urls stores CDN URLs returned by POST /api/upload (Supabase Storage).
-- idempotency_key prevents duplicate submissions from double-tap / network retry.
-- ==========================================
CREATE TABLE kudos (
    id               BIGSERIAL    PRIMARY KEY,
    sender_id        UUID         NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    recipient_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title            TEXT         NOT NULL,
    message          TEXT         NOT NULL,  -- DOMPurify-sanitized HTML; stored server-side
    hashtags         TEXT[]       NOT NULL DEFAULT '{}',
    image_urls       TEXT[]       NOT NULL DEFAULT '{}',  -- up to 5 Supabase Storage CDN URLs
    heart_count      INTEGER      NOT NULL DEFAULT 0 CHECK (heart_count >= 0),
    is_anonymous     BOOLEAN      NOT NULL DEFAULT FALSE,
    idempotency_key  UUID         NOT NULL UNIQUE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

-- Index: paginated feed (most recent first); excludes soft-deleted rows
CREATE INDEX idx_kudos_feed
    ON kudos(created_at DESC, id DESC)
    WHERE deleted_at IS NULL;

-- Index: highlights — top 5 by heart_count (GET /api/kudos/highlights)
CREATE INDEX idx_kudos_highlights
    ON kudos(heart_count DESC, id DESC)
    WHERE deleted_at IS NULL;

-- Index: sender lookup (own kudos; like validation; own-kudos disable check)
CREATE INDEX idx_kudos_sender_id
    ON kudos(sender_id)
    WHERE deleted_at IS NULL;

-- Index: recipient lookup (top sunners query; filter by recipient)
CREATE INDEX idx_kudos_recipient_id
    ON kudos(recipient_id)
    WHERE deleted_at IS NULL;

-- Index: hashtag array containment filter (GET /api/kudos?hashtag=X)
-- Uses GIN for efficient @> operator: WHERE hashtags @> ARRAY['#thank-you']
CREATE INDEX idx_kudos_hashtags_gin
    ON kudos USING GIN (hashtags)
    WHERE deleted_at IS NULL;

-- ==========================================
-- LIKES
-- One record per (user, kudos) pair. hearts_given = 1 normally, 2 on special day.
-- Unique constraint enforces one-like-per-user-per-kudos at the DB level.
-- kudos.heart_count is the SUM(hearts_given) per kudos — maintained by app layer.
-- ==========================================
CREATE TABLE likes (
    id           BIGSERIAL    PRIMARY KEY,
    kudos_id     BIGINT       NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
    user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hearts_given INTEGER      NOT NULL DEFAULT 1 CHECK (hearts_given IN (1, 2)),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (kudos_id, user_id)
);

-- Index: fetch all likes for a kudos (aggregate heart count verification)
CREATE INDEX idx_likes_kudos_id
    ON likes(kudos_id);

-- Index: fetch all kudos liked by a user (like state hydration on page load)
CREATE INDEX idx_likes_user_id
    ON likes(user_id);

-- ==========================================
-- HASHTAGS
-- Master list of available hashtags shown in the Viet Kudos chip selector.
-- Also used by GET /api/kudos/hashtags.
-- usage_count is incremented by app layer on kudos submission.
-- ==========================================
CREATE TABLE hashtags (
    id           BIGSERIAL    PRIMARY KEY,
    name         TEXT         NOT NULL UNIQUE,  -- e.g. '#thank-you', '#teamwork'
    usage_count  INTEGER      NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index: ordering chips by popularity
CREATE INDEX idx_hashtags_usage_count
    ON hashtags(usage_count DESC);

-- ==========================================
-- SPECIAL DAYS
-- Admin-configured dates where heart multiplier applies (x2 hearts per like).
-- Checked by GET /api/admin/special-days; cached client-side via SpecialDayContext.
-- ==========================================
CREATE TABLE special_days (
    id          BIGSERIAL    PRIMARY KEY,
    date        DATE         NOT NULL UNIQUE,
    title       TEXT         NOT NULL,  -- human label, e.g. "Sun* Anniversary"
    multiplier  INTEGER      NOT NULL DEFAULT 2 CHECK (multiplier > 0),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index: daily lookup (check if today is a special day)
CREATE INDEX idx_special_days_date
    ON special_days(date);

-- ==========================================
-- SPOTLIGHT BOARDS
-- Admin-configured featured sections displayed on the Sun* Kudos page.
-- Each board highlights a curated set of kudos.
-- ==========================================
CREATE TABLE spotlight_boards (
    id             BIGSERIAL    PRIMARY KEY,
    title          TEXT         NOT NULL,
    description    TEXT,
    display_order  INTEGER      NOT NULL DEFAULT 0,
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index: active boards in display order
CREATE INDEX idx_spotlight_boards_active_order
    ON spotlight_boards(display_order ASC)
    WHERE is_active = TRUE;

-- ==========================================
-- SPOTLIGHT BOARD KUDOS (junction)
-- Maps spotlight boards to their featured kudos (ordered).
-- ==========================================
CREATE TABLE spotlight_board_kudos (
    id                  BIGSERIAL    PRIMARY KEY,
    spotlight_board_id  BIGINT       NOT NULL REFERENCES spotlight_boards(id) ON DELETE CASCADE,
    kudos_id            BIGINT       NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
    display_order       INTEGER      NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (spotlight_board_id, kudos_id)
);

-- Index: fetch all kudos for a board
CREATE INDEX idx_spotlight_board_kudos_board_id
    ON spotlight_board_kudos(spotlight_board_id, display_order ASC);

-- ==========================================
-- AWARD CATEGORIES
-- Included for future CMS integration.
-- MVP: seeded from data/awards.ts static JSON; API not called on client.
-- Slug values MUST match VALID_AWARD_HASHES constant in data/awards.ts.
-- ==========================================
CREATE TABLE award_categories (
    id              BIGSERIAL    PRIMARY KEY,
    slug            TEXT         NOT NULL UNIQUE,  -- 'top-talent', 'top-project', etc.
    name            TEXT         NOT NULL,
    name_en         TEXT,                          -- English translation
    description     TEXT,
    description_en  TEXT,
    prize_amount    DECIMAL(15, 0),               -- VND amount
    prize_currency  TEXT         NOT NULL DEFAULT 'VND',
    recipient_count INTEGER      NOT NULL DEFAULT 0 CHECK (recipient_count >= 0),
    display_order   INTEGER      NOT NULL DEFAULT 0,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index: listing order
CREATE INDEX idx_award_categories_order
    ON award_categories(display_order ASC)
    WHERE is_active = TRUE;

-- ==========================================
-- SEED DATA
-- ==========================================

-- Seed award categories (matches data/awards.ts + VALID_AWARD_HASHES constant)
INSERT INTO award_categories (slug, name, name_en, display_order) VALUES
    ('top-talent',          'Top Talent',           'Top Talent',           1),
    ('top-project',         'Top Project',          'Top Project',          2),
    ('top-project-leader',  'Top Project Leader',   'Top Project Leader',   3),
    ('best-manager',        'Best Manager',         'Best Manager',         4),
    ('signature-2025',      'Signature 2025',       'Signature 2025',       5),
    ('mvp',                 'MVP',                  'MVP',                  6);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables; define policies below.
-- ==========================================
ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags               ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_days           ENABLE ROW LEVEL SECURITY;
ALTER TABLE spotlight_boards       ENABLE ROW LEVEL SECURITY;
ALTER TABLE spotlight_board_kudos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_categories       ENABLE ROW LEVEL SECURITY;

-- ----- users -----
-- Any authenticated user can view profiles (for recipient search + display)
CREATE POLICY "users: authenticated read"
    ON users FOR SELECT
    USING (auth.role() = 'authenticated');

-- Users can only insert/update their own profile
CREATE POLICY "users: own row insert"
    ON users FOR INSERT
    WITH CHECK (id = auth.uid());

CREATE POLICY "users: own row update"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- ----- departments -----
-- Public read; write restricted to service_role (admin only via server)
CREATE POLICY "departments: public read"
    ON departments FOR SELECT
    USING (TRUE);

-- ----- kudos -----
-- Public read (anonymous-redaction handled at API layer, not RLS)
CREATE POLICY "kudos: public read"
    ON kudos FOR SELECT
    USING (deleted_at IS NULL);

-- Authenticated users can insert kudos where sender_id = their id
CREATE POLICY "kudos: authenticated insert"
    ON kudos FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated'
        AND sender_id = auth.uid()
    );

-- Sender can soft-delete or update their own kudos
CREATE POLICY "kudos: own row update"
    ON kudos FOR UPDATE
    USING (sender_id = auth.uid());

-- ----- likes -----
-- Authenticated users can read all likes (needed to hydrate like state)
CREATE POLICY "likes: authenticated read"
    ON likes FOR SELECT
    USING (auth.role() = 'authenticated');

-- Users can only insert likes for themselves
CREATE POLICY "likes: authenticated insert"
    ON likes FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated'
        AND user_id = auth.uid()
    );

-- Users can only delete their own likes
CREATE POLICY "likes: own row delete"
    ON likes FOR DELETE
    USING (user_id = auth.uid());

-- ----- hashtags -----
-- Authenticated read; service_role write
CREATE POLICY "hashtags: authenticated read"
    ON hashtags FOR SELECT
    USING (auth.role() = 'authenticated');

-- ----- special_days -----
-- Public read (used to determine heart multiplier)
CREATE POLICY "special_days: public read"
    ON special_days FOR SELECT
    USING (TRUE);

-- ----- spotlight_boards -----
-- Authenticated read (board list shown on Kudos page to auth users)
CREATE POLICY "spotlight_boards: authenticated read"
    ON spotlight_boards FOR SELECT
    USING (
        auth.role() = 'authenticated'
        AND is_active = TRUE
    );

-- ----- spotlight_board_kudos -----
CREATE POLICY "spotlight_board_kudos: authenticated read"
    ON spotlight_board_kudos FOR SELECT
    USING (auth.role() = 'authenticated');

-- ----- award_categories -----
CREATE POLICY "award_categories: public read"
    ON award_categories FOR SELECT
    USING (is_active = TRUE);

-- ==========================================
-- NOTES
-- ==========================================
-- 1. kudos.heart_count: denormalized counter updated by kudos-service.ts via
--    increment/decrement SQL (UPDATE kudos SET heart_count = heart_count + $1 WHERE id = $2).
--    No trigger used — application layer maintains consistency.
--
-- 2. users table: created by app in OAuth callback handler (app/auth/callback/route.ts)
--    using UPSERT (INSERT ... ON CONFLICT (id) DO UPDATE). No trigger.
--
-- 3. kudos.is_anonymous=true: sender_id is stored for admin integrity, but
--    kudos-service.ts (lib/kudos-service.ts) omits sender fields from SELECT response.
--    RLS SELECT policy does NOT redact — service layer does.
--
-- 4. Hashtag array queries: use @> operator with GIN index.
--    Example: SELECT * FROM kudos WHERE hashtags @> ARRAY['#thank-you'];
--
-- 5. Department filter: JOIN users ON kudos.recipient_id = users.id
--    WHERE users.department_id = $departmentId
--
-- 6. Top sunners query: GROUP BY recipient_id, COUNT(*) kudos received, SUM(heart_count)
--    ORDER BY kudos_received DESC LIMIT 10.
--
-- 7. award_categories: static seed data for MVP. API endpoint GET /api/awards reads
--    from data/awards.ts static import (not DB). Table ready for CMS migration.
--
-- 8. images: stored in Supabase Storage bucket 'kudos-images'.
--    Only CDN URLs stored in kudos.image_urls[]. No binary data in DB.
