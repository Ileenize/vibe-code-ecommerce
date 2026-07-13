# 📦 Project Handoff — Week 03 E-commerce
### Meeting First Game Option · Board Game Meetup Platform

> 🗓️ วันที่ส่งมอบงาน: 13 กรกฎาคม 2569  
> 👤 ผู้พัฒนา: Ileenize (boonyupin30@gmail.com)  
> 📁 Repository: [vibe-code-ecommerce](https://github.com/Ileenize/vibe-code-ecommerce.git)  
> 🗄️ Database Source: [first-meet-dbs](https://github.com/Ileenize/first-meet-dbs.git)

---

## 1. สรุปโปรเจกต์

แอปพลิเคชันเว็บสำหรับ **จับคู่ผู้เล่นบอร์ดเกม** และ **จองตี้ที่คาเฟ่บอร์ดเกม** ในขอนแก่น  
โดยเชื่อมต่อฐานข้อมูลที่ออกแบบไว้ใน `first-meet-dbs` เข้ากับ Frontend เว็บไซต์ E-commerce จริง

- **Backend:** Node.js + Express.js + Mongoose
- **Frontend:** HTML + Vanilla CSS + Vanilla JavaScript (ไม่ใช้ React)
- **Database:** MongoDB Atlas (Cloud) — Database: `my-ecommerce`

---

## 2. สิ่งที่ทำเสร็จแล้ว ✅

| งาน | สถานะ | ไฟล์ที่เกี่ยวข้อง |
|-----|--------|------------------|
| นำเข้าข้อมูลจาก `first-meet-dbs` เข้า MongoDB Atlas | ✅ Done | `seed.js` |
| สร้าง Mongoose Models ครบทุก Collection | ✅ Done | `app/api/models.js` |
| สร้าง REST API ครบทุก Endpoint | ✅ Done | `app/api/server.js` |
| พัฒนาหน้าเว็บ Premium Dark Mode | ✅ Done | `app/web/index.html`, `style.css` |
| เชื่อมต่อ Frontend กับ API ทุก Feature | ✅ Done | `app/web/app.js` |
| ระบบ Mock Login เลือก User | ✅ Done | `app/web/app.js` |
| Mock Payment ฿150 อัตโนมัติ | ✅ Done | `app/api/server.js` |
| Cafe Dashboard สำหรับ Staff/Owner | ✅ Done | `app/web/app.js` |

---

## 3. โครงสร้างไฟล์

```
week-03-ecommerce/
│
├── README.md                    ← เอกสารโปรเจกต์หลัก
├── HANDOFF.md                   ← ไฟล์นี้ (ส่งมอบงาน)
├── seed.js                      ← Script นำเข้าข้อมูลสู่ MongoDB Atlas
├── package.json                 ← Root scripts: npm run dev, npm run seed
│
├── app/
│   ├── api/                     ← BACKEND
│   │   ├── .env                 ⚠️ ไม่ commit — เก็บ credentials
│   │   ├── package.json
│   │   ├── server.js            ← Express App + Routes ทั้งหมด
│   │   └── models.js            ← Mongoose Schemas (8 collections)
│   │
│   └── web/                     ← FRONTEND
│       ├── index.html           ← หน้าเว็บ (Single Page App)
│       ├── style.css            ← Vanilla CSS (Dark Mode, 700+ lines)
│       └── app.js               ← JS Logic (API calls, routing, UI)
│
└── temp-dbs/                    ← Clone จาก first-meet-dbs (ข้อมูลต้นทาง)
    └── my-ecommerce-project/
        ├── 01_users.mongodb.js
        ├── 02_cafe.mongodb.js
        ├── 03_cafe-tables.mongodb.js
        ├── 04_board-games.mongodb.js
        ├── 05_cafe-games.mongodb.js
        ├── 06_meetup.mongodb.js
        ├── 07_booking.mongodb.js
        └── 08_payment.mongodb.js
```

---

## 4. วิธีรันโปรเจกต์

### ขั้นตอนสำหรับผู้รับงานต่อ

```bash
# 1. Clone repository
git clone https://github.com/Ileenize/vibe-code-ecommerce.git
cd vibe-code-ecommerce

# 2. ติดตั้ง Dependencies (Backend)
cd app/api
npm install

# 3. ตรวจสอบ / แก้ไขค่าใน .env
# ไฟล์ app/api/.env ต้องมีข้อมูลดังนี้:
#   PORT=5000
#   MONGODB_URI=mongodb://[user]:[pass]@[hosts]/my-ecommerce?ssl=true&...

# 4. (ถ้าต้องการ reset ข้อมูล) รัน seed script
cd ../../        # กลับมา root
node seed.js

# 5. รัน Server
cd app/api
node server.js
```

> 🌐 เปิดเบราว์เซอร์: **http://localhost:5000**

---

## 5. ข้อมูล Credentials (สำคัญ ⚠️)

> **ห้าม Commit ไฟล์ `.env` ขึ้น GitHub**

ข้อมูลที่จำเป็น (ขอจากเจ้าของโปรเจกต์):

| ค่า | รายละเอียด |
|-----|-----------|
| `MONGODB_URI` | MongoDB Atlas connection string (ดูได้ใน `app/api/.env`) |
| MongoDB DB Name | `my-ecommerce` |
| Atlas Cluster | `cluster0-jsd13.sklmx2c.mongodb.net` |
| Replica Set | `atlas-z3rrzs-shard-0` |

---

## 6. API Endpoints ทั้งหมด

Base URL: `http://localhost:5000/api`

```
GET    /api/meetups              ดูตี้ทั้งหมด (?status= &category=)
GET    /api/meetups/:id          รายละเอียดตี้
POST   /api/meetups              สร้างตี้ใหม่

GET    /api/cafes                ดูคาเฟ่ทั้งหมด
GET    /api/cafes/:id            รายละเอียดคาเฟ่ (+ โต๊ะ + เกม)

GET    /api/games                ดูบอร์ดเกมทั้งหมด (?category=)

GET    /api/bookings             ดูการจอง (?player_id= &meetup_id=)
POST   /api/bookings             เข้าร่วมตี้ + Mock Payment อัตโนมัติ

GET    /api/dashboard/:cafe_id   แดชบอร์ดร้านคาเฟ่

GET    /api/users                ดูผู้ใช้ทั้งหมด (Demo Login)
POST   /api/auth/login           Mock Login ด้วย username
```

---

## 7. MongoDB Collections

| Collection | จำนวน Docs | คำอธิบาย |
|------------|-----------|----------|
| `users` | 12 | player (6), staff (4), owner_cafe (2) |
| `cafe` | 2 | Meeple Corner Cafe, Lucky Dice Board Game Cafe |
| `cafe-tables` | 7 | โต๊ะในคาเฟ่ (available / occupied / out_of_service) |
| `board-games` | 10 | Catan, Werewolf, Splendor, Pandemic, ... |
| `cafe-games` | 12 | เกมที่มีในแต่ละคาเฟ่ |
| `meetup` | 6 | ตี้ (recruiting=2, confirmed=2, completed=1, cancelled=1) |
| `booking` | 22 | การจอง (confirmed, pending_payment, completed, flaked, cancelled) |
| `payment` | 22 | การชำระเงิน (successful, pending, forfeited, refunded) |

---

## 8. User Roles และสิทธิ์

| Role | ตัวอย่าง Username | ทำได้ |
|------|-----------------|-------|
| `player` | `player_nok`, `player_mint` | ดูตี้, เข้าร่วม, สร้างตี้, ดูการจองของตัวเอง |
| `staff` | `staff_may`, `staff_jane` | ดูแดชบอร์ดร้านที่ตนสังกัด |
| `owner_cafe` | `owner_meeple`, `owner_dice` | ดูแดชบอร์ดร้านของตน |

> 💡 **Mock Login:** กดปุ่ม "เข้าสู่ระบบ" แล้วเลือก Username ได้เลย ไม่ต้องใส่รหัสผ่าน

---

## 9. สิ่งที่ควรพัฒนาต่อ (Future Work)

- [ ] **JWT Authentication** — ระบบ Login จริงด้วย JWT Token แทน Mock
- [ ] **QR Code Check-in** — สร้าง QR Code จาก Booking Code สำหรับสแกนที่ร้าน
- [ ] **Real Payment Gateway** — เชื่อมต่อ Omise หรือ Stripe แทน Mock Payment
- [ ] **User Registration** — ระบบสมัครสมาชิกจริง
- [ ] **Booking Cancellation** — ผู้เล่นยกเลิกการจองได้
- [ ] **Email Notification** — แจ้งเตือนทาง Email เมื่อจองสำเร็จ
- [ ] **Search & Map** — ค้นหาคาเฟ่จากแผนที่
- [ ] **Image Upload** — อัพโหลดรูปโปรไฟล์ร้านและบอร์ดเกม
- [ ] **Mobile App** — พัฒนา Mobile version ใน `app/mobile/`

---

## 10. หมายเหตุสำหรับผู้รับงาน

> [!IMPORTANT]
> **การเชื่อมต่อ MongoDB Atlas** ใช้ Connection String แบบ Non-SRV เนื่องจากมีปัญหา DNS SRV resolution ใน Node.js บางเวอร์ชัน (querySrv ECONNREFUSED) ดูรายละเอียดใน `app/api/.env` และ `seed.js`

> [!NOTE]
> **Frontend เป็น Static Files** ที่ถูก Serve โดย Express — ไม่ต้องรัน Dev Server แยก ทุกอย่างทำงานผ่าน port 5000 เดียว

> [!TIP]
> **ทดสอบ API ด้วย Postman หรือ Thunder Client** โดย import collection จาก Endpoints ใน Section 6 ได้เลย ไม่ต้องเปิดหน้าเว็บก็ทดสอบได้

---

*📌 เอกสารนี้จัดทำโดย Antigravity AI สำหรับ JSD13 — Week 03 E-commerce Assignment*
