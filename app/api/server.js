require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from app/web
app.use(express.static(path.join(__dirname, '..', 'web')));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import models
const { Meetup, Cafe, BoardGame, CafeGame, Booking, Payment, User, CafeTable } = require('./models');

// =====================
// ROUTES
// =====================

// --- MEETUPS ---
// GET all meetups (with populate for display)
app.get('/api/meetups', async (req, res) => {
  try {
    const { status, cafe_id, category } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (cafe_id) filter.cafe_id = cafe_id;

    let meetups = await Meetup.find(filter)
      .populate('cafe_id', 'name address')
      .populate('game_id', 'title category complexity min_players max_players duration_minutes')
      .populate('host_id', 'username')
      .sort({ date: 1 });

    // Filter by category if provided (game category)
    if (category) {
      meetups = meetups.filter(
        (m) => m.game_id && m.game_id.category === category
      );
    }

    res.json({ success: true, data: meetups });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single meetup
app.get('/api/meetups/:id', async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.id)
      .populate('cafe_id', 'name address phone operating_hours')
      .populate('game_id', 'title category complexity min_players max_players duration_minutes')
      .populate('host_id', 'username');
    if (!meetup) return res.status(404).json({ success: false, error: 'Meetup not found' });
    res.json({ success: true, data: meetup });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create a meetup
app.post('/api/meetups', async (req, res) => {
  try {
    const meetup = new Meetup(req.body);
    await meetup.save();
    res.status(201).json({ success: true, data: meetup });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- CAFES ---
app.get('/api/cafes', async (req, res) => {
  try {
    const cafes = await Cafe.find({});
    res.json({ success: true, data: cafes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET cafe detail with tables and games
app.get('/api/cafes/:id', async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) return res.status(404).json({ success: false, error: 'Cafe not found' });

    const tables = await CafeTable.find({ cafe_id: req.params.id });
    const cafeGames = await CafeGame.find({ cafe_id: req.params.id, is_available: true })
      .populate('game_id', 'title category complexity min_players max_players duration_minutes');

    res.json({
      success: true,
      data: {
        ...cafe.toObject(),
        tables,
        games: cafeGames.map((cg) => cg.game_id)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- BOARD GAMES ---
app.get('/api/games', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) filter.category = category;
    const games = await BoardGame.find(filter);
    res.json({ success: true, data: games });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- BOOKINGS ---
// GET bookings by player
app.get('/api/bookings', async (req, res) => {
  try {
    const { player_id, meetup_id } = req.query;
    let filter = {};
    if (player_id) filter.player_id = player_id;
    if (meetup_id) filter.meetup_id = meetup_id;

    const bookings = await Booking.find(filter)
      .populate({
        path: 'meetup_id',
        populate: [
          { path: 'cafe_id', select: 'name address' },
          { path: 'game_id', select: 'title category' }
        ]
      })
      .sort({ created_at: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST join meetup (create booking + mock payment)
app.post('/api/bookings', async (req, res) => {
  try {
    const { meetup_id, player_id, username } = req.body;

    const meetup = await Meetup.findById(meetup_id);
    if (!meetup) return res.status(404).json({ success: false, error: 'Meetup not found' });
    if (meetup.status !== 'recruiting')
      return res.status(400).json({ success: false, error: 'Meetup is not open for joining' });
    if (meetup.current_players >= meetup.max_players)
      return res.status(400).json({ success: false, error: 'Meetup is full' });

    // Check if player already joined
    const existing = await Booking.findOne({ meetup_id, player_id });
    if (existing)
      return res.status(400).json({ success: false, error: 'You have already joined this meetup' });

    const bookingCode = `MFG-${meetup_id.toString().slice(-4).toUpperCase()}-${Date.now().toString().slice(-5)}`;
    const booking = new Booking({
      meetup_id,
      player_id,
      booking_code: bookingCode,
      status: 'pending_payment'
    });
    await booking.save();

    // Mock payment: auto-confirm
    const payment = new Payment({
      booking_id: booking._id,
      user_id: player_id,
      amount: 150,
      status: 'successful',
      transaction_id: `MOCK-TXN-${Date.now()}`,
      paid_at: new Date()
    });
    await payment.save();

    // Update booking to confirmed
    booking.status = 'confirmed';
    await booking.save();

    // Increment current players
    meetup.current_players += 1;
    if (meetup.current_players >= meetup.min_players) {
      meetup.status = 'confirmed';
    }
    await meetup.save();

    res.status(201).json({ success: true, data: { booking, payment } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- CAFE DASHBOARD ---
// GET all meetups for a cafe with booking stats
app.get('/api/dashboard/:cafe_id', async (req, res) => {
  try {
    const { cafe_id } = req.params;
    const cafe = await Cafe.findById(cafe_id);
    if (!cafe) return res.status(404).json({ success: false, error: 'Cafe not found' });

    const meetups = await Meetup.find({ cafe_id })
      .populate('game_id', 'title')
      .sort({ date: -1 });

    const dashboardData = await Promise.all(
      meetups.map(async (m) => {
        const bookings = await Booking.find({ meetup_id: m._id })
          .populate('player_id', 'username');
        return { ...m.toObject(), bookings };
      })
    );

    res.json({ success: true, cafe, data: dashboardData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- USERS (mock auth) ---
// POST login (simplified mock - no JWT, just returns user data)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: { _id: user._id, username: user.username, role: user.role, cafe_id: user.cafe_id } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all users (for dev demo select)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username role cafe_id');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback: serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'web', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
