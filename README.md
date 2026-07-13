# 🎲 Meeting First Game Option
### Board Game Meetup Booking Platform

> แพลตฟอร์มจับคู่และจองตี้เล่นบอร์ดเกมที่คาเฟ่ในขอนแก่น  
> เชื่อมผู้เล่นที่ต้องการหาเพื่อนเล่น กับร้านคาเฟ่บอร์ดเกมที่ต้องการบริหารโต๊ะ

[![Node.js](https://img.shields.io/badge/Node.js-v26-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📋 สารบัญ

- [ภาพรวมโปรเจกต์](#-ภาพรวมโปรเจกต์)
- [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)
- [โครงสร้างโปรเจกต์](#-โครงสร้างโปรเจกต์)
- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)
- [ฐานข้อมูล](#-ฐานข้อมูล)
- [การติดตั้งและรันโปรเจกต์](#-การติดตั้งและรันโปรเจกต์)
- [API Endpoints](#-api-endpoints)
- [โครงสร้างข้อมูล (Collections)](#-โครงสร้างข้อมูล-collections)
- [ผู้ใช้งานในระบบ (Demo)](#-ผู้ใช้งานในระบบ-demo)

---

## 🌟 ภาพรวมโปรเจกต์

**Meeting First Game Option** คือแอปพลิเคชันเว็บที่ทำหน้าที่เป็น **Platform Matchmaker & Booking System** สำหรับผู้เล่นบอร์ดเกมและร้านคาเฟ่บอร์ดเกม

ปัญหาที่แก้ไข:
- ผู้เล่นหาเพื่อนเล่นไม่ได้ โดยเฉพาะเกมที่ต้องใช้ 4–6+ คน
- การนัดผ่าน LINE/Facebook ไม่มีระบบยืนยัน ทำให้นัดล่มบ่อย
- ร้านคาเฟ่ขาดระบบกลางในการจัดการโต๊ะและการจอง

---

## ✨ ฟีเจอร์หลัก

| # | ฟีเจอร์ | คำอธิบาย |
|---|---------|----------|
| 1 | **Meetup Browsing** | ค้นหาตี้ที่กำลังรับสมาชิก กรองตามสถานะและหมวดเกม |
| 2 | **Create Meetup** | สร้างตี้ใหม่ เลือกคาเฟ่ เวลา และประเภท (Specific/Open) |
| 3 | **Join Meetup** | เข้าร่วมตี้ + จ่ายมัดจำ ฿150 แบบ Mock Payment |
| 4 | **Booking Code** | รับ Booking Code สำหรับ Check-in ที่ร้านหลังจองสำเร็จ |
| 5 | **Cafe Listing** | ดูรายชื่อคาเฟ่พร้อมโต๊ะและบอร์ดเกมที่มี |
| 6 | **My Bookings** | ผู้เล่นดูประวัติการจองของตนเอง |
| 7 | **Cafe Dashboard** | Staff/Owner ดูตี้และรายชื่อผู้จองทั้งหมดในร้าน |
| 8 | **Demo Login** | เลือกผู้ใช้งานสำหรับทดสอบระบบ (ไม่ต้องสมัครสมาชิกจริง) |

---

## 📁 โครงสร้างโปรเจกต์

```
week-03-ecommerce/
│
├── app/
│   ├── api/                        ← Backend (Node.js + Express)
│   │   ├── .env                    ← Environment Variables (MongoDB URI, PORT)
│   │   ├── package.json            ← Dependencies (express, mongoose, cors, dotenv)
│   │   ├── server.js               ← Express Server + API Routes ทั้งหมด
│   │   └── models.js               ← Mongoose Schemas & Models
│   │
│   └── web/                        ← Frontend (Vanilla HTML/CSS/JS)
│       ├── index.html              ← โครงสร้างหน้าเว็บ (5 หน้า + 4 Modal)
│       ├── style.css               ← Premium Dark Mode UI
│       └── app.js                  ← Logic ทั้งหมด (SPA Routing, API calls)
│
├── temp-dbs/                       ← โคลนจาก first-meet-dbs repository
│   └── my-ecommerce-project/       ← ไฟล์ Mock Data (.mongodb.js)
│
├── seed.js                         ← สคริปต์นำเข้าข้อมูลเข้า MongoDB Atlas
├── package.json                    ← Root package + scripts
└── README.md                       ← ไฟล์นี้
```

---

## 🛠️ เทคโนโลยีที่ใช้

### Backend
| Package | Version | การใช้งาน |
|---------|---------|----------|
| `express` | ^4.21 | Web Framework / REST API |
| `mongoose` | ^8.7 | MongoDB ODM + Schema validation |
| `dotenv` | ^16.4 | จัดการ Environment Variables |
| `cors` | ^2.8 | อนุญาต Cross-Origin requests จาก Frontend |

### Frontend
- **HTML5** — Semantic markup, SPA structure ด้วย sections
- **Vanilla CSS** — Dark Mode, Glassmorphism, HSL Color Palette, CSS Animations
- **Vanilla JavaScript** — SPA Routing, Fetch API, DOM Manipulation

### ฐานข้อมูล
- **MongoDB Atlas** — Cloud Database (Replica Set: `atlas-z3rrzs-shard-0`)
- Database name: `my-ecommerce`

---

## 🗄️ ฐานข้อมูล

ข้อมูลนำเข้าจาก [first-meet-dbs](https://github.com/Ileenize/first-meet-dbs.git) repository

### Collections ทั้งหมด

| Collection | Documents | คำอธิบาย |
|------------|-----------|----------|
| `users` | 12 | ผู้ใช้งาน (player, staff, owner_cafe) |
| `cafe` | 2 | ร้านคาเฟ่บอร์ดเกม |
| `cafe-tables` | 7 | โต๊ะในร้านคาเฟ่ |
| `board-games` | 10 | บอร์ดเกมทั้งหมด |
| `cafe-games` | 12 | บอร์ดเกมที่มีในแต่ละคาเฟ่ |
| `meetup` | 6 | ตี้บอร์ดเกม |
| `booking` | 22 | การจองของผู้เล่น |
| `payment` | 22 | ประวัติการชำระเงินมัดจำ |

---

## 🚀 การติดตั้งและรันโปรเจกต์

### ข้อกำหนดเบื้องต้น
- [Node.js](https://nodejs.org/) v18 ขึ้นไป
- การเชื่อมต่อ Internet (สำหรับ MongoDB Atlas)

### ขั้นตอนการติดตั้ง

**1. Clone โปรเจกต์**
```bash
git clone https://github.com/Ileenize/vibe-code-ecommerce.git
cd vibe-code-ecommerce
```

**2. ติดตั้ง Dependencies ของ Backend**
```bash
cd app/api
npm install
```

**3. ตั้งค่าไฟล์ Environment**

แก้ไขไฟล์ `app/api/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://[username]:[password]@[hosts]/my-ecommerce?ssl=true&replicaSet=...
```

**4. (ตัวเลือก) นำเข้าข้อมูลตัวอย่าง**
```bash
# ที่ Root โฟลเดอร์
node seed.js
```

**5. รัน Server**
```bash
# วิธีที่ 1: จาก root
npm run dev

# วิธีที่ 2: จากโฟลเดอร์ api
cd app/api
node server.js
```

**6. เปิดเว็บไซต์**

เปิดเบราว์เซอร์ไปที่ → **http://localhost:5000**

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Meetups
| Method | Endpoint | คำอธิบาย | Query Params |
|--------|----------|----------|--------------|
| `GET` | `/meetups` | ดูตี้ทั้งหมด | `?status=recruiting` / `?category=strategy` |
| `GET` | `/meetups/:id` | รายละเอียดตี้ | — |
| `POST` | `/meetups` | สร้างตี้ใหม่ | — |

**ตัวอย่าง Request Body สร้างตี้:**
```json
{
  "host_id": "665000000000000000000001",
  "cafe_id": "666000000000000000000001",
  "game_id": "668000000000000000000001",
  "title": "Catan Saturday Night",
  "type": "specific",
  "date": "2026-07-20",
  "start_time": "18:00",
  "end_time": "20:00",
  "min_players": 3,
  "max_players": 4
}
```

### Cafes
| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/cafes` | ดูคาเฟ่ทั้งหมด |
| `GET` | `/cafes/:id` | รายละเอียดคาเฟ่ (+ โต๊ะ + เกม) |

### Games
| Method | Endpoint | คำอธิบาย | Query Params |
|--------|----------|----------|--------------|
| `GET` | `/games` | ดูบอร์ดเกมทั้งหมด | `?category=party` |

### Bookings
| Method | Endpoint | คำอธิบาย | Query Params |
|--------|----------|----------|--------------|
| `GET` | `/bookings` | ดูการจอง | `?player_id=` / `?meetup_id=` |
| `POST` | `/bookings` | เข้าร่วมตี้ + Mock Payment | — |

**ตัวอย่าง Request Body เข้าร่วมตี้:**
```json
{
  "meetup_id": "66a000000000000000000002",
  "player_id": "665000000000000000000001"
}
```

**ตัวอย่าง Response สำเร็จ:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "booking_code": "MFG-0002-94521",
      "status": "confirmed"
    },
    "payment": {
      "amount": 150,
      "status": "successful",
      "transaction_id": "MOCK-TXN-1720883521000"
    }
  }
}
```

### Dashboard
| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/dashboard/:cafe_id` | แดชบอร์ดร้านคาเฟ่ (ตี้ + การจอง) |

### Users / Auth
| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/users` | ดูผู้ใช้ทั้งหมด (สำหรับ Demo Login) |
| `POST` | `/auth/login` | Mock login ด้วย username |

---

## 🗂️ โครงสร้างข้อมูล (Collections)

### Users
```json
{
  "username": "player_nok",
  "email": "nok.player@example.com",
  "password_hash": "...",
  "role": "player | staff | owner_cafe",
  "cafe_id": null,
  "created_at": "2026-07-01T09:00:00Z"
}
```

### Meetup
```json
{
  "host_id": "ObjectId(user)",
  "cafe_id": "ObjectId(cafe)",
  "game_id": "ObjectId(boardgame) | null",
  "title": "Catan Friday Night",
  "type": "specific | open",
  "date": "2026-07-17T00:00:00Z",
  "start_time": "18:30",
  "end_time": "20:30",
  "min_players": 3,
  "max_players": 4,
  "current_players": 2,
  "status": "recruiting | confirmed | completed | cancelled"
}
```

### Booking
```json
{
  "meetup_id": "ObjectId(meetup)",
  "player_id": "ObjectId(user)",
  "booking_code": "MFG-M1-P1",
  "status": "pending_payment | confirmed | checked_in | completed | flaked | cancelled",
  "created_at": "2026-07-10T09:00:00Z"
}
```

### Payment
```json
{
  "booking_id": "ObjectId(booking)",
  "user_id": "ObjectId(user)",
  "amount": 150.0,
  "status": "successful | pending | forfeited | refunded",
  "transaction_id": "MOCK-TXN-0001",
  "paid_at": "2026-07-10T09:00:00Z"
}
```

---

## 👥 ผู้ใช้งานในระบบ (Demo)

เข้าสู่ระบบโดยกด **"เข้าสู่ระบบ"** และเลือกผู้ใช้งานได้เลย

| Username | Role | คำอธิบาย |
|----------|------|----------|
| `player_nok` | 🎮 player | ดูตี้, เข้าร่วม, ดูการจอง, สร้างตี้ |
| `player_mint` | 🎮 player | ดูตี้, เข้าร่วม, ดูการจอง, สร้างตี้ |
| `staff_may` | 🏪 staff | ดูแดชบอร์ด Meeple Corner Cafe |
| `staff_jane` | 🏪 staff | ดูแดชบอร์ด Lucky Dice Board Game Cafe |
| `owner_meeple` | 👑 owner_cafe | เจ้าของ Meeple Corner Cafe |

---

## 🔗 ที่มาของฐานข้อมูล

- **Source Repository:** [first-meet-dbs](https://github.com/Ileenize/first-meet-dbs.git)
- **ไฟล์ที่ใช้:** `my-ecommerce-project/01_users.mongodb.js` ถึง `08_payment.mongodb.js`
- **สคริปต์นำเข้า:** [`seed.js`](./seed.js) — แปลง MongoDB Shell syntax เป็น Node.js driver แล้วนำเข้าผ่าน Atlas connection

---

*สร้างขึ้นเพื่อการเรียนรู้ JSD13 — Week 03 E-commerce Project*
