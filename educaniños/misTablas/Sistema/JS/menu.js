/* ==========================================================================
   menu.js - Lógica del Hub Principal, Tarjetas de Tablas, Logros y Navegación
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    actualizarDashboardUsuario();
    renderizarGridTablasMenu();
    renderizarLogrosMenu();
});

function actualizarDashboardUsuario() {
    const data = StorageManager.get();
    
    // Si no ha ingresado nombre, redirigir al registro
    if (!data.nombre) {
        window.location.href = '../index.html';
        return;
    }

    const avatarInfo = StorageManager.getAvatarInfo(data.avatarId);
    const avatarContainer = document.getElementById('userAvatarDisplay');
    if (avatarContainer) {
        avatarContainer.innerHTML = `<img src="IMAGEN/${avatarInfo.img}" alt="${avatarInfo.nombre}" class="avatar-header-img" onerror="this.src='../../img/${avatarInfo.img}'">`;
    }

    document.getElementById('userNameDisplay').textContent = data.nombre;
    document.getElementById('userPuntosDisplay').textContent = data.puntos;
    document.getElementById('userEstrellasDisplay').textContent = data.estrellas;

    const progresoTotal = StorageManager.calcularProgresoTotal();
    document.getElementById('userProgresoText').textContent = `${progresoTotal}% Avance`;
}

function cambiarTab(tabId, element) {
    audio.playClick();
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.section-view').forEach(view => view.classList.remove('active'));

    element.classList.add('active');
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) targetView.classList.add('active');

    if (tabId === 'aprender') {
        inicializarModuloTablas();
    }
}

function renderizarGridTablasMenu() {
    const grid = document.getElementById('tablasGridMenu');
    if (!grid) return;
    grid.innerHTML = '';

    const data = StorageManager.get();

    for (let i = 2; i <= 10; i++) {
        const prog = data.tablasProgreso[i] || { completado: false, porcentaje: 0, estrellas: 0 };
        const card = document.createElement('div');
        card.className = 'tabla-card';

        card.innerHTML = `
            <div class="tabla-header">
                <div class="tabla-num">Tabla del ${i}</div>
                <div class="tabla-badge">${prog.completado ? 'Completado ✓' : 'En Avance'}</div>
            </div>
            <div style="font-weight:700; color:#64748b; font-size:0.95rem;">
                Estrellas: ${'⭐'.repeat(prog.estrellas)}${'☆'.repeat(3 - prog.estrellas)}
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${prog.porcentaje}%;"></div>
            </div>
            <div class="tabla-actions">
                <button class="btn-aprender" onclick="abrirTablaEspecifica(${i})">📘 Estudiar Tabla</button>
            </div>
        `;
        grid.appendChild(card);
    }
}

function abrirTablaEspecifica(tablaNum) {
    audio.playClick();
    const btnAprender = document.querySelector('.tab-btn[onclick*="aprender"]');
    if (btnAprender) cambiarTab('aprender', btnAprender);
    setTimeout(() => {
        cargarTabla(tablaNum);
    }, 100);
}

function renderizarLogrosMenu() {
    const grid = document.getElementById('logrosGridMenu');
    if (!grid) return;
    grid.innerHTML = '';

    const data = StorageManager.get();

    data.logros.forEach(logro => {
        const card = document.createElement('div');
        card.className = `logro-card ${logro.obtenido ? 'unlocked' : ''}`;
        card.innerHTML = `
            <div class="logro-icon">${logro.icono}</div>
            <div>
                <div class="logro-title">${logro.titulo}</div>
                <div class="logro-desc">${logro.desc}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function salirAlRegistro() {
    audio.playClick();
    if (confirm("¿Estás seguro de que deseas salir al menú de registro?")) {
        window.location.href = '../index.html';
    }
}
