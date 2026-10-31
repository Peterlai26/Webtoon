# RESET: 00:10 — Webtoon (EP1–10) + Reader Website

ดัดแปลงนิยาย *RESET: 00:10* บทที่ 1–10 (`source/`) เป็น Webtoon แนวตั้ง 10 ตอน (432 Panels) พร้อมเว็บไซต์อ่านและ Admin Dashboard

## Quick start
ต้องใช้ Node.js ≥ 22.13 (ใช้ `node:sqlite` ในตัว — ไม่มี dependency ภายนอกสำหรับเว็บไซต์)

```bash
cp .env.example .env          # ใส่ SESSION_SECRET (>=32 ตัวอักษร) และ ADMIN_PASSWORD
npm run seed                  # นำเข้า 10 ตอนเข้าฐานข้อมูล + file storage และเผยแพร่
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
| Phase 4 Art engine / rendered panels | `art/lib/`, `art/out/` |
| Phase 5 Final review | `docs/05-final-review.md` |
| Server (HTTP, SQLite, storage, auth) | `server/` |
| Front-end (home, reader, admin) | `public/` |

## คำสั่ง
```bash
npm run render                   # วาด Panel ทั้งหมดใหม่จาก storyboard (หรือ: node scripts/render-art.js 3)
node scripts/render-extras.js    # ภาพปก, ภาพหน้าปกตอน, character sheets
node scripts/seed.js --publish --force [n]   # นำเข้าใหม่ (เขียนทับตอนที่มีอยู่)
npm test                         # API + content QA tests
node scripts/bubble-audit.js 390 # ตรวจข้อความทับ/ล้นในเบราว์เซอร์ (ต้องเปิดเซิร์ฟเวอร์)
BASE=http://localhost:3000 ADMIN_PASSWORD=... node scripts/e2e-check.js   # E2E เบราว์เซอร์ (แก้ไขข้อมูลทดสอบเล็กน้อย)
```

## Storage & security
- ฐานข้อมูล: SQLite (`DATA_DIR`, ค่าเริ่มต้น `data/`) — ไม่ใช้ LocalStorage
- ไฟล์ภาพ: content-addressed บนดิสก์ (`STORAGE_DIR`, ค่าเริ่มต้น `storage/`), ตรวจชนิดไฟล์จาก magic bytes, ปฏิเสธ SVG ที่มีสคริปต์, เสิร์ฟพร้อม CSP sandbox
- ความลับทั้งหมดผ่าน environment variables (`.env` ไม่ถูก commit)
- รหัสผ่าน scrypt, session cookie HttpOnly + SameSite=Strict (+Secure เมื่อ `SECURE_COOKIES=true`), CSRF token สำหรับทุกคำขอที่แก้ไขข้อมูล, จำกัดการล็อกอินผิด 10 ครั้ง/15 นาที
- สำหรับ production ให้รันหลัง reverse proxy ที่มี HTTPS และสำรองโฟลเดอร์ `data/` + `storage/`
