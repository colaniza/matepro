/* ==========================================================================
   ingreso.js - Lógica para la Pantalla de Ingreso y Selección de Avatar Real
   ========================================================================== */

let avatarSeleccionadoId = null;

document.addEventListener('DOMContentLoaded', () => {
    crearParticulasFondo();
    renderizarAvatares();
    cargarDatosPrevios();

    document.getElementById('btnIngresar').addEventListener('click', procesarIngreso);
    document.getElementById('nombreInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') procesarIngreso();
    });
});

function crearParticulasFondo() {
    const contenedor = document.getElementById('bgParticles');
    const simbolos = ['✖️', '➕', '➗', '⭐', '🎈', '🔢', '✨'];
    if (!contenedor) return;

    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shape.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${8 + Math.random() * 7}s`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        contenedor.appendChild(shape);
    }
}

function renderizarAvatares() {
    const grid = document.getElementById('avatarGrid');
    if (!grid) return;
    grid.innerHTML = '';

    DEFAULT_AVATARES.forEach(avatar => {
        const card = document.createElement('div');
        card.className = `avatar-card ${avatarSeleccionadoId === avatar.id ? 'selected' : ''}`;
        card.dataset.id = avatar.id;
        card.onclick = () => seleccionarAvatar(avatar.id, card);

        card.innerHTML = `
            <div class="avatar-img-wrapper">
                <img src="Sistema/IMAGEN/${avatar.img}" alt="${avatar.nombre}" class="avatar-img-real" onerror="this.src='../img/${avatar.img}'">
            </div>
            <div class="avatar-name">${avatar.nombre}</div>
        `;
        grid.appendChild(card);
    });
}

function seleccionarAvatar(id, element) {
    audio.playPop();
    avatarSeleccionadoId = id;
    
    document.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');
}

function cargarDatosPrevios() {
    const data = StorageManager.get();
    if (data.nombre) {
        document.getElementById('nombreInput').value = data.nombre;
    }
    if (data.avatarId) {
        avatarSeleccionadoId = data.avatarId;
        renderizarAvatares();
    } else {
        avatarSeleccionadoId = DEFAULT_AVATARES[0].id;
        renderizarAvatares();
    }
}

function procesarIngreso() {
    const nombreInput = document.getElementById('nombreInput').value.trim();

    if (!nombreInput) {
        audio.playError();
        mostrarModal("Nombre Requerido", "Por favor ingresa tu nombre completo para identificarte en el juego.");
        return;
    }

    if (!avatarSeleccionadoId) {
        audio.playError();
        mostrarModal("Avatar Requerido", "Por favor elige tu avatar de la lista.");
        return;
    }

    audio.playCorrect();
    StorageManager.registrarEstudiante(nombreInput, avatarSeleccionadoId);

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

    setTimeout(() => {
        window.location.href = 'Sistema/index.html';
    }, 700);
}

function mostrarModal(titulo, mensaje) {
    document.getElementById('modalTitle').textContent = titulo;
    document.getElementById('modalText').textContent = mensaje;
    document.getElementById('modalAdvertencia').classList.add('active');
}

function cerrarModal() {
    audio.playClick();
    document.getElementById('modalAdvertencia').classList.remove('active');
}
