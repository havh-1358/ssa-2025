# Items Analysis - He-thong-giai

## Screen Context
- **Screen Purpose**: Trang hệ thống giải thưởng SAA 2025 — trình bày các hạng mục giải, tiêu chí và giá trị giải thưởng, kèm khối quảng bá Sun* Kudos.
- **Target User Type**: Nhân viên Sun* (IT/Digital service) — xem thông tin giải thưởng và điều kiện tham gia.

---

### Item 1: 3_Keyvisual (`313:8437`)

- hasChildren: false
- Name JP: キービジュアル
- Name Trans: Keyvisual
- Item Type: others
- Item Subtype: hero_banner
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Banner chính hiển thị artwork và tiêu đề chiến dịch SAA 2025.

Display Elements:
  - Ảnh nền: 1200×871px (cover; crop trung tâm)
  - Tiêu đề: 'ROOT FURTHER'
  - Phụ đề: 'Sun* Annual Award 2025'
  - Logo và icon góc trên

Function & Logic:
  - Trang trí; không có hành vi click
  - Responsive: scale để cover và crop trung tâm
  - Accessibility: alt 'Keyvisual Sun* Annual Award 2025'

Candidate QA:

---

### Item 2: A_Title hệ thống giải thưởng (`313:8453`)

- hasChildren: false
- Name JP: タイトルセクション
- Name Trans: Award System Title
- Item Type: label
- Item Subtype:
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Tiêu đề phần giới thiệu hệ thống giải thưởng SAA 2025.

Display Elements:
  - Label phụ: 'Sun* annual awards 2025' — text nhỏ; màu nhạt
  - Tiêu đề chính: 'Hệ thống giải thưởng SAA 2025' — text lớn; màu vàng

Function & Logic:
  - Hiển thị tĩnh; không interactive

Candidate QA:

---

### Item 3: B_Hệ thống giải thưởng (`313:8458`)

- hasChildren: true
- Name JP: 賞システムセクション
- Name Trans: Award System Section
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Container chứa toàn bộ nội dung hệ thống giải thưởng gồm menu điều hướng bên trái và các thẻ giải thưởng bên phải.

Display Elements:
  - Children: C_Menu list (điều hướng); D.1–D.6 (thẻ chi tiết từng giải); D1_Sunkudos (khối promo)

Function & Logic:
  - Click mục bên trái: cuộn/chuyển tới thẻ giải tương ứng
  - Hiển thị tĩnh; không có input

Candidate QA:
- Khi click mục menu bên trái thì hành vi là scroll-to hay tab-switch (ẩn/hiện panel)?

---

### Item 4: C_Menu list (`313:8459`)

- hasChildren: true
- Name JP: カテゴリーメニュー
- Name Trans: Category Menu
- Item Type: others
- Item Subtype: navigation
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action: on_click
- Transition Note: Chuyển sang thẻ giải thưởng tương ứng khi click mục
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Menu điều hướng dọc chứa 6 mục giải thưởng.

Display Elements:
  - Danh sách: 6 nút văn bản ('Top Talent'; 'Top Project'; 'Top Project Leader'; 'Best Manager'; 'Signature 2025 - Creator'; 'MVP')
  - Indicator: màu vàng + underline cho mục đang active

Function & Logic:
  - Click mục: đặt trạng thái active và hiển thị nội dung tương ứng
  - Hover: highlight mục
  - Mặc định: mục đầu tiên 'Top Talent' active

Candidate QA:
- Mục active mặc định khi tải trang là mục nào?
- Khi scroll trang thì menu có sticky/fixed không?

---

### Item 5: C.1_Top talent (`313:8460`)

- hasChildren: false
- Name JP: トップタレントナビ
- Name Trans: Top Talent nav item
- Item Type: others
- Item Subtype: navigation_item
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action: on_click
- Transition Note: Chuyển sang phần 'Top Talent' và đặt trạng thái active
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Nút điều hướng 'Top Talent' trong cột menu trái.

Display Elements:
  - Icon: đầu text
  - Label: 'Top Talent'
  - Trạng thái active: underline vàng

Function & Logic:
  - Click: active mục này; hiển thị panel 'Top Talent'
  - Hover: highlight

Candidate QA:

---

### Item 6: C.2_Top project (`313:8461`)

- hasChildren: false
- Name JP: トッププロジェクトナビ
- Name Trans: Top Project nav item
- Item Type: others
- Item Subtype: navigation_item
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action: on_click
- Transition Note: Chuyển sang phần 'Top Project' và đặt trạng thái active
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Nút điều hướng 'Top Project' trong cột menu trái.

Display Elements:
  - Label: 'Top Project'
  - Trạng thái active: underline vàng

Function & Logic:
  - Click: active mục này; hiển thị panel 'Top Project'
  - Hover: highlight

Candidate QA:

---

### Item 7: C.3_Top Project leader (`313:8462`)

- hasChildren: false
- Name JP: トッププロジェクトリーダーナビ
- Name Trans: Top Project Leader nav item
- Item Type: others
- Item Subtype: navigation_item
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action: on_click
- Transition Note: Chuyển sang phần 'Top Project Leader' và đặt trạng thái active
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Nút điều hướng 'Top Project Leader' trong cột menu trái.

