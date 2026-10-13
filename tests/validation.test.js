const test = require('node:test');
const assert = require('node:assert/strict');
const { validateReservation } = require('../src/validation');
const base = () => ({ guestName: 'Nguyen Van A', email: 'A@example.com', phone: '0901234567', guests: 3, reservedAt: new Date(Date.now() + 86400000).toISOString() });
test('accepts valid reservation', () => {
  const result = validateReservation(base());
  assert.equal(result.error, undefined);
  assert.equal(result.value.email, 'a@example.com');
});
test('rejects invalid guest count', () => {
  assert.match(validateReservation({ ...base(), guests: 21 }).error, /Số khách/);
});
test('rejects past booking date', () => {
  assert.match(validateReservation({ ...base(), reservedAt: '2020-01-01T12:00:00Z' }).error, /tương lai/);
});
test('rejects invalid email', () => {
  assert.match(validateReservation({ ...base(), email: 'wrong' }).error, /Email/);
});
