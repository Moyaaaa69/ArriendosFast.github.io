// =====================
//  ARRIENDOS FAST — APP
// =====================

// ---- DATA ----
const ITEMS = [
  { id:1,  nombre:"Taladro Bosch GSB 550W",      cat:"herramientas", ico:"🔧", precio:1000, dep:15000, dist:0.3, rating:4.9, rev:24,  lat:-33.4342, lng:-70.6260, duen:"Carlos M. · Barrio Italia",    desc:"Taladro percutor en excelente estado. Incluye set de brocas para madera y hormigón.",  ok:true  },
  { id:2,  nombre:"Proyector Epson Full HD",      cat:"audio",        ico:"📽️", precio:4000, dep:50000, dist:0.8, rating:4.7, rev:11, lat:-33.4365, lng:-70.6215, duen:"Verónica P. · Ñuñoa",           desc:"Proyector 3000 lúmenes, 1080p. Incluye cable HDMI y mando. Ideal para presentaciones.",  ok:true  },
  { id:3,  nombre:"Carpa para eventos 4×4m",      cat:"eventos",      ico:"🎪", precio:8000, dep:40000, dist:1.1, rating:4.8, rev:9,  lat:-33.4320, lng:-70.6290, duen:"Rodrigo A. · Las Condes",       desc:"Carpa tipo pagoda impermeable 4×4m. Perfecta para cumpleaños al aire libre.",           ok:true  },
  { id:4,  nombre:"Sierra circular DeWalt 7\"",   cat:"herramientas", ico:"🪚", precio:1500, dep:20000, dist:0.6, rating:4.6, rev:7,  lat:-33.4380, lng:-70.6240, duen:"Miguel T. · Providencia",       desc:"Sierra circular 1600W, disco para madera incluido.",                                   ok:false },
  { id:5,  nombre:"Parlante JBL Xtreme 3",        cat:"audio",        ico:"🔊", precio:2000, dep:15000, dist:0.4, rating:5.0, rev:18, lat:-33.4355, lng:-70.6275, duen:"Fernanda C. · Manuel Montt",    desc:"Parlante bluetooth portátil resistente al agua. 15 horas de batería.",                 ok:true  },
  { id:6,  nombre:"Mesa + 8 sillas plegables",    cat:"eventos",      ico:"🪑", precio:3500, dep:20000, dist:1.5, rating:4.4, rev:6,  lat:-33.4395, lng:-70.6205, duen:"Patricia L. · Macul",           desc:"Mesa rectangular 180cm + 8 sillas. Para reuniones o cumpleaños.",                      ok:true  },
  { id:7,  nombre:"Nivel láser Bosch Quigo",      cat:"herramientas", ico:"📏", precio:800,  dep:10000, dist:0.7, rating:4.9, rev:15, lat:-33.4335, lng:-70.6300, duen:"Andrés V. · Pedro de Valdivia", desc:"Nivel láser de líneas cruzadas. Perfecto para colgar cuadros o nivelar muebles.",      ok:true  },
  { id:8,  nombre:"Carpa camping 3 personas",     cat:"camping",      ico:"⛺", precio:2500, dep:18000, dist:1.8, rating:4.3, rev:4,  lat:-33.4310, lng:-70.6230, duen:"Sebastián O. · Irarrázaval",   desc:"Carpa iglú 3 personas, impermeable. Incluye bolso de transporte.",                     ok:true  },
  { id:9,  nombre:"Mezcladora de audio 4ch",      cat:"audio",        ico:"🎚️", precio:3000, dep:25000, dist:1.2, rating:4.7, rev:8, lat:-33.4372, lng:-70.6253, duen:"Diego R. · Ñuñoa",             desc:"Yamaha MG06X, 6 canales. Ideal para fiestas y eventos. Incluye cables XLR.",          ok:true  },
  { id:10, nombre:"Cortadora de pasto eléctrica", cat:"jardin",       ico:"🌿", precio:2000, dep:12000, dist:0.9, rating:4.5, rev:13, lat:-33.4348, lng:-70.6222, duen:"Roberto K. · Ñuñoa",            desc:"Black & Decker 1200W. Ajuste de altura 3 niveles.",                                    ok:false },
  { id:11, nombre:"Decoración luces LED fiesta",  cat:"eventos",      ico:"🎊", precio:1500, dep:8000,  dist:0.5, rating:4.8, rev:22, lat:-33.4328, lng:-70.6270, duen:"Laura M. · Barrio Italia",     desc:"50m de luces LED + 10 globos luminosos + 2 cortinas de luz.",                         ok:true  },
  { id:12, nombre:"Llave de impacto neumática",   cat:"herramientas", ico:"🔩", precio:1200, dep:12000, dist:2.0, rating:4.6, rev:5,  lat:-33.4390, lng:-70.6285, duen:"Pablo S. · San Joaquín",       desc:"Llave de impacto 1/2\", 680Nm. Ideal para cambio de ruedas.",                         ok:true  },
];

