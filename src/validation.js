function validateReservation(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { error: 'Dữ liệu không hợp lệ.' };
  const guestName = typeof data.guestName === 'string' ? data.guestName.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const guests = Number(data.guests);
  const note = typeof data.note === 'string' ? data.note.trim() : '';
  const reservedAt = typeof data.reservedAt === 'string' ? data.reservedAt : '';
  if (!guestName || guestName.length > 100) return { error: 'Họ tên phải từ 1 đến 100 ký tự.' };
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Email không hợp lệ.' };
  if (!/^[0-9+().\s-]{8,30}$/.test(phone)) return { error: 'Số điện thoại không hợp lệ.' };
  if (!Number.isInteger(guests) || guests < 1 || guests > 20) return { error: 'Số khách phải từ 1 đến 20.' };
  if (note.length > 500) return { error: 'Ghi chú tối đa 500 ký tự.' };
  const date = new Date(reservedAt);
  if (!reservedAt || !Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) return { error: 'Thời gian đặt bàn phải ở tương lai.' };
  return { value: { guestName, email, phone, guests, note, reservedAt: date.toISOString() } };
}
module.exports = { validateReservation };
