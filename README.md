# RESET: 00:10 — Webtoon (EP1–65) + Reader Website

ดัดแปลงนิยาย *RESET: 00:10* บทที่ 1–65 (`source/`) เป็น Webtoon แนวตั้ง 65 ตอน (2,106 Panels) พร้อมเว็บไซต์อ่านและ Admin Dashboard

- Arc 1 (EP1–12): โซลาริส → เนโครโพลิส ร้านเดดเอนด์
- Arc 2 (EP13–18): ย่านเริงรมย์ (The Velvet District)
- Arc 3 (EP19–30): หมู่บ้านผีสิงและคฤหาสน์พันปี — ลานระฆังเก้าใบ, เหมืองโบราณใต้พิภพ, โรงตีเหล็ก, ป้อมปราการร้างหอคอยเมฆา (กัปตัน อิลยา นาดีร์) — จบ Arc 3 ที่ EP30
- Arc 4 (EP31–36): บุกย่านเริงรมย์ — ขุนพลทั้งเจ็ด, เซร่าหุ่นสังหารหมายเลขศูนย์, เลดี้ อารัคเน่, สองผู้บังคับบัญชาแห่งโซลาริส
- Arc 5 (EP37–41): ทัณฑ์สวรรค์แห่งโซลาริส — คุกทาร์ทารัส, ผู้ทรงเกียรติยศอักษร, หน้ากากขาว, เวเลน ธอร์น
- Arc 6 (EP42–65): ป่าหมอกสุริยะ → โลกเบื้องล่าง → อาณาจักรหน้าเดียว (กริมม์ถอดหน้ากาก) → ฝึกกับหน่วยรบพิเศษหน้าเดียว, ความลับอดีตอักษรแอล, โมโนต้นฉบับ → ศึกหกผู้ทรงเกียรติยศ (การสละชีพของกริมม์ เวเลน เรกูลัสและโมโน, อวสานอักษรดี) — จบ Arc 6 ที่ EP65

## Quick start
ต้องใช้ Node.js ≥ 22.13 (ใช้ `node:sqlite` ในตัว — ไม่มี dependency ภายนอกสำหรับเว็บไซต์)

```bash
cp .env.example .env          # ใส่ SESSION_SECRET (>=32 ตัวอักษร) และ ADMIN_PASSWORD
npm run seed                  # นำเข้า 65 ตอนเข้าฐานข้อมูล + file storage และเผยแพร่
npm start                     # http://localhost:3000   (admin: /admin)
```
`npm run seed` ใช้ Playwright (ถ้ามี) วัดขนาดข้อความภาษาไทยจริงเพื่อจัดวาง Speech Bubble; ถ้าไม่มีจะใช้ค่าประมาณ

## โครงสร้าง
| ส่วน | ที่อยู่ |
|---|---|
| ต้นฉบับ | `source/` |
| Phase 1 Source review + ความไม่สอดคล้องของต้นฉบับ | `docs/01-source-review.md` |
| Phase 2 Character reference | `docs/02-character-reference.md`, `docs/characters/*.svg` |
| Continuity log | `docs/03-continuity.md` |
| Phase 3 Storyboards | `content/storyboards/epXX.js` → `docs/storyboards/epXX.md` |
| Phase 4 Art engine / rendered panels | `art/lib/` (EP11–20 เพิ่ม `cast2.js`, `creature2.js`, `backgrounds2.js`, `fx2.js`; EP21–30 เพิ่ม `cast3.js`, `creature3.js`, `backgrounds3.js`, `fx3.js`; EP31–45 `*4.js`; EP46–65 `cast5.js`, `creature5.js`, `backgrounds5.js`, `fx5.js`, `props5.js`), `art/out/` |
| Phase 5 Final review | `docs/05-final-review.md` |
| Server (HTTP, SQLite, storage, auth) | `server/` |
| Front-end (home, reader, admin) | `public/` |

## คำสั่ง
```bash
npm run render                   # วาด Panel ทั้งหมดใหม่จาก storyboard (หรือ: node scripts/render-art.js 3)
node scripts/render-extras.js    # ภาพปก, ภาพหน้าปกตอน, character sheets
node scripts/seed.js --publish --force [n]   # นำเข้าใหม่ (เขียนทับตอนที่มีอยู่)
npm test                         # API + content QA tests
node scripts/bubble-audit.js 390 # ตรวจข้อความทับ/ล้นในเบราว์เซอร์ (ต้องเปิดเซิร์ฟเวอร์; FROM=21 TO=30 เพื่อเลือกช่วงตอน)
BASE=http://localhost:3000 ADMIN_PASSWORD=... node scripts/e2e-check.js   # E2E เบราว์เซอร์ (EPISODES=65 ค่าเริ่มต้น; แก้ไขข้อมูลทดสอบเล็กน้อย)
```

## Storage & security
- ฐานข้อมูล: SQLite (`DATA_DIR`, ค่าเริ่มต้น `data/`) — ไม่ใช้ LocalStorage
- ไฟล์ภาพ: content-addressed บนดิสก์ (`STORAGE_DIR`, ค่าเริ่มต้น `storage/`), ตรวจชนิดไฟล์จาก magic bytes, ปฏิเสธ SVG ที่มีสคริปต์, เสิร์ฟพร้อม CSP sandbox
- ความลับทั้งหมดผ่าน environment variables (`.env` ไม่ถูก commit)
- รหัสผ่าน scrypt, session cookie HttpOnly + SameSite=Strict (+Secure เมื่อ `SECURE_COOKIES=true`), CSRF token สำหรับทุกคำขอที่แก้ไขข้อมูล, จำกัดการล็อกอินผิด 10 ครั้ง/15 นาที
- สำหรับ production ให้รันหลัง reverse proxy ที่มี HTTPS และสำรองโฟลเดอร์ `data/` + `storage/`
