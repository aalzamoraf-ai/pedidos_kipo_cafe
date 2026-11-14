const WA_NUMBER = '525528483182';
// Horario en minutos desde medianoche. 0 = domingo.
const HOURS = { 0: null, 1: [480, 1260], 2: [480, 1260], 3: [480, 1260], 4: [480, 1260], 5: [480, 1260], 6: [540, 1140] };
const $ = (s) => document.querySelector(s);
const money = (n) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
const cart = new Map();
let toastTimer;

function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('on'), 1400); }

/* ---------- Menú ---------- */
function cardHTML(p) {
  const sizes = p.sizes.length > 1
    ? `<div class="sizes">${p.sizes.map((s, i) => `<button type="button" class="chip ${i ? '' : 'on'}" data-size="${s.id}">${s.label} · ${money(s.price)}</button>`).join('')}</div>` : '';
  const custom = p.custom ? `<details><summary>Personaliza tu bebida</summary>
    <label>Leche<select class="milk">${EXTRAS.milks.map((m) => `<option value="${m.id}">${m.label}${m.price ? ` (+${money(m.price)})` : ''}</option>`).join('')}</select></label>
    <label>Jarabe<select class="syrup"><option value="">Sin jarabe</option>${EXTRAS.syrups.map((s) => `<option value="${s.id}">${s.label} (+${money(s.price)})</option>`).join('')}</select></label>
    <label>Shots extra (+${money(EXTRAS.shot.price)} c/u)<select class="shots">${Array.from({ length: EXTRAS.shot.max + 1 }, (_, n) => `<option>${n}</option>`).join('')}</select></label></details>` : '';
  return `<article class="card" data-id="${p.id}">
    <div class="imgwrap"><img src="/${p.id}.jpg" alt="${p.name}" loading="lazy">
      ${p.seasonal ? '<span class="badge">Por temporada</span>' : ''}${p.available ? '' : '<span class="badge off">Agotado</span>'}</div>
    <div class="cbody"><h3>${p.name}</h3><p class="desc">${p.desc}</p>${sizes}${custom}
    <button type="button" class="btn add" ${p.available ? '' : 'disabled'}></button></div></article>`;
}
function selection(card) {
  const p = PRODUCTS.find((x) => x.id === card.dataset.id);
  const size = p.sizes.find((s) => s.id === (card.querySelector('.chip.on')?.dataset.size || p.sizes[0].id));
  let price = size.price; const extras = [];
  if (p.custom) {
    const m = EXTRAS.milks.find((x) => x.id === card.querySelector('.milk').value);
    const sy = EXTRAS.syrups.find((x) => x.id === card.querySelector('.syrup').value);
    const sh = Number(card.querySelector('.shots').value);
    price += m.price + (sy ? sy.price : 0) + sh * EXTRAS.shot.price;
    if (m.id !== 'normal') extras.push('Leche ' + m.label.toLowerCase());
    if (sy) extras.push('Jarabe ' + sy.label.toLowerCase());
    if (sh) extras.push(sh + ' shot(s) extra');
  }
  return { p, size, price, extras, key: [p.id, size.id, extras.join('+')].join('|') };
}
function refreshCard(card) {
  const s = selection(card);
  card.querySelector('.add').textContent = s.p.available ? `Agregar · ${money(s.price)}` : 'No disponible';
}
function buildMenu() {
  $('#tabs').innerHTML = CATEGORIES.map((c) => `<a href="#cat-${c.id}">${c.name}</a>`).join('');
  $('#menu').innerHTML = CATEGORIES.map((c) => `<section class="cat" id="cat-${c.id}"><h2>${c.name}</h2>${PRODUCTS.filter((p) => p.cat === c.id).map(cardHTML).join('')}</section>`).join('');
  document.querySelectorAll('.card').forEach(refreshCard);
  document.querySelectorAll('.card img').forEach((i) => i.addEventListener('error', () => { i.style.visibility = 'hidden'; }));
}
$('#menu').addEventListener('click', (e) => {
  const card = e.target.closest('.card'); if (!card) return;
  const chip = e.target.closest('.chip');
  if (chip) { card.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === chip)); refreshCard(card); return; }
  if (e.target.closest('.add')) {
    const s = selection(card);
    const line = cart.get(s.key);
    line ? line.qty++ : cart.set(s.key, { name: s.p.name, size: s.size.label, extras: s.extras, price: s.price, qty: 1 });
    renderCart(); toast('Agregado ✓');
  }
});
$('#menu').addEventListener('change', (e) => { const c = e.target.closest('.card'); if (c) refreshCard(c); });

