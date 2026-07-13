# Week 03 — E-commerce Board Game Meetup Platform

เว็บแอปพลิเคชันจับคู่ผู้เล่นบอร์ดเกม สร้างและเข้าร่วมตี้ที่คาเฟ่บอร์ดเกม

## 🗂️ โครงสร้างโปรเจกต์

```
week-03-ecommerce/
├── app/
│   ├── api/                  ← Backend (Node.js + Express + Mongoose)
│   │   ├── .env              ← MongoDB Atlas URI + PORT
│   │   ├── package.json
│   │   ├── server.js         ← Express Server + API Routes
│   │   └── models.js         ← Mongoose Schemas
│   └── web/                  ← Frontend (HTML + Vanilla CSS + JS)
│       ├── index.html
│       ├── style.css
│       └── app.js
├── seed.js                   ← สคริปต์นำเข้าข้อมูลจาก first-meet-dbs
├── temp-dbs/                 ← โคลนมาจาก first-meet-dbs
└── package.json
```

## 🚀 วิธีรันโปรเจกต์

### 1. เริ่มต้น Server (Backend + Frontend)

```bash
# ที่โฟลเดอร์ app/api
cd app/api
node server.js
```

แล้วเปิดเบราว์เซอร์ไปที่ **http://localhost:5000**

### 2. นำเข้าข้อมูลใหม่ (ถ้าต้องการ reset)

```bash
# ที่ root โฟลเดอร์
node seed.js
```

---

## 🗄️ ฐานข้อมูล MongoDB Atlas

- **Database:** `my-ecommerce`
- **Collections:** `users`, `cafe`, `cafe-tables`, `board-games`, `cafe-games`, `meetup`, `booking`, `payment`
- ข้อมูลนำเข้ามาจาก `first-meet-dbs` repository

## 🌐 API Endpoints

| Method | Endpoint | คำอธิบาย |
|--------|----------|-----------|
| GET | `/api/meetups` | ดูตี้ทั้งหมด (filter: `?status=`, `?category=`) |
| GET | `/api/meetups/:id` | รายละเอียดตี้ |
| POST | `/api/meetups` | สร้างตี้ใหม่ |
| GET | `/api/cafes` | ดูคาเฟ่ทั้งหมด |
| GET | `/api/cafes/:id` | รายละเอียดคาเฟ่ (พร้อมโต๊ะ+เกม) |
| GET | `/api/games` | ดูบอร์ดเกมทั้งหมด |
| GET | `/api/bookings` | ดูการจอง (filter: `?player_id=`) |
| POST | `/api/bookings` | เข้าร่วมตี้ + mock payment |
| GET | `/api/dashboard/:cafe_id` | แดชบอร์ดร้านคาเฟ่ |
| GET | `/api/users` | ดูผู้ใช้ทั้งหมด (สำหรับ demo login) |
| POST | `/api/auth/login` | เข้าสู่ระบบ (mock) |

## 🎮 ฟีเจอร์หลัก

1. **หน้าแรก** — Hero section + สถิติ + ตี้กำลังรับ
2. **ตี้ทั้งหมด** — กรองตามสถานะ/หมวดเกม, ดูรายละเอียด
3. **คาเฟ่** — รายชื่อคาเฟ่, ดูโต๊ะ+เกมที่มี
4. **เข้าร่วมตี้** — Mock Payment ฿150 บาท (auto-confirm)
5. **สร้างตี้** — เลือกคาเฟ่, เวลา, ประเภท (Specific/Open)
6. **การจองของฉัน** — ดูประวัติพร้อม Booking Code
7. **แดชบอร์ดร้าน** — สำหรับ Staff/Owner ดูการจองทั้งหมด