const CAT_LABELS = {
  herramientas:"🔨 Herramientas",
  eventos:"🎉 Eventos",
  audio:"🔊 Audio",
  camping:"🏕️ Camping",
  jardin:"🌿 Jardín",
};

// ---- STATE ----
let catActual = 'todos';
let queryActual = '';
let horasModal = 1;
let itemModal = null;
let mapExplora = null;
let mapFull = null;
let vistaActual = 'list';
let tabActual = 'explorar';

// ---- SPLASH ----
window.addEventListener('load', () => {
  updateClock();
  setInterval(updateClock, 10000);

  setTimeout(() => {
    document.getElementById('splash').classList.add('hide');
    document.getElementById('appContent').style.display = 'block';
    document.getElementById('bottomNav').style.display = 'flex';
    renderList();
    setTimeout(() => initMaps(), 300);
  }, 2000);
});

function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2,'0');
  const m = now.getMinutes().toString().padStart(2,'0');
  document.getElementById('statusTime').textContent = `${h}:${m}`;
}

// ---- FILTRADO ----
function getFiltered() {
  return ITEMS.filter(it => {
    const matchCat = catActual === 'todos' || it.cat === catActual;
    const q = queryActual.toLowerCase();
    const matchQ = !q || it.nombre.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
}

// ---- RENDER LIST ----
function renderList() {
  const items = getFiltered();
  const scroll = document.getElementById('listScroll');
  document.getElementById('vtCount').textContent = `${items.length} objeto${items.length!==1?'s':''}`;
  scroll.innerHTML = '';

  if (!items.length) {
    scroll.innerHTML = `<div class="empty-state"><span class="ei">🔍</span><h3>Sin resultados</h3><p>Prueba otra categoría</p></div>`;
    return;
  }

  items.forEach((it, i) => {
    const card = document.createElement('div');
    card.className = 'lcard';
    card.style.animationDelay = `${i * 0.05}s`;
    card.onclick = () => abrirModal(it.id);
    card.innerHTML = `
      <div class="lcard-img">${it.ico}</div>
      <div class="lcard-body">
        <div class="lcard-cat">${CAT_LABELS[it.cat]||it.cat}</div>
        <div class="lcard-name">${it.nombre}</div>
        <div class="lcard-loc">📍 ${it.dist}km · ${it.duen.split('·')[1]?.trim()||''}</div>
        <div class="lcard-footer">
          <div class="lcard-price">$${it.precio.toLocaleString('es-CL')}<small>/hora</small></div>
          <div>
            <span class="lcard-badge ${it.ok?'ok':'no'}">${it.ok?'● Disp.':'○ No disp.'}</span>
          </div>
        </div>
      </div>`;
    scroll.appendChild(card);
  });
}

// ---- RENDER SHEET (mini cards en mapa explorar) ----
function renderSheet(items) {
  const sheet = document.getElementById('sheetScroll');
  sheet.innerHTML = '';
  items.forEach(it => {
    const mc = document.createElement('div');
    mc.className = 'mcard';
    mc.onclick = () => abrirModal(it.id);
    mc.innerHTML = `
      <span class="mcard-icon">${it.ico}</span>
      <div class="mcard-name">${it.nombre}</div>
      <div class="mcard-price">$${it.precio.toLocaleString('es-CL')}/hr</div>
      <div class="mcard-dist">📍 ${it.dist}km</div>`;
    sheet.appendChild(mc);
  });
}

// ---- INIT MAPS ----
function initMaps() {
  // Centro: Barrio Italia, Santiago
  const center = [-33.4355, -70.6260];

  // Mapa en tab explorar
  if (!mapExplora) {
    mapExplora = L.map('leafletMap', {
      center, zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapExplora);
    agregarMarcadores(mapExplora);
  }

  // Mapa completo en tab mapa
  if (!mapFull) {
    mapFull = L.map('fullMap', {
      center, zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapFull);
    agregarMarcadores(mapFull, true);

    // Marcador "Tú estás aquí"
    const youIcon = L.divIcon({
      className: '',
      html: `<div style="width:18px;height:18px;background:#4e8cff;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 6px rgba(78,140,255,0.25)"></div>`,
      iconSize: [18,18], iconAnchor: [9,9],
    });
    L.marker(center, { icon: youIcon }).addTo(mapFull)
      .bindPopup('<div style="color:#0d0c0a;font-weight:700;font-size:13px">📍 Tú estás aquí</div>');
  }

  renderSheet(getFiltered());
}

function agregarMarcadores(map, withYou = false) {
  ITEMS.forEach(it => {
    const icon = L.divIcon({
      className: '',
      html: `<div class="custom-marker" style="${it.ok?'':'opacity:0.5;filter:grayscale(1)'}">
               <span class="marker-inner">${it.ico}</span>
             </div>`,
      iconSize: [28,28],
      iconAnchor: [14,28],
      popupAnchor: [0,-30],
    });
    const marker = L.marker([it.lat, it.lng], { icon }).addTo(map);
    marker.bindPopup(`
      <div class="popup-name">${it.nombre}</div>
      <div class="popup-price">$${it.precio.toLocaleString('es-CL')}/hora</div>
      <div class="popup-loc">📍 ${it.dist}km · ${it.duen.split('·')[1]?.trim()||''}</div>
      <button class="popup-btn" onclick="abrirModal(${it.id})">
        ${it.ok ? 'Arrendar ahora →' : 'No disponible'}
      </button>
    `);
  });
}

// ---- TABS ----
function setTab(name, el) {
  tabActual = name;
  document.querySelectorAll('.tab-view').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  el.classList.add('active');

  if (name === 'mapa') {
    setTimeout(() => mapFull && mapFull.invalidateSize(), 100);
  }
  if (name === 'arriendos') {
    renderArriendos();
  }
  if (name === 'mensajes') {
    renderMensajes();
  }
}

// ---- VISTA LISTA/MAPA ----
function setVista(v) {
  vistaActual = v;
  const listView = document.getElementById('listView');
  const mapView = document.getElementById('mapView');
  document.getElementById('btnList').classList.toggle('active', v==='list');
  document.getElementById('btnMap').classList.toggle('active', v==='map');

  if (v === 'list') {
    listView.style.display = '';
    mapView.style.display = 'none';
  } else {
    listView.style.display = 'none';
    mapView.style.display = 'flex';
    renderSheet(getFiltered());
    setTimeout(() => mapExplora && mapExplora.invalidateSize(), 100);
  }
}

// ---- CATEGORÍA ----
function setCategoria(el, cat) {
  catActual = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderList();
  if (vistaActual === 'map') renderSheet(getFiltered());
}

// ---- BÚSQUEDA ----
document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('searchInput');
  const clr = document.getElementById('searchClear');
  if (!inp) return;
  inp.addEventListener('input', () => {
    queryActual = inp.value;
    clr.classList.toggle('show', !!inp.value);
    renderList();
    if (vistaActual === 'map') renderSheet(getFiltered());
  });
});

function limpiarBusqueda() {
  const inp = document.getElementById('searchInput');
  inp.value = '';
  queryActual = '';
  document.getElementById('searchClear').classList.remove('show');
  renderList();
  if (vistaActual === 'map') renderSheet(getFiltered());
}

// ---- MODAL ----
function abrirModal(id) {
  itemModal = ITEMS.find(i => i.id === id);
  if (!itemModal) return;
  horasModal = 1;

  const c = document.getElementById('bsmContent');
  c.innerHTML = `
    <span class="bsm-emoji">${itemModal.ico}</span>
    <div class="bsm-title">${itemModal.nombre}</div>
    <div class="bsm-owner">📍 ${itemModal.duen} · ${itemModal.dist}km</div>
    <p class="bsm-desc">${itemModal.desc}</p>
    <div class="bsm-grid">
      <div class="bsm-cell">
        <span class="bsm-cell-label">Precio / hora</span>
        <span class="bsm-cell-val">$${itemModal.precio.toLocaleString('es-CL')}</span>
      </div>
      <div class="bsm-cell">
        <span class="bsm-cell-label">Depósito garantía</span>
        <span class="bsm-cell-val">$${itemModal.dep.toLocaleString('es-CL')}</span>
      </div>
      <div class="bsm-cell">
        <span class="bsm-cell-label">Calificación</span>
        <span class="bsm-cell-val">⭐ ${itemModal.rating}</span>
      </div>
      <div class="bsm-cell">
        <span class="bsm-cell-label">Arriendos</span>
        <span class="bsm-cell-val">${itemModal.rev} exitosos</span>
      </div>
    </div>
    <div class="guarantee-note">
      Depósito retenido temporalmente en tu tarjeta. Se libera al confirmar devolución. Si hay daños, el dueño recibe compensación automática.
    </div>
    <div class="hours-section">
      <span class="hours-label">¿Cuántas horas necesitas?</span>
      <div class="hours-ctrl">
        <button class="h-btn" onclick="cambiarHoras(-1)">−</button>
        <div class="h-val" id="hVal">1 hora</div>
        <button class="h-btn" onclick="cambiarHoras(1)">+</button>
      </div>
    </div>
    <div class="total-box">
      <div class="total-left">
        <label>Total arriendo</label>
        <small>+ depósito $${itemModal.dep.toLocaleString('es-CL')} (retenido)</small>
      </div>
      <div class="total-right" id="totalVal">$${itemModal.precio.toLocaleString('es-CL')}</div>
    </div>
    <button class="btn-confirm" ${itemModal.ok?'':'disabled style="opacity:.5;cursor:not-allowed"'}
      onclick="${itemModal.ok?'confirmarArriendo()':'mostrarToast(\'Este objeto no está disponible\')'}">
      ${itemModal.ok ? 'Confirmar y pagar 🔒' : 'No disponible ahora'}
    </button>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cambiarHoras(d) {
  if (!itemModal) return;
  horasModal = Math.max(1, Math.min(72, horasModal + d));
  const label = horasModal === 1 ? '1 hora' : `${horasModal} horas`;
  document.getElementById('hVal').textContent = label;
  document.getElementById('totalVal').textContent = `$${(itemModal.precio * horasModal).toLocaleString('es-CL')}`;
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  itemModal = null;
}

function confirmarArriendo() {
  if (!itemModal) return;
  const total = itemModal.precio * horasModal;
  const nombre = itemModal.nombre;
  const idx = ITEMS.findIndex(i => i.id === itemModal.id);
  if (idx !== -1) ITEMS[idx].ok = false;
  cerrarModal();
  renderList();
  if (vistaActual === 'map') renderSheet(getFiltered());
  mostrarToast(`✅ ¡Reservado! Pagaste $${total.toLocaleString('es-CL')} por ${nombre}`);
}

// ---- PUBLICAR ----
function publicarObjeto() {
  const nombre = document.getElementById('pNombre').value.trim();
  const cat    = document.getElementById('pCategoria').value;
  const precio = parseInt(document.getElementById('pPrecio').value);
  const dep    = parseInt(document.getElementById('pDeposito').value) || 0;
  const desc   = document.getElementById('pDesc').value.trim();
  const dir    = document.getElementById('pDir').value.trim();

  if (!nombre) { mostrarToast('⚠️ Ingresa el nombre del objeto'); return; }
  if (!cat)    { mostrarToast('⚠️ Selecciona una categoría'); return; }
  if (!precio || precio < 100) { mostrarToast('⚠️ Precio mínimo $100'); return; }

  const icos = { herramientas:'🔧', eventos:'🎊', audio:'🔊', camping:'⛺', jardin:'🌿' };
  const nuevo = {
    id: ITEMS.length + 100,
    nombre, cat,
    ico: icos[cat]||'📦',
    precio,
    dep: dep || precio * 5,
    dist: parseFloat((Math.random()*1.5+0.2).toFixed(1)),
    rating: 5.0, rev: 0,
    lat: -33.4355 + (Math.random()-0.5)*0.02,
    lng: -70.6260 + (Math.random()-0.5)*0.02,
    duen: `Tú · ${dir||'Tu barrio'}`,
    desc: desc || 'Sin descripción.',
    ok: true,
  };
  ITEMS.unshift(nuevo);

  // Limpiar form
  ['pNombre','pPrecio','pDeposito','pDesc','pDir'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('pCategoria').value = '';

  // Añadir al mapa si existe
  if (mapExplora) {
    const icon = L.divIcon({
      className:'',
      html:`<div class="custom-marker"><span class="marker-inner">${nuevo.ico}</span></div>`,
      iconSize:[28,28], iconAnchor:[14,28], popupAnchor:[0,-30],
    });
    L.marker([nuevo.lat, nuevo.lng], {icon}).addTo(mapExplora)
     .bindPopup(`<div class="popup-name">${nuevo.nombre}</div><div class="popup-price">$${nuevo.precio.toLocaleString('es-CL')}/hora</div><button class="popup-btn" onclick="abrirModal(${nuevo.id})">Arrendar →</button>`);
  }
  if (mapFull) {
    const icon2 = L.divIcon({
      className:'',
      html:`<div class="custom-marker"><span class="marker-inner">${nuevo.ico}</span></div>`,
      iconSize:[28,28], iconAnchor:[14,28], popupAnchor:[0,-30],
    });
    L.marker([nuevo.lat, nuevo.lng], {icon:icon2}).addTo(mapFull)
     .bindPopup(`<div class="popup-name">${nuevo.nombre}</div><div class="popup-price">$${nuevo.precio.toLocaleString('es-CL')}/hora</div><button class="popup-btn" onclick="abrirModal(${nuevo.id})">Arrendar →</button>`);
  }

  // Actualizar perfil mis publicaciones
  actualizarMisPubs();

  catActual = 'todos';
  renderList();
  setTab('explorar', document.querySelector('[data-tab="explorar"]'));
  mostrarToast(`🚀 "${nombre}" publicado con éxito`);
}

function actualizarMisPubs() {
  const misPubs = document.getElementById('misPubs');
  const propios = ITEMS.filter(i => i.duen.startsWith('Tú'));
  if (!propios.length) {
    misPubs.innerHTML = '<div class="empty-pubs">Aún no has publicado objetos</div>';
    return;
  }
  misPubs.innerHTML = propios.map(it => `
    <div class="lcard" style="margin-bottom:10px" onclick="abrirModal(${it.id})">
      <div class="lcard-img">${it.ico}</div>
      <div class="lcard-body">
        <div class="lcard-cat">${CAT_LABELS[it.cat]||it.cat}</div>
        <div class="lcard-name">${it.nombre}</div>
        <div class="lcard-footer">
          <div class="lcard-price">$${it.precio.toLocaleString('es-CL')}<small>/hr</small></div>
          <span class="lcard-badge ok">● Activo</span>
        </div>
      </div>
    </div>`).join('');
}

// ---- MIS ARRIENDOS ----
const MIS_ARRIENDOS_DATA = [
  { id:1, ico:'🔧', nombre:'Taladro Bosch GSB 550W', duen:'Carlos M.', desde:'Hoy 10:00', hasta:'Hoy 13:00', progreso:60, restante:'1h 12min restante', precio: 3000 },
  { id:2, ico:'📽️', nombre:'Proyector Epson Full HD', duen:'Verónica P.', desde:'Ayer 15:00', hasta:'Ayer 19:00', progreso:100, restante:'Finalizado', precio: 16000 },
  { id:3, ico:'🎪', nombre:'Carpa para eventos 4×4m', duen:'Rodrigo A.', desde:'12 jun', hasta:'13 jun', progreso:100, restante:'Finalizado', precio: 40000 },
];

function renderArriendos() {
  const cont = document.getElementById('arriendosContent');
  if (!cont) return;
  const activos = MIS_ARRIENDOS_DATA.filter(a => a.progreso < 100);
  const historial = MIS_ARRIENDOS_DATA.filter(a => a.progreso === 100);

  // Propios arrendados también
  const propiosArrendados = ITEMS.filter(i => !i.ok && !i.duen.startsWith('Tú'));

  let html = '';

  // Activos
  if (activos.length) {
    html += `<div class="arr-section-title">En curso</div>`;
    activos.forEach((a, i) => {
      html += `
      <div class="arr-active-card" style="animation-delay:${i*0.07}s">
        <div class="aic-ico">${a.ico}</div>
        <div class="aic-body">
          <div class="aic-name">${a.nombre}</div>
          <div class="aic-meta">📍 ${a.duen} · ${a.desde} → ${a.hasta}</div>
          <div class="aic-progress"><div class="aic-progress-fill" style="width:${a.progreso}%"></div></div>
          <div class="aic-time">⏱ ${a.restante}</div>
          <div class="aic-actions">
            <button class="aic-btn primary" onclick="mostrarToast('📞 Contactando a ${a.duen}…')">Contactar</button>
            <button class="aic-btn secondary" onclick="mostrarToast('🛡️ Garantía protegida')">Garantía</button>
          </div>
        </div>
      </div>`;
    });
  }

  // Historial
  if (historial.length) {
    html += `<div class="arr-section-title" style="margin-top:10px">Historial</div>`;
    historial.forEach((a, i) => {
      html += `
      <div class="hist-item" style="animation-delay:${(activos.length+i)*0.07}s">
        <div class="hist-ico">${a.ico}</div>
        <div class="hist-info">
          <div class="hist-name">${a.nombre}</div>
          <div class="hist-date">${a.desde} — ${a.hasta}</div>
        </div>
        <div class="hist-right">
          <div class="hist-price">$${a.precio.toLocaleString('es-CL')}</div>
          <div class="hist-rating">⭐ 5.0</div>
        </div>
      </div>`;
    });
  }

  if (!activos.length && !historial.length) {
    html = `
    <div class="arr-empty">
      <span class="ae-icon">📋</span>
      <h3>Sin arriendos aún</h3>
      <p>Explora objetos disponibles cerca tuyo y haz tu primer arriendo.</p>
      <button class="arr-empty-btn" onclick="setTab('explorar', document.querySelector('[data-tab=explorar]'))">Explorar ahora ⚡</button>
    </div>`;
  }

  cont.innerHTML = html;
}

// ---- MENSAJES ----
const MENSAJES_DATA = [
  { id:1, ico:'👤', nombre:'Carlos M.', obj:'Taladro Bosch GSB', preview:'Perfecto, lo tendré listo a las 10am', time:'Ahora', unread:2, online:true },
  { id:2, ico:'👤', nombre:'Verónica P.', obj:'Proyector Epson FHD', preview:'¿Puedes extender 1 hora más?', time:'14:32', unread:0, online:false },
  { id:3, ico:'👤', nombre:'Rodrigo A.', obj:'Carpa 4×4m', preview:'Gracias por cuidarla 🙌', time:'Ayer', unread:0, online:false },
  { id:4, ico:'👤', nombre:'Fernanda C.', obj:'Parlante JBL Xtreme', preview:'¿Está disponible este fin de semana?', time:'Lun', unread:0, online:true },
];

function renderMensajes() {
  const list = document.getElementById('mensajesList');
  if (!list) return;
  list.innerHTML = MENSAJES_DATA.map((m, i) => `
    <div class="msg-item" style="animation-delay:${i*0.06}s" onclick="abrirChat(${m.id})">
      <div class="msg-avatar ${m.unread?'unread':''}">
        ${m.ico}
        ${m.online ? '<span class="msg-dot"></span>' : ''}
      </div>
      <div class="msg-body">
        <div class="msg-name">${m.nombre}</div>
        <div class="msg-preview ${m.unread?'bold':''}">${m.preview}</div>
        <span class="msg-obj-tag">${m.obj}</span>
      </div>
      <div class="msg-right">
        <div class="msg-time">${m.time}</div>
        ${m.unread ? `<div class="msg-unread-cnt">${m.unread}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function abrirChat(id) {
  const m = MENSAJES_DATA.find(x => x.id === id);
  if (!m) return;
  // Limpiar badge al abrir
  m.unread = 0;
  const total = MENSAJES_DATA.reduce((s, x) => s + x.unread, 0);
  const badge = document.getElementById('msgBadge');
  if (badge) badge.style.display = total ? 'flex' : 'none';
  renderMensajes();
  mostrarToast(`💬 Chat con ${m.nombre} — próximamente`);
}

// ---- TOAST ----
function mostrarToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._to);
  t._to = setTimeout(() => t.classList.remove('show'), 3500);
}
