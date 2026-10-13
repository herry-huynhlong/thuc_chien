const money = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
async function loadMenu() {
  const target = document.querySelector('#menu-list');
  try {
    const response = await fetch('/api/menu');
    if (!response.ok) throw new Error('Menu unavailable');
    const { items } = await response.json();
    target.replaceChildren(...items.map(item => {
      const card = document.createElement('article'); card.className = 'menu-card';
      const emoji = document.createElement('div'); emoji.className = 'menu-emoji'; emoji.textContent = item.emoji;
      const content = document.createElement('div'); content.className = 'menu-content';
      const category = document.createElement('div'); category.className = 'menu-category'; category.textContent = item.category;
      const title = document.createElement('h3'); title.textContent = item.name;
      const price = document.createElement('div'); price.className = 'price'; price.textContent = money(item.price);
      content.append(category, title, price); card.append(emoji, content); return card;
    }));
  } catch (_err) { target.textContent = 'Chưa tải được thực đơn. Vui lòng thử lại sau.'; }
}
const form = document.querySelector('#booking-form');
const dateInput = document.querySelector('#reservedAt');
function toLocalDatetime(date) {
  const pad = x => String(x).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
dateInput.min = toLocalDatetime(new Date());
form.addEventListener('submit', async e => {
  e.preventDefault();
  const button = document.querySelector('#submit-booking');
  const message = document.querySelector('#form-message');
  const data = Object.fromEntries(new FormData(form).entries());
  const timestamp = new Date(data.reservedAt);
  if (!Number.isFinite(timestamp.getTime())) { message.textContent = 'Thời gian đặt bàn không hợp lệ.'; return; }
  data.reservedAt = timestamp.toISOString();
  button.disabled = true; message.textContent = 'Đang gửi yêu cầu...';
  try {
    const response = await fetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Không thể đặt bàn.');
    message.textContent = `✓ ${result.message} Mã đặt bàn: ${result.reservation.id}`;
    message.style.color = '#267444'; form.reset();
  } catch (err) { message.textContent = err.message; message.style.color = '#b43b30'; }
  finally { button.disabled = false; dateInput.min = toLocalDatetime(new Date()); }
});
loadMenu();
