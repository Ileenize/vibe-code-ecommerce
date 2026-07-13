const mongoose = require('mongoose');
const { Schema } = mongoose;

// 1. User Model
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['player', 'staff', 'owner_cafe'], default: 'player' },
  cafe_id: { type: Schema.Types.ObjectId, ref: 'Cafe', default: null },
  created_at: { type: Date, default: Date.now }
}, { collection: 'users' });

// 2. Cafe Model
const CafeSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  operating_hours: [{ type: String }]
}, { collection: 'cafe' });

// 3. CafeTable Model
const CafeTableSchema = new Schema({
  cafe_id: { type: Schema.Types.ObjectId, ref: 'Cafe', required: true },
  table_number: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'out_of_service'], default: 'available' }
}, { collection: 'cafe-tables' });

// 4. BoardGame Model
const BoardGameSchema = new Schema({
  title: { type: String, required: true },
  min_players: { type: Number, required: true },
  max_players: { type: Number, required: true },
  duration_minutes: { type: Number },
  category: { type: String },
  complexity: { type: String }
}, { collection: 'board-games' });

// 5. CafeGame Model
const CafeGameSchema = new Schema({
  cafe_id: { type: Schema.Types.ObjectId, ref: 'Cafe', required: true },
  game_id: { type: Schema.Types.ObjectId, ref: 'BoardGame', required: true },
  condition: { type: String },
  is_available: { type: Boolean, default: true }
}, { collection: 'cafe-games' });

// 6. Meetup Model
const MeetupSchema = new Schema({
  host_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cafe_id: { type: Schema.Types.ObjectId, ref: 'Cafe', required: true },
  table_id: { type: Schema.Types.ObjectId, ref: 'CafeTable', default: null },
  game_id: { type: Schema.Types.ObjectId, ref: 'BoardGame', default: null },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['specific', 'open'], required: true },
  date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  min_players: { type: Number, required: true },
  max_players: { type: Number, required: true },
  current_players: { type: Number, default: 1 },
  status: { type: String, enum: ['recruiting', 'confirmed', 'completed', 'cancelled'], default: 'recruiting' }
}, { collection: 'meetup' });

// 7. Booking Model
const BookingSchema = new Schema({
  meetup_id: { type: Schema.Types.ObjectId, ref: 'Meetup', required: true },
  player_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  booking_code: { type: String, required: true },
  status: { type: String, enum: ['pending_payment', 'confirmed', 'checked_in', 'completed', 'flaked', 'cancelled'], default: 'pending_payment' },
  created_at: { type: Date, default: Date.now }
}, { collection: 'booking' });

// 8. Payment Model
const PaymentSchema = new Schema({
  booking_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['successful', 'pending', 'forfeited', 'refunded'], default: 'pending' },
  transaction_id: { type: String, default: null },
  paid_at: { type: Date, default: null }
}, { collection: 'payment' });

module.exports = {
  User: mongoose.model('User', UserSchema),
  Cafe: mongoose.model('Cafe', CafeSchema),
  CafeTable: mongoose.model('CafeTable', CafeTableSchema),
  BoardGame: mongoose.model('BoardGame', BoardGameSchema),
  CafeGame: mongoose.model('CafeGame', CafeGameSchema),
  Meetup: mongoose.model('Meetup', MeetupSchema),
  Booking: mongoose.model('Booking', BookingSchema),
  Payment: mongoose.model('Payment', PaymentSchema)
};
