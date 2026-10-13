const express = require('express');
const helmet = require('helmet');
const path = require('node:path');
const { validateReservation } = require('./validation');

function createApp(pool) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '16kb' }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'saigon-bistro' }));
  app.get('/ready', async (_req, res) => {
    try { await pool.query('SELECT 1'); res.json({ status: 'ready', database: 'connected' }); }
    catch (_err) { res.status(503).json({ status: 'unavailable', database: 'disconnected' }); }
  });
  app.get('/api/menu', (_req, res) => res.json({ items: [
    { id: 1, name: 'Phở Bò Đặc Biệt', price: 79000, category: 'Món chính', emoji: '🍜' },
    { id: 2, name: 'Cơm Tấm Sườn Bì', price: 69000, category: 'Món chính', emoji: '🍛' },
    { id: 3, name: 'Gỏi Cuốn Tôm Thịt', price: 49000, category: 'Khai vị', emoji: '🥗' },
    { id: 4, name: 'Bánh Mì Sài Gòn', price: 39000, category: 'Món chính', emoji: '🥖' },
    { id: 5, name: 'Cà Phê Sữa Đá', price: 35000, category: 'Thức uống', emoji: '☕' },
    { id: 6, name: 'Chè Ba Màu', price: 39000, category: 'Tráng miệng', emoji: '🍨' }
  ] }));
  app.post('/api/reservations', async (req, res) => {
    const result = validateReservation(req.body);
    if (result.error) return res.status(400).json({ error: result.error });
    const { guestName, email, phone, guests, reservedAt, note } = result.value;
    try {
      const db = await pool.query(
        'INSERT INTO reservations (guest_name, email, phone, guests, reserved_at, note) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, reserved_at',
        [guestName, email, phone, guests, reservedAt, note]
      );
      return res.status(201).json({ message: 'Đặt bàn thành công!', reservation: { id: db.rows[0].id, reservedAt: db.rows[0].reserved_at } });
    } catch (err) {
      console.error('Reservation insert failed:', err.message);
      return res.status(503).json({ error: 'Dịch vụ đặt bàn đang tạm gián đoạn.' });
    }
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API không tồn tại.' }));
  return app;
}
module.exports = { createApp };