Display Elements:
  - Label: 'Top Project Leader'
  - Trạng thái active: underline vàng

Function & Logic:
  - Click: active mục này; hiển thị panel 'Top Project Leader'

Candidate QA:

---

### Item 8: C.4_Best manager (`313:8463`)

- hasChildren: false
- Name JP: ベストマネージャーナビ
- Name Trans: Best Manager nav item
- Item Type: others
- Item Subtype: navigation_item
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action: on_click
- Transition Note: Chuyển sang phần 'Best Manager' và đặt trạng thái active
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Nút điều hướng 'Best Manager' trong cột menu trái.

Display Elements:
  - Label: 'Best Manager'
  - Trạng thái active: underline vàng

Function & Logic:
  - Click: active mục này; hiển thị panel 'Best Manager'

Candidate QA:

---

### Item 9: C.5_Signature 2025 (`313:8464`)

- hasChildren: false
- Name JP: シグネチャー2025ナビ
- Name Trans: Signature 2025 nav item
- Item Type: others
- Item Subtype: navigation_item
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action: on_click
- Transition Note: Chuyển sang phần 'Signature 2025 - Creator' và đặt trạng thái active
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Nút điều hướng 'Signature 2025 - Creator' trong cột menu trái.

Display Elements:
  - Label: 'Signature 2025 - Creator'
  - Trạng thái active: underline vàng

Function & Logic:
  - Click: active mục này; hiển thị panel 'Signature 2025 - Creator'

Candidate QA:

---

### Item 10: C.6_MVP (`313:8465`)

- hasChildren: false
- Name JP: MVPナビ
- Name Trans: MVP nav item
- Item Type: others
- Item Subtype: navigation_item
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action: on_click
- Transition Note: Chuyển sang phần 'MVP' và đặt trạng thái active
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Nút điều hướng 'MVP' trong cột menu trái.

Display Elements:
  - Label: 'MVP'
  - Trạng thái active: underline vàng

Function & Logic:
  - Click: active mục này; hiển thị panel 'MVP'

Candidate QA:

---

### Item 11: D.1_Top talent (`313:8467`)

- hasChildren: true
- Name JP: トップタレントセクション
- Name Trans: Top Talent award section
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Panel chi tiết giải 'Top Talent' — hiển thị ảnh giải thưởng và thông tin metadata bên phải.

Display Elements:
  - Children: D.1.1_Picture-Award (ảnh 336×336px); D.1.2_Content (khối thông tin)
  - Tiêu đề: 'Top Talent'
  - Mô tả: đoạn giải thích tiêu chí và ý nghĩa giải
  - Số lượng: '10' 'Đơn vị' (cá nhân)
  - Giá trị: '7.000.000 VNĐ' (cho mỗi giải thưởng)

Function & Logic:
  - Hiển thị tĩnh; không interactive

Candidate QA:

---

### Item 12: D.2_Top Project (`313:8468`)

- hasChildren: false
- Name JP: トッププロジェクトセクション
- Name Trans: Top Project award section
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Panel chi tiết giải 'Top Project'.

Display Elements:
  - Hình: khung ảnh biểu tượng giải
  - Tiêu đề: 'Top Project'
  - Mô tả: đoạn giải thích tiêu chí và ý nghĩa
  - Số lượng: '02' 'Tập thể'
  - Giá trị: '15.000.000 VNĐ' (mỗi giải)

Function & Logic:
  - Hiển thị tĩnh; không interactive

Candidate QA:

---

### Item 13: D.3_Top Project Leader (`313:8469`)

- hasChildren: false
- Name JP: トッププロジェクトリーダーセクション
- Name Trans: Top Project Leader award section
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Panel chi tiết giải 'Top Project Leader'.

Display Elements:
  - Hình: khung ảnh biểu tượng giải
  - Tiêu đề: 'Top Project Leader'
  - Mô tả: đoạn giải thích tiêu chí và ý nghĩa
  - Số lượng: '03' 'Cá nhân'
  - Giá trị: '7.000.000 VNĐ' (cho mỗi giải)

Function & Logic:
  - Hiển thị tĩnh; không interactive

Candidate QA:

---

### Item 14: D.4_Thông tin giải (`313:8470`)

- hasChildren: false
- Name JP: ベストマネージャーセクション
- Name Trans: Best Manager award section
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Panel chi tiết giải 'Best Manager'.

Display Elements:
  - Hình: khung ảnh biểu tượng giải
  - Tiêu đề: 'Best Manager'
  - Mô tả: đoạn văn mô tả mục đích và tiêu chí
  - Metadata: 'Số lượng giải thưởng: 01'; 'Cá nhân'; 'Giá trị giải thưởng: 10.000.000 VNĐ'

Function & Logic:
  - Hiển thị tĩnh; không interactive

Candidate QA:

---

### Item 15: D.5_Signature 2025 (`313:8471`)

- hasChildren: false
- Name JP: シグネチャー2025セクション
- Name Trans: Signature 2025 Creator award section
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Panel chi tiết giải 'Signature 2025 - Creator' với 2 hạng giải (cá nhân và tập thể).

