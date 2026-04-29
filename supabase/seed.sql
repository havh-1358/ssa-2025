-- =============================================================
-- SSA 2025 — Schema + Seed Data (All-in-one)
-- Chạy trong: Supabase Dashboard → SQL Editor → New Query
--
-- BƯỚC 1: Chạy phần "SCHEMA" bên dưới trước
-- BƯỚC 2: Lấy user IDs: SELECT id, email FROM auth.users;
-- BƯỚC 3: Sửa user_a / user_b và chạy phần "SEED DATA"
-- =============================================================

-- ===================== SCHEMA ================================

-- Users (public profile, mirrors auth.users)
CREATE TABLE IF NOT EXISTS users (
    id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name         TEXT        NOT NULL DEFAULT '',
    avatar_url   TEXT,
    department_id BIGINT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id          BIGSERIAL   PRIMARY KEY,
    name        TEXT        NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hashtags
CREATE TABLE IF NOT EXISTS hashtags (
    id          BIGSERIAL   PRIMARY KEY,
    name        TEXT        NOT NULL UNIQUE,
    usage_count INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Special days (2x hearts)
CREATE TABLE IF NOT EXISTS special_days (
    id          BIGSERIAL   PRIMARY KEY,
    date        DATE        NOT NULL UNIQUE,
    title       TEXT        NOT NULL DEFAULT '',
    multiplier  INTEGER     NOT NULL DEFAULT 2,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kudos
CREATE TABLE IF NOT EXISTS kudos (
    id               BIGSERIAL    PRIMARY KEY,
    sender_id        UUID         REFERENCES users(id) ON DELETE SET NULL,
    recipient_id     UUID         REFERENCES users(id) ON DELETE CASCADE,
    title            TEXT         NOT NULL DEFAULT '',
    message          TEXT         NOT NULL DEFAULT '',
    hashtags         TEXT[]       NOT NULL DEFAULT '{}',
    image_urls       TEXT[]       NOT NULL DEFAULT '{}',
    heart_count      INTEGER      NOT NULL DEFAULT 0,
    is_anonymous     BOOLEAN      NOT NULL DEFAULT FALSE,
    idempotency_key  UUID         NOT NULL DEFAULT gen_random_uuid(),
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

-- Likes
CREATE TABLE IF NOT EXISTS likes (
    kudos_id    BIGINT      NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hearts_given INTEGER    NOT NULL DEFAULT 1,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (kudos_id, user_id)
);

-- RLS: enable
ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes        ENABLE ROW LEVEL SECURITY;

-- RLS policies: read-only public for feed/stats
CREATE POLICY IF NOT EXISTS "kudos: public read"
    ON kudos FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY IF NOT EXISTS "kudos: auth insert"
    ON kudos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "likes: public read"
    ON likes FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "likes: auth insert"
    ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "likes: auth delete"
    ON likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "users: public read"
    ON users FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "users: auth upsert"
    ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "users: auth update"
    ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "departments: public read"
    ON departments FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "hashtags: public read"
    ON hashtags FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "special_days: public read"
    ON special_days FOR SELECT USING (true);

-- RPC to increment heart count
CREATE OR REPLACE FUNCTION increment_heart_count(kudos_id BIGINT, delta INTEGER)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE kudos SET heart_count = heart_count + delta WHERE id = kudos_id;
$$;

-- ===================== STATIC DATA ===========================

INSERT INTO departments (name) VALUES
  ('CEVC1'), ('CEVC2'), ('CEVC3'), ('CEVC4'), ('OPD'), ('Infra')
ON CONFLICT (name) DO NOTHING;

INSERT INTO hashtags (name, usage_count) VALUES
  ('Dedicated', 12), ('Inspiring', 9), ('Teamwork', 7),
  ('Creative', 5), ('Leadership', 4)
ON CONFLICT (name) DO NOTHING;

-- Optional: special day today for testing double-hearts
-- INSERT INTO special_days (date, title, multiplier)
-- VALUES (CURRENT_DATE, 'Test Special Day', 2)
-- ON CONFLICT (date) DO NOTHING;

-- =============================================================
-- SEED TEST DATA
-- Bước 1: Lấy user IDs thực:
--   SELECT id, email FROM auth.users;
-- Bước 2: Thay user_a và user_b bên dưới, rồi chạy
-- =============================================================

DO $$
DECLARE
  -- ⚠️ THAY 2 dòng này bằng ID thực từ: SELECT id FROM auth.users;
  user_a UUID := '00000000-0000-0000-0000-000000000001';  -- ← thay bằng ID của bạn
  user_b UUID := '00000000-0000-0000-0000-000000000002';  -- ← thay bằng ID user khác

  dept_cevc1 BIGINT;
  k1 BIGINT; k2 BIGINT; k3 BIGINT; k4 BIGINT; k5 BIGINT;
BEGIN
  SELECT id INTO dept_cevc1 FROM departments WHERE name = 'CEVC1';

  -- Tạo user profiles
  INSERT INTO users (id, name, avatar_url, department_id) VALUES
    (user_a, 'Nguyễn Văn A', NULL, dept_cevc1),
    (user_b, 'Trần Thị B',   NULL, dept_cevc1)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    department_id = EXCLUDED.department_id;

  -- Kudos 1: B → A (42 hearts, highlight)
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_b, user_a, 'Outstanding teamwork',
    'Cảm ơn bạn đã hỗ trợ mình rất nhiều trong sprint vừa rồi. Nhờ bạn mà tụi mình đã hoàn thành đúng deadline và chất lượng sản phẩm được nâng lên đáng kể. Mình rất trân trọng tinh thần nhiệt huyết và sự tận tâm của bạn!',
    ARRAY['Dedicated','Inspiring'], 42, FALSE, gen_random_uuid())
  RETURNING id INTO k1;

  -- Kudos 2: A → B (28 hearts)
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_a, user_b, 'Great leadership',
    'Bạn đã dẫn dắt team vượt qua giai đoạn khó khăn nhất của dự án một cách xuất sắc. Phong cách lãnh đạo bình tĩnh, sáng suốt và luôn lắng nghe của bạn thực sự truyền cảm hứng cho toàn team.',
    ARRAY['Inspiring','Dedicated'], 28, FALSE, gen_random_uuid())
  RETURNING id INTO k2;

  -- Kudos 3: anonymous → A (15 hearts)
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_b, user_a, 'Creative problem solving',
    'Cách bạn giải quyết vấn đề kỹ thuật hôm qua thật sự ấn tượng. Bạn đã tìm ra hướng đi mà không ai nghĩ tới và giúp team tiết kiệm được rất nhiều thời gian.',
    ARRAY['Creative'], 15, TRUE, gen_random_uuid())
  RETURNING id INTO k3;

  -- Kudos 4: A → B (67 hearts, highlight)
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_a, user_b, 'Mentor of the month',
    'Cảm ơn bạn đã dành thời gian chia sẻ kiến thức và hướng dẫn mình trong suốt tháng qua. Nhờ bạn mà mình đã hiểu sâu hơn về kiến trúc hệ thống và tự tin hơn khi xử lý các task phức tạp.',
    ARRAY['Inspiring','Dedicated'], 67, FALSE, gen_random_uuid())
  RETURNING id INTO k4;

  -- Kudos 5: B → A (33 hearts)
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_b, user_a, 'Above and beyond',
    'Bạn đã làm việc thêm giờ để đảm bảo release được đúng hạn. Sự cống hiến và trách nhiệm của bạn thực sự đáng được ghi nhận. Team rất may mắn khi có bạn đồng hành.',
    ARRAY['Dedicated'], 33, FALSE, gen_random_uuid())
  RETURNING id INTO k5;

  -- Likes
  INSERT INTO likes (kudos_id, user_id, hearts_given) VALUES
    (k1, user_a, 1), (k3, user_a, 1), (k5, user_a, 1),
    (k2, user_b, 1), (k4, user_b, 1)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Seed xong! Kudos IDs: %, %, %, %, %', k1, k2, k3, k4, k5;
END $$;
