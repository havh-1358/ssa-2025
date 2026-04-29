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
  -- ⚠️ THAY các dòng này bằng ID thực từ: SELECT id, email FROM auth.users;
  user_a UUID := '00000000-0000-0000-0000-000000000001';  -- ← CEVC1
  user_b UUID := '00000000-0000-0000-0000-000000000002';  -- ← CEVC2
  user_c UUID := '00000000-0000-0000-0000-000000000003';  -- ← OPD
  user_d UUID := '00000000-0000-0000-0000-000000000004';  -- ← Infra

  dept_cevc1 BIGINT; dept_cevc2 BIGINT; dept_opd BIGINT; dept_infra BIGINT;
  k1 BIGINT; k2 BIGINT; k3 BIGINT; k4 BIGINT; k5 BIGINT;
  k6 BIGINT; k7 BIGINT; k8 BIGINT;
BEGIN
  SELECT id INTO dept_cevc1 FROM departments WHERE name = 'CEVC1';
  SELECT id INTO dept_cevc2 FROM departments WHERE name = 'CEVC2';
  SELECT id INTO dept_opd   FROM departments WHERE name = 'OPD';
  SELECT id INTO dept_infra FROM departments WHERE name = 'Infra';

  -- Tạo user profiles với department
  INSERT INTO users (id, name, avatar_url, department_id) VALUES
    (user_a, 'Nguyễn Văn A', NULL, dept_cevc1),
    (user_b, 'Trần Thị B',   NULL, dept_cevc2),
    (user_c, 'Lê Văn C',     NULL, dept_opd),
    (user_d, 'Phạm Thị D',   NULL, dept_infra)
  ON CONFLICT (id) DO UPDATE SET
    name          = EXCLUDED.name,
    department_id = EXCLUDED.department_id;

  -- Kudos 1: B(CEVC2) → A(CEVC1) — 42 hearts, Dedicated+Inspiring
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_b, user_a, 'Outstanding teamwork',
    'Cảm ơn bạn đã hỗ trợ mình rất nhiều trong sprint vừa rồi. Nhờ bạn mà tụi mình đã hoàn thành đúng deadline và chất lượng sản phẩm được nâng lên đáng kể. Mình rất trân trọng tinh thần nhiệt huyết và sự tận tâm của bạn!',
    ARRAY['Dedicated','Inspiring'], 42, FALSE, gen_random_uuid())
  RETURNING id INTO k1;

  -- Kudos 2: A(CEVC1) → B(CEVC2) — 28 hearts, Inspiring+Dedicated
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_a, user_b, 'Great leadership',
    'Bạn đã dẫn dắt team vượt qua giai đoạn khó khăn nhất của dự án một cách xuất sắc. Phong cách lãnh đạo bình tĩnh, sáng suốt và luôn lắng nghe của bạn thực sự truyền cảm hứng cho toàn team.',
    ARRAY['Inspiring','Dedicated'], 28, FALSE, gen_random_uuid())
  RETURNING id INTO k2;

  -- Kudos 3: B(CEVC2) → A(CEVC1) — 15 hearts, ẩn danh, Creative
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_b, user_a, 'Creative problem solving',
    'Cách bạn giải quyết vấn đề kỹ thuật hôm qua thật sự ấn tượng. Bạn đã tìm ra hướng đi mà không ai nghĩ tới và giúp team tiết kiệm được rất nhiều thời gian.',
    ARRAY['Creative'], 15, TRUE, gen_random_uuid())
  RETURNING id INTO k3;

  -- Kudos 4: A(CEVC1) → B(CEVC2) — 67 hearts, Inspiring+Dedicated
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_a, user_b, 'Mentor of the month',
    'Cảm ơn bạn đã dành thời gian chia sẻ kiến thức và hướng dẫn mình trong suốt tháng qua. Nhờ bạn mà mình đã hiểu sâu hơn về kiến trúc hệ thống và tự tin hơn khi xử lý các task phức tạp.',
    ARRAY['Inspiring','Dedicated'], 67, FALSE, gen_random_uuid())
  RETURNING id INTO k4;

  -- Kudos 5: C(OPD) → A(CEVC1) — 33 hearts, Dedicated
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_c, user_a, 'Above and beyond',
    'Bạn đã làm việc thêm giờ để đảm bảo release được đúng hạn. Sự cống hiến và trách nhiệm của bạn thực sự đáng được ghi nhận. Team rất may mắn khi có bạn đồng hành.',
    ARRAY['Dedicated'], 33, FALSE, gen_random_uuid())
  RETURNING id INTO k5;

  -- Kudos 6: D(Infra) → C(OPD) — 19 hearts, Teamwork+Inspiring
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_d, user_c, 'Always helpful',
    'Bất cứ khi nào mình gặp khó khăn với hạ tầng, bạn luôn sẵn lòng giúp đỡ và giải thích rõ ràng. Tinh thần hợp tác và chia sẻ của bạn làm cho môi trường làm việc trở nên tốt hơn rất nhiều.',
    ARRAY['Teamwork','Inspiring'], 19, FALSE, gen_random_uuid())
  RETURNING id INTO k6;

  -- Kudos 7: C(OPD) → D(Infra) — 24 hearts, Dedicated
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_c, user_d, 'Amazing infrastructure work',
    'Hệ thống CI/CD mới bạn dựng lên đã giúp team giảm thời gian deploy từ 30 phút xuống còn 5 phút. Đây là một cải tiến rất đáng kể và team OPD chúng mình rất biết ơn.',
    ARRAY['Dedicated','Creative'], 24, FALSE, gen_random_uuid())
  RETURNING id INTO k7;

  -- Kudos 8: A(CEVC1) → D(Infra) — 55 hearts, Teamwork+Dedicated
  INSERT INTO kudos (sender_id, recipient_id, title, message, hashtags, heart_count, is_anonymous, idempotency_key)
  VALUES (user_a, user_d, 'Best support ever',
    'Incident hôm qua xử lý cực kỳ chuyên nghiệp. Bạn đã response trong vòng 5 phút và restore service trước deadline. Cả team CEVC1 rất ấn tượng và biết ơn.',
    ARRAY['Teamwork','Dedicated'], 55, FALSE, gen_random_uuid())
  RETURNING id INTO k8;

  -- Likes
  INSERT INTO likes (kudos_id, user_id, hearts_given) VALUES
    (k1, user_a, 1), (k1, user_c, 1),
    (k2, user_b, 1), (k2, user_d, 1),
    (k3, user_a, 1),
    (k4, user_b, 1), (k4, user_c, 1),
    (k5, user_a, 1), (k5, user_d, 1),
    (k6, user_c, 1),
    (k7, user_d, 1),
    (k8, user_a, 1), (k8, user_b, 1)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Seed xong! Kudos IDs: %, %, %, %, %, %, %, %', k1, k2, k3, k4, k5, k6, k7, k8;
  RAISE NOTICE 'Departments: A=CEVC1, B=CEVC2, C=OPD, D=Infra';
END $$;