/* ---------- Carrito ---------- */
const cartTotal = () => [...cart.values()].reduce((s, l) => s + l.qty * l.price, 0);
function renderCart() {
  const list = $('#cartList');
  list.innerHTML = [...cart.entries()].map(([k, l]) => `<li class="line" data-key="${k}">
    <div><strong>${l.name}</strong> (${l.size})${l.extras.length ? `<small>${l.extras.join(' · ')}</small>` : ''}<small>${money(l.price)} c/u</small></div>
    <div class="qty"><button type="button" data-act="dec" aria-label="Quitar uno">−</button><span>${l.qty}</span><button type="button" data-act="inc" aria-label="Agregar uno">+</button></div>
    <div class="sub"><span>Subtotal</span><span>${money(l.qty * l.price)}</span><button type="button" class="rm" data-act="rm">Eliminar</button></div></li>`).join('');
  $('#cartEmpty').hidden = cart.size > 0;
  $('#total').textContent = money(cartTotal());
  const n = [...cart.values()].reduce((s, l) => s + l.qty, 0);
  const bar = $('#bar'); bar.hidden = n === 0; bar.textContent = `🛒 Ver mi pedido (${n}) · ${money(cartTotal())}`;
}
$('#cartList').addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const key = b.closest('.line').dataset.key, l = cart.get(key);
  if (b.dataset.act === 'inc') l.qty++;
  else if (b.dataset.act === 'dec') { l.qty--; if (l.qty <= 0) cart.delete(key); }
  else cart.delete(key);
  renderCart();
});

/* ---------- Formulario ---------- */
const pad = (n) => String(n).padStart(2, '0');
const d0 = new Date(); $('#date').min = `${d0.getFullYear()}-${pad(d0.getMonth() + 1)}-${pad(d0.getDate())}`;
const mode = () => document.querySelector('input[name=mode]:checked').value;
document.querySelectorAll('input[name=mode]').forEach((r) => r.addEventListener('change', () => { $('#deliveryBox').hidden = mode() !== 'delivery'; }));

function checkSchedule(date, time) {
  const [y, m, d] = date.split('-').map(Number);
  const h = HOURS[new Date(y, m - 1, d).getDay()];
  if (!h) return ['date', 'Los domingos estamos cerrados. Elige otro día.'];
  const [hh, mm] = time.split(':').map(Number), t = hh * 60 + mm;
  if (t < h[0] || t > h[1]) return ['time', `Ese día atendemos de ${fmtH(h[0])} a ${fmtH(h[1])}.`];
  return null;
}
const fmtH = (m) => { const h = Math.floor(m / 60); return `${h % 12 || 12}:${pad(m % 60)} ${h < 12 ? 'am' : 'pm'}`; };

function validate() {
  const e = {}, v = (id) => $('#' + id).value.trim();
  if (v('name').length < 2) e.name = 'Escribe tu nombre.';
  if (v('phone').replace(/\D/g, '').length < 10) e.phone = 'Escribe un teléfono de 10 dígitos.';
  if (mode() === 'delivery' && v('address').length < 5) e.address = 'La dirección es obligatoria para delivery.';
  if (!v('date')) e.date = 'Elige una fecha.';
  if (!v('time')) e.time = 'Elige una hora.';
  if (v('date') && v('time')) {
    if (v('date') < $('#date').min) e.date = 'La fecha no puede ser pasada.';
    else { const s = checkSchedule(v('date'), v('time')); if (s) e[s[0]] = s[1]; }
  }
  document.querySelectorAll('.err').forEach((x) => { x.textContent = e[x.dataset.for] || ''; });
  if (!cart.size) { toast('Agrega al menos un producto'); document.getElementById('menu').scrollIntoView(); return false; }
  const first = Object.keys(e)[0]; if (first) $('#' + first).focus();
  return !first;
}

function buildMessage() {
  const v = (id) => $('#' + id).value.trim();
  const L = ['*Nuevo pedido - Kipo Café*', '', `Cliente: ${v('name')}`, `Teléfono: ${v('phone')}`, '', '*Pedido:*'];
  [...cart.values()].forEach((l, i) => {
    L.push(`${i + 1}. ${l.name} (${l.size})`);
    if (l.extras.length) L.push(`   Extras: ${l.extras.join(', ')}`);
    L.push(`   ${l.qty} x ${money(l.price)} = ${money(l.qty * l.price)}`);
  });
  L.push('', `*Total: ${money(cartTotal())}* (sin envío)`, '');
  if (mode() === 'delivery') { L.push('Modalidad: Delivery (costo de envío por confirmar)', `Dirección: ${v('address')}`); if (v('refs')) L.push(`Referencias: ${v('refs')}`); }
  else L.push('Modalidad: Recojo en local');
  L.push(`Fecha y hora: ${v('date').split('-').reverse().join('/')} ${v('time')}`);
  if (v('notes')) L.push(`Indicaciones: ${v('notes')}`);
  return L.join('\n');
}

$('#form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
  window.open(url, '_blank', 'noopener') || (location.href = url);
});

/* ---------- Navegación: pestaña activa ---------- */
const io = new IntersectionObserver((es) => es.forEach((en) => {
  if (en.isIntersecting) document.querySelectorAll('.tabs a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-20% 0px -70% 0px' });

buildMenu(); renderCart();
document.querySelectorAll('.cat').forEach((s) => io.observe(s));