Display Elements:
  - Hình: khung ảnh biểu tượng giải
  - Tiêu đề: 'Signature 2025 - Creator'
  - Mô tả: tóm tắt mục tiêu và ý nghĩa giải
  - Hạng 1: '01' 'Cá nhân' — '5.000.000 VNĐ'
  - Hạng 2: '01' 'Tập thể' — '8.000.000 VNĐ'

Function & Logic:
  - Hiển thị tĩnh; không interactive

Candidate QA:
- Hai hạng giải (cá nhân/tập thể) được hiển thị trong cùng một row hay hai block riêng biệt?

---

### Item 16: D.6_MVP (`313:8510`)

- hasChildren: false
- Name JP: MVPセクション
- Name Trans: MVP award section
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Panel chi tiết giải 'MVP (Most Valuable Person)'.

Display Elements:
  - Hình: khung ảnh biểu tượng giải
  - Tiêu đề: 'MVP (Most Valuable Person)'
  - Mô tả: tóm tắt mục tiêu và ý nghĩa giải
  - Số lượng: '01' 'Cá nhân'
  - Giá trị: '15.000.000 VNĐ'

Function & Logic:
  - Hiển thị tĩnh; không interactive

Candidate QA:

---

### Item 17: D1_Sunkudos (`335:12023`)

- hasChildren: true
- Name JP: サンクドスプロモ
- Name Trans: Sun* Kudos promo block
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action: on_click
- Transition Note: Click 'Chi tiết' điều hướng tới trang Sun* Kudos
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Khối quảng bá 'Sun* Kudos' với tiêu đề; mô tả ngắn và nút hành động.

Display Elements:
  - Label: 'Phong trào ghi nhận'
  - Title: 'Sun* Kudos'
  - Description: đoạn mô tả tóm tắt chương trình
  - Logo/Hình: minh hoạ bên phải
  - Children: D2_Content (nội dung); D2.1_Button-IC (nút chi tiết)

Function & Logic:
  - Click 'Chi tiết': điều hướng tới trang Sun* Kudos

Candidate QA:
- URL đích khi click 'Chi tiết' là route nội bộ hay external link?

---

### Item 18: D.1.1_Picture-Award (`I313:8467;214:2525`)

- hasChildren: false
- Name JP: 賞画像
- Name Trans: Award image
- Item Type: file_or_image
- Item Subtype:
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Hình ảnh biểu tượng giải thưởng trong thẻ chi tiết.

Display Elements:
  - Kích thước: 336×336px
  - mix-blend-mode: screen
  - Box-shadow: gold glow

Function & Logic:
  - Hiển thị ảnh tĩnh; không interactive

Candidate QA:

---

### Item 19: D.1.2_Content (`I313:8467;214:2526`)

- hasChildren: false
- Name JP: コンテンツブロック
- Name Trans: Award detail content block
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Khối thông tin chi tiết giải thưởng 'Top Talent' bên phải ảnh.

Display Elements:
  - Tiêu đề: 'Top Talent'
  - Mô tả: đoạn văn giải thích mục đích giải thưởng
  - Label vàng: 'Số lượng giải thưởng:'
  - Số lượng: '10' 'Đơn vị'
  - Label vàng: 'Giá trị giải thưởng:'
  - Giá trị: '7.000.000 VNĐ'
  - Phụ chú: 'cho mỗi giải thưởng'

Function & Logic:
  - Hiển thị tĩnh (read-only)

Candidate QA:

---

### Item 20: D2_Content (`I335:12023;313:8419`)

- hasChildren: false
- Name JP: サンクドスコンテンツ
- Name Trans: Sun* Kudos content block
- Item Type: others
- Item Subtype: info_block
- Button Type:
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action:
- Transition Note:
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Khối nội dung 'Sun* Kudos' gồm tiêu đề; mô tả và hình ảnh minh hoạ.

Display Elements:
  - Label: 'Phong trào ghi nhận'
  - Tiêu đề: 'Sun* Kudos'
  - Mô tả: đoạn tóm tắt hoạt động
  - Hình/Logo: minh hoạ bên phải

Function & Logic:
  - Hiển thị tĩnh

Candidate QA:

---

### Item 21: D2.1_Button-IC (`I335:12023;313:8426`)

- hasChildren: false
- Name JP: 詳細ボタン
- Name Trans: Detail button
- Item Type: button
- Item Subtype:
- Button Type: text_link
- Data Type:
- Format:
- Required: false
- Min Length: -
- Max Length: -
- Default Value:
- User Action: on_click
- Transition Note: Mở trang Sun* Kudos
- Database Table: -
- Database Column: -
- Database Note: -

Validation Note:

Description:
Nút 'Chi tiết' dạng text link để truy cập trang Sun* Kudos.

Display Elements:
  - Label: 'Chi tiết'
  - Icon: kèm theo label

Function & Logic:
  - Click: điều hướng tới trang Sun* Kudos
  - State: luôn enabled (không có disable condition)

Candidate QA:
- Điều hướng sang tab mới hay cùng tab?
