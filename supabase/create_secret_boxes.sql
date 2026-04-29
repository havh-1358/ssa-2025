-- Chạy trong Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS secret_boxes (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status           TEXT        NOT NULL DEFAULT 'unopened' CHECK (status IN ('opened', 'unopened')),
    gift_description TEXT,
    opened_at        TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_secret_boxes_user_id
    ON secret_boxes(user_id);

CREATE INDEX IF NOT EXISTS idx_secret_boxes_opened_at
    ON secret_boxes(opened_at DESC)
    WHERE status = 'opened';

ALTER TABLE secret_boxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "secret_boxes: owner read"
    ON secret_boxes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "secret_boxes: owner update"
    ON secret_boxes FOR UPDATE
    USING (auth.uid() = user_id);

-- Sample data (optional — thay YOUR_USER_ID bằng ID thực)
-- INSERT INTO secret_boxes (user_id, status, gift_description, opened_at) VALUES
--   ('YOUR_USER_ID', 'opened', 'Nhận được 1 áo phông SAA', NOW() - INTERVAL '1 hour'),
--   ('YOUR_USER_ID', 'opened', 'Nhận được 1 voucher Grab',  NOW() - INTERVAL '2 hours'),
--   ('YOUR_USER_ID', 'unopened', NULL, NULL);
