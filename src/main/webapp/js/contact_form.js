// El JavaScript consume endpoints HTTP; nunca se conecta directamente a MySQL.
const mensaje = document.querySelector("#form-feedback");
const API = "api";
async function solicitar(ruta, datos = null) {
  const opciones = datos
    ? { method: "POST", body: new URLSearchParams(datos) }
    : {};
  const r = await fetch(`${API}/${ruta}`, opciones);
  if (!r.ok) throw new Error(`Error HTTP ${r.status}`);
  return r.json();
}

async function ejecutar(accion) {
  try {
    mensaje.textContent = "¡Gracias! Hemos recibido su mensaje. Nos pondremos en contacto muy pronto.";
    await accion();
  } catch (e) {
    mensaje.textContent = "No se pudo completar la operación: " + e.message;
    console.error(e);
  }
  mensaje.classList.remove("hidden")
}
document.querySelector("#contact-form").onsubmit = async (e) => {
  e.preventDefault();
  const name = document.querySelector("#name")
  const phone = document.querySelector("#phone");
  const email = document.querySelector("#email");
  const service = document.querySelector("#service");
  const message = document.querySelector("#message");
  await ejecutar(async () => {
    await solicitar("contact_form", {
      name: name.value,
      phone: phone.value,
      email: email.value,
      service: service.value,
      message: message.value,
    });
    name.value = "";
    phone.value = "";
    email.value = "";
    service.value = "";
    message.value = "";
  });
};


const WHATSAPP_NUMBER = '573001234567'; // ← cambiar por el número real (sin + ni espacios)


/* ---------- Alternativa por WhatsApp ---------- */
document.getElementById('wa-send').addEventListener('click', () => {
  const d = Object.fromEntries(new FormData(form).entries());
  const lines = [
    'Hola, soy ' + d.name + '. Mi teléfono es ' + d.phone + '.',
    'Mi email es ' + d.email + '.',
    d.service ? 'Servicio: ' + d.service : '',
    'Problema: ' + d.message
  ].filter(Boolean);
  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
});

/* ---------- Indicador "Abierto / Cerrado" (hora de Bogotá) ---------- */
const schedule = { 0: null, 1: [7, 18], 2: [7, 18], 3: [7, 18], 4: [7, 18], 5: [7, 18], 6: [7, 14] };

function updateOpenStatus() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const hour = parseInt(get('hour'), 10) % 24 + parseInt(get('minute'), 10) / 60;
  const slot = schedule[day];
  const open = !!slot && hour >= slot[0] && hour < slot[1];

  const dot = document.getElementById('open-dot');
  const text = document.getElementById('open-text');
  dot.className = 'w-2 h-2 rounded-full ' + (open ? 'bg-emerald-400' : 'bg-red-500');
  text.textContent = open ? 'Abierto ahora' : 'Cerrado ahora';
  text.parentElement.className = 'inline-flex items-center gap-2 text-[11px] font-heading tracking-widest uppercase ' +
      (open ? 'text-emerald-300' : 'text-gray-400');

  // Resalta la fila del día actual
  document.querySelectorAll('[data-days]').forEach(row => {
    const isToday = row.dataset.days.split(',').map(Number).includes(day);
    row.classList.toggle('border-l-2', isToday);
    row.classList.toggle('border-brand-orange', isToday);
    row.classList.toggle('pl-3', isToday);
  });
}
updateOpenStatus();
setInterval(updateOpenStatus, 60000);
