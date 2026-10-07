/* ==========================================================================
   juegos.js - Lógica Dinámica, Juegos Al Azar, Timer de 60s/30s y Anti-Achunte
   ========================================================================== */

let timerJuegoInterval = null;
let tiempoRestanteJuego = 60;
let tiempoMaximoJuego = 60;
let puntosAcumuladosJuego = 0;
let aciertosJuego = 0;
let juegoActualActivo = null;
let preguntaRespondida = false; // Flag Anti-Achunte

// Helper para generar multiplicación al azar (tablas del 2 al 10)
function generarMultiplicacionAleatoria() {
    const tabla = Math.floor(Math.random() * 9) + 2; // 2 al 10
    const factor = Math.floor(Math.random() * 10) + 1; // 1 al 10
    const respuesta = tabla * factor;

    // Generar 3 distractores únicos
    const distractores = new Set();
    while (distractores.size < 3) {
        const offset = (Math.floor(Math.random() * 5) - 2) * (Math.floor(Math.random() * 3) + 1);
        const dist = respuesta + offset;
        if (dist > 0 && dist !== respuesta) {
            distractores.add(dist);
        }
    }

    const opciones = Array.from(distractores).concat([respuesta]);
    opciones.sort(() => Math.random() - 0.5);

    return { tabla, factor, respuesta, opciones };
}

// Iniciar temporizador (30s para Reloj, 60s para los demás)
function iniciarTimerGenerico(duracionSeg, onEndCallback) {
    if (timerJuegoInterval) clearInterval(timerJuegoInterval);

    tiempoMaximoJuego = duracionSeg;
    tiempoRestanteJuego = duracionSeg;
    actualizarHeaderTimer(duracionSeg);

    timerJuegoInterval = setInterval(() => {
        tiempoRestanteJuego--;
        actualizarHeaderTimer(tiempoRestanteJuego);

        if (tiempoRestanteJuego <= 5 && tiempoRestanteJuego > 0) {
            audio.playClick();
        }

        if (tiempoRestanteJuego <= 0) {
            clearInterval(timerJuegoInterval);
            timerJuegoInterval = null;
            if (typeof onEndCallback === 'function') {
                onEndCallback();
            }
        }
    }, 1000);
}

function actualizarHeaderTimer(seg) {
    const timerElem = document.getElementById('gameTimerVal');
    const timerFill = document.getElementById('gameTimerFill');
    const scoreElem = document.getElementById('gameScoreVal');
    const hitsElem = document.getElementById('gameHitsVal');

    if (timerElem) {
        const minStr = String(Math.floor(seg / 60)).padStart(2, '0');
        const segStr = String(seg % 60).padStart(2, '0');
        timerElem.textContent = `${minStr}:${segStr}`;
    }

    if (timerFill) {
        const pct = (seg / tiempoMaximoJuego) * 100;
        timerFill.style.width = `${pct}%`;
    }

    if (scoreElem) scoreElem.textContent = puntosAcumuladosJuego;
    if (hitsElem) hitsElem.textContent = aciertosJuego;
}

// Estructura de Header Estándar para los Modales
function obtenerHTMLHeaderJuego(titulo, icono, tiempoInicialStr = '01:00') {
    return `
        <div class="game-play-header">
            <div class="game-title-badge">${icono} ${titulo}</div>
            <div class="game-stats-pills">
                <div class="stat-box">🏆 Puntos: <span id="gameScoreVal" style="color:#00cec9;">0</span></div>
                <div class="stat-box">🔥 Aciertos: <span id="gameHitsVal" style="color:#2ed573;">0</span></div>
                <div class="stat-box">⏳ Tiempo: <span id="gameTimerVal" style="color:#ff4757;">${tiempoInicialStr}</span></div>
            </div>
            <div class="game-timer-wrapper">
                <div class="game-timer-bar-bg">
                    <div class="game-timer-bar-fill" id="gameTimerFill"></div>
                </div>
            </div>
        </div>
    `;
}

// Pantalla de Celebración / Fin de Juego (Sin Alert)
function mostrarPantallaFinDeJuego(tituloJuego, iconoJuego) {
    audio.playFanfare();
    const modalBody = document.getElementById('gameModalBody');

    const estrellasGanadas = Math.min(Math.floor(aciertosJuego / 3), 3);
    StorageManager.agregarPuntos(puntosAcumuladosJuego, estrellasGanadas);

    if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    }

    modalBody.innerHTML = `
        <div class="game-over-modal">
            <div class="game-over-icon">${iconoJuego}</div>
            <h2 class="game-over-title">¡TIEMPO AGOTADO!</h2>
            <p style="font-size:1.1rem; color:#64748b; font-weight:700; margin-bottom:15px;">Completaste la partida de ${tituloJuego}</p>
            
            <div class="game-over-score-badge">
                +${puntosAcumuladosJuego} PUNTOS GANADOS 🏆
            </div>

            <div class="game-over-stats-grid">
                <div class="game-over-stat-card">
                    <div class="game-over-stat-val" style="color:#2ed573;">${aciertosJuego}</div>
                    <div class="game-over-stat-lbl">Aciertos Logrados</div>
                </div>
                <div class="game-over-stat-card">
                    <div class="game-over-stat-val" style="color:#ffa502;">${'⭐'.repeat(estrellasGanadas || 1)}</div>
                    <div class="game-over-stat-lbl">Estrellas Ganadas</div>
                </div>
            </div>

            <button class="btn-retry-game" onclick="reiniciarJuegoActual('${juegoActualActivo}')">
                🔄 JUGAR OTRA VEZ
            </button>
            <button class="btn-retry-game" onclick="cerrarModalJuego()" style="background:#4e54c8;">
                🏠 VOLVER AL MENÚ
            </button>
        </div>
    `;
}

function reiniciarJuegoActual(tipo) {
    if (tipo === 'memoria') iniciarMemoria();
    else if (tipo === 'atrapa') iniciarAtrapa();
    else if (tipo === 'construye') iniciarConstruye();
    else if (tipo === 'quien') iniciarQuienTiene();
    else if (tipo === 'reloj') iniciarReloj();
    else if (tipo === 'arrastra') iniciarArrastra();
    else if (tipo === 'detective') iniciarDetective();
}

// ==========================================
// 1. MEMORIA MATEMÁTICA (MÁS GRANDE Y CORREGIDA)
// ==========================================
function iniciarMemoria() {
    juegoActualActivo = 'memoria';
    puntosAcumuladosJuego = 0;
    aciertosJuego = 0;

    const modalBody = document.getElementById('gameModalBody');
    modalBody.innerHTML = `
        ${obtenerHTMLHeaderJuego('Memoria Matemática', '🧠', '01:00')}
        <div class="memory-grid" id="memoryGrid"></div>
    `;

    abrirModalJuego();
    cargarTurnoMemoria();
    iniciarTimerGenerico(60, () => mostrarPantallaFinDeJuego('Memoria Matemática', '🧠'));
}

function cargarTurnoMemoria() {
    const grid = document.getElementById('memoryGrid');
    if (!grid || tiempoRestanteJuego <= 0) return;

    grid.innerHTML = '';
    const pares = [];
    for (let k = 0; k < 4; k++) {
        const op = generarMultiplicacionAleatoria();
        pares.push(op);
    }

    let cartas = [];
    pares.forEach((p, idx) => {
        cartas.push({ id: idx, txt: `${p.tabla} × ${p.factor}`, val: p.respuesta, tipo: 'op' });
        cartas.push({ id: idx, txt: `${p.respuesta}`, val: p.respuesta, tipo: 'val' });
    });
    cartas.sort(() => Math.random() - 0.5);

    let seleccionadas = [];

    cartas.forEach((cardData) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.textContent = '❓';
        card.onclick = () => {
            if (card.classList.contains('flipped') || card.classList.contains('matched') || seleccionadas.length >= 2) return;

            audio.playPop();
            card.classList.add('flipped');
            card.textContent = cardData.txt;
            seleccionadas.push({ card, data: cardData });

            if (seleccionadas.length === 2) {
                if (seleccionadas[0].data.val === seleccionadas[1].data.val && seleccionadas[0].data.tipo !== seleccionadas[1].data.tipo) {
                    audio.playCorrect();
                    seleccionadas[0].card.classList.add('matched');
                    seleccionadas[1].card.classList.add('matched');
                    seleccionadas = [];

                    aciertosJuego++;
                    puntosAcumuladosJuego += 150;
                    actualizarHeaderTimer(tiempoRestanteJuego);

                    const restantes = grid.querySelectorAll('.memory-card:not(.matched)');
                    if (restantes.length === 0) {
                        setTimeout(() => cargarTurnoMemoria(), 500);
                    }
                } else {
                    audio.playError();
                    setTimeout(() => {
                        seleccionadas.forEach(s => {
                            s.card.classList.remove('flipped');
                            s.card.textContent = '❓';
                        });
                        seleccionadas = [];
                    }, 800);
                }
            }
        };
        grid.appendChild(card);
    });
}

// ==========================================
// 2. ATRAPA EL RESULTADO (SIN GLOBOS PECADOS + ANTI-ACHUNTE)
// ==========================================
function iniciarAtrapa() {
    juegoActualActivo = 'atrapa';
    puntosAcumuladosJuego = 0;
    aciertosJuego = 0;

    const modalBody = document.getElementById('gameModalBody');
    modalBody.innerHTML = `
        ${obtenerHTMLHeaderJuego('Atrapa el Resultado', '🎈', '01:00')}
        <div class="catch-arena" id="catchArena">
            <div class="catch-target-question" id="catchTargetQ">¿Cuánto es...?</div>
        </div>
    `;

    abrirModalJuego();
    siguienteRondaAtrapa();
    iniciarTimerGenerico(60, () => mostrarPantallaFinDeJuego('Atrapa el Resultado', '🎈'));
}

function siguienteRondaAtrapa() {
    if (tiempoRestanteJuego <= 0) return;
    const arena = document.getElementById('catchArena');
    if (!arena) return;

    preguntaRespondida = false;
    const op = generarMultiplicacionAleatoria();
    document.getElementById('catchTargetQ').textContent = `¿Cuánto es ${op.tabla} × ${op.factor}?`;

    arena.querySelectorAll('.bubble-item').forEach(b => b.remove());

    op.opciones.forEach((val, idx) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-item';
        bubble.textContent = val;
        bubble.style.left = `${12 + idx * 21}%`;
        bubble.style.animationDelay = `${idx * 0.3}s`;

        bubble.onclick = () => {
            if (preguntaRespondida) return; // Anti-achunte: no permite clics múltiples

            preguntaRespondida = true;
            // Bloquear todas las burbujas inmediatamente
            arena.querySelectorAll('.bubble-item').forEach(b => b.style.pointerEvents = 'none');

            if (val === op.respuesta) {
                audio.playCorrect();
                bubble.style.background = '#2ed573';
                bubble.style.color = 'white';
                aciertosJuego++;
                puntosAcumuladosJuego += 100;
                actualizarHeaderTimer(tiempoRestanteJuego);
                setTimeout(() => siguienteRondaAtrapa(), 500);
            } else {
                audio.playError();
                bubble.style.background = '#ff4757';
                bubble.style.color = 'white';
                // Al equivocarse, pasa a la siguiente pregunta sin opción de achunte
                setTimeout(() => siguienteRondaAtrapa(), 700);
            }
        };

        arena.appendChild(bubble);
    });
}

// ==========================================
// 3. CONSTRUYE LA MULTIPLICACIÓN (BOTONES ESTÉTICOS + ANTI-ACHUNTE)
// ==========================================
function iniciarConstruye() {
    juegoActualActivo = 'construye';
    puntosAcumuladosJuego = 0;
    aciertosJuego = 0;

    const modalBody = document.getElementById('gameModalBody');
    modalBody.innerHTML = `
        ${obtenerHTMLHeaderJuego('Construye la Multiplicación', '📦', '01:00')}
        <div class="build-area">
            <div class="build-question" id="buildQuestionText">...</div>
            <div class="build-groups-container" id="buildContainer"></div>
            
            <div class="build-actions-row">
                <button class="btn-build-action btn-build-add" onclick="agregarGrupoConstruye()">➕ Agregar Grupo</button>
                <button class="btn-build-action btn-build-remove" onclick="quitarGrupoConstruye()">➖ Quitar Grupo</button>
                <button class="btn-build-action btn-build-verify" onclick="verificarConstruccionActual()">VERIFICAR 🚀</button>
            </div>
        </div>
    `;

    abrirModalJuego();
    siguienteRondaConstruye();
    iniciarTimerGenerico(60, () => mostrarPantallaFinDeJuego('Construye la Multiplicación', '📦'));
}

let opConstruyeActual = null;
let gruposConstruidos = 0;

function siguienteRondaConstruye() {
    if (tiempoRestanteJuego <= 0) return;
    preguntaRespondida = false;
    opConstruyeActual = generarMultiplicacionAleatoria();
    opConstruyeActual.tabla = Math.floor(Math.random() * 4) + 2; // 2 a 5
    opConstruyeActual.factor = Math.floor(Math.random() * 5) + 2; // 2 a 6

    gruposConstruidos = 1;
    document.getElementById('buildQuestionText').textContent = `Construye: ${opConstruyeActual.tabla} grupos de ${opConstruyeActual.factor} objetos`;
    renderizarContenedoresConstruye();
}

function renderizarContenedoresConstruye() {
    const container = document.getElementById('buildContainer');
    if (!container) return;
    container.innerHTML = '';

    const emojis = ['🍎', '⭐', '🎈', '🚗', '💎'];
    const emojiElem = emojis[opConstruyeActual.tabla % emojis.length];

    for (let k = 0; k < gruposConstruidos; k++) {
        const box = document.createElement('div');
        box.className = 'build-group-box';
        for (let m = 0; m < opConstruyeActual.factor; m++) {
            box.innerHTML += `<span style="font-size:1.6rem;">${emojiElem}</span>`;
        }
        container.appendChild(box);
    }
}

function agregarGrupoConstruye() {
    if (preguntaRespondida) return;
    audio.playPop();
    if (gruposConstruidos < 8) {
        gruposConstruidos++;
        renderizarContenedoresConstruye();
    }
}

function quitarGrupoConstruye() {
    if (preguntaRespondida) return;
    audio.playPop();
    if (gruposConstruidos > 1) {
        gruposConstruidos--;
        renderizarContenedoresConstruye();
    }
}

function verificarConstruccionActual() {
    if (preguntaRespondida) return;
    preguntaRespondida = true;

    if (gruposConstruidos === opConstruyeActual.tabla) {
        audio.playCorrect();
        aciertosJuego++;
        puntosAcumuladosJuego += 120;
        actualizarHeaderTimer(tiempoRestanteJuego);
        setTimeout(() => siguienteRondaConstruye(), 500);
    } else {
        audio.playError();
        const container = document.getElementById('buildContainer');
        container.style.animation = 'shakeError 0.4s ease';
        // Pasa a la siguiente pregunta al equivocarse (Anti-Achunte)
        setTimeout(() => siguienteRondaConstruye(), 700);
    }
}

// ==========================================
// 4. ¿QUIÉN TIENE LA RESPUESTA? (PERSONAJES REALES 1, 2, 3, 4 + ANTI-ACHUNTE)
// ==========================================
function iniciarQuienTiene() {
    juegoActualActivo = 'quien';
    puntosAcumuladosJuego = 0;
    aciertosJuego = 0;

    const modalBody = document.getElementById('gameModalBody');
    modalBody.innerHTML = `
        ${obtenerHTMLHeaderJuego('¿Quién tiene la respuesta?', '🤖', '01:00')}
        <p style="text-align:center; font-size:1.4rem; font-weight:800; color:#2d3436; margin:15px 0;" id="quienQuestionText">...</p>
        <div class="characters-grid" id="charGrid"></div>
    `;

    abrirModalJuego();
    siguienteRondaQuien();
    iniciarTimerGenerico(60, () => mostrarPantallaFinDeJuego('¿Quién tiene la respuesta?', '🤖'));
}

function siguienteRondaQuien() {
    if (tiempoRestanteJuego <= 0) return;
    const grid = document.getElementById('charGrid');
    if (!grid) return;

    preguntaRespondida = false;
    const op = generarMultiplicacionAleatoria();
    document.getElementById('quienQuestionText').textContent = `¿Qué personaje sostiene el resultado de ${op.tabla} × ${op.factor}?`;

    const personajesInfo = [
        { nombre: 'Personaje 1', img: 'avatar1.jpg' },
        { nombre: 'Personaje 2', img: 'avatar2.jpg' },
        { nombre: 'Personaje 3', img: 'avatar3.jpg' },
        { nombre: 'Personaje 4', img: 'avatar4.jpg' }
    ];

    grid.innerHTML = '';

    op.opciones.forEach((numVal, idx) => {
        const pInfo = personajesInfo[idx];
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <div class="character-avatar-wrapper">
                <img src="IMAGEN/${pInfo.img}" alt="${pInfo.nombre}" class="character-avatar-img" onerror="this.src='../img/${pInfo.img}'">
            </div>
            <div class="character-name-title">${pInfo.nombre}</div>
            <div class="character-sign">${numVal}</div>
        `;
        card.onclick = () => {
            if (preguntaRespondida) return;
            preguntaRespondida = true;

            // Bloquear todas las tarjetas
            grid.querySelectorAll('.character-card').forEach(c => c.style.pointerEvents = 'none');

            if (numVal === op.respuesta) {
                audio.playCorrect();
                card.style.borderColor = '#2ed573';
                aciertosJuego++;
                puntosAcumuladosJuego += 100;
                actualizarHeaderTimer(tiempoRestanteJuego);
                setTimeout(() => siguienteRondaQuien(), 500);
            } else {
                audio.playError();
                card.style.borderColor = '#ff4757';
                setTimeout(() => siguienteRondaQuien(), 700);
            }
        };
        grid.appendChild(card);
    });
}

// ==========================================
// 5. DESAFÍO CONTRA EL TIEMPO (30 SEGUNDOS + ANTI-ACHUNTE)
// ==========================================
function iniciarReloj() {
    juegoActualActivo = 'reloj';
    puntosAcumuladosJuego = 0;
    aciertosJuego = 0;

    const modalBody = document.getElementById('gameModalBody');
    modalBody.innerHTML = `
        ${obtenerHTMLHeaderJuego('Desafío Contra el Tiempo', '⏱️', '00:30')}
        <div class="timer-challenge-box">
            <div class="timer-question" id="relojPregunta">...</div>
            <div class="timer-options-grid" id="relojOpciones"></div>
        </div>
    `;

    abrirModalJuego();
    siguienteRondaReloj();
    // Temporizador exacto de 30 segundos
    iniciarTimerGenerico(30, () => {
        StorageManager.desbloquearLogro('veloz');
        mostrarPantallaFinDeJuego('Desafío Contra el Tiempo', '⏱️');
    });
}

function siguienteRondaReloj() {
    if (tiempoRestanteJuego <= 0) return;
    preguntaRespondida = false;

    const op = generarMultiplicacionAleatoria();
    document.getElementById('relojPregunta').textContent = `${op.tabla} × ${op.factor} = ?`;

    const container = document.getElementById('relojOpciones');
    if (!container) return;
    container.innerHTML = '';

    op.opciones.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'btn-option-timer';
        btn.textContent = val;
        btn.onclick = () => {
            if (preguntaRespondida) return;
            preguntaRespondida = true;

            // Bloquear opciones
            container.querySelectorAll('.btn-option-timer').forEach(b => b.classList.add('locked-disabled'));

            if (val === op.respuesta) {
                audio.playCorrect();
                btn.style.background = '#2ed573';
                btn.style.color = 'white';
                aciertosJuego++;
                puntosAcumuladosJuego += 100;
                actualizarHeaderTimer(tiempoRestanteJuego);
                setTimeout(() => siguienteRondaReloj(), 400);
            } else {
                audio.playError();
                btn.classList.add('locked-error');
                setTimeout(() => siguienteRondaReloj(), 600);
            }
        };
        container.appendChild(btn);
    });
}

// ==========================================
// 6. ARRASTRA Y COMPLETA (ANTI-ACHUNTE + SIGUIENTE RONDA)
// ==========================================
let opArrastraActual = null;
let posicionFaltaArrastra = 1;

function iniciarArrastra() {
    juegoActualActivo = 'arrastra';
    puntosAcumuladosJuego = 0;
    aciertosJuego = 0;

    const modalBody = document.getElementById('gameModalBody');
    modalBody.innerHTML = `
        ${obtenerHTMLHeaderJuego('Arrastra y Completa', '🧩', '01:00')}
        <div class="drag-drop-container">
            <p style="font-weight:700; color:#64748b; margin-bottom:15px;">Arrastra la ficha numérica correcta hasta la casilla en blanco (o haz clic sobre ella):</p>
            
            <div class="drag-equation-box" id="dragEquationBox"></div>
            <div class="drag-chips-pool" id="chipsPool"></div>
        </div>
    `;

    abrirModalJuego();
    siguienteRondaArrastra();
    iniciarTimerGenerico(60, () => mostrarPantallaFinDeJuego('Arrastra y Completa', '🧩'));
}

function siguienteRondaArrastra() {
    if (tiempoRestanteJuego <= 0) return;
    preguntaRespondida = false;
    opArrastraActual = generarMultiplicacionAleatoria();
    posicionFaltaArrastra = Math.floor(Math.random() * 3);

    const eqBox = document.getElementById('dragEquationBox');
    const pool = document.getElementById('chipsPool');
    if (!eqBox || !pool) return;

    let valorCorrecto = 0;
    let eqHTML = '';

    if (posicionFaltaArrastra === 0) {
        valorCorrecto = opArrastraActual.tabla;
        eqHTML = `
            <div class="drag-target-slot" id="targetSlot" data-answer="${valorCorrecto}">?</div>
            <span>× ${opArrastraActual.factor} = ${opArrastraActual.respuesta}</span>
        `;
    } else if (posicionFaltaArrastra === 1) {
        valorCorrecto = opArrastraActual.factor;
        eqHTML = `
            <span>${opArrastraActual.tabla} × </span>
            <div class="drag-target-slot" id="targetSlot" data-answer="${valorCorrecto}">?</div>
            <span>= ${opArrastraActual.respuesta}</span>
        `;
    } else {
        valorCorrecto = opArrastraActual.respuesta;
        eqHTML = `
            <span>${opArrastraActual.tabla} × ${opArrastraActual.factor} = </span>
            <div class="drag-target-slot" id="targetSlot" data-answer="${valorCorrecto}">?</div>
        `;
    }

    eqBox.innerHTML = eqHTML;

    const slot = document.getElementById('targetSlot');
    slot.ondragover = (e) => {
        e.preventDefault();
        slot.classList.add('hovered');
    };
    slot.ondragleave = () => slot.classList.remove('hovered');
    slot.ondrop = (e) => {
        e.preventDefault();
        slot.classList.remove('hovered');
        const draggedVal = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const draggedId = e.dataTransfer.getData('chipId');
        evaluarIntentoArrastra(draggedVal, document.getElementById(draggedId));
    };

    pool.innerHTML = '';
    const fichasValores = [valorCorrecto];

    while (fichasValores.length < 4) {
        const r = Math.floor(Math.random() * 80) + 2;
        if (!fichasValores.includes(r)) fichasValores.push(r);
    }
    fichasValores.sort(() => Math.random() - 0.5);

    fichasValores.forEach((val, idx) => {
        const chip = document.createElement('div');
        chip.className = 'chip-item';
        chip.id = `chip-${idx}`;
        chip.textContent = val;
        chip.draggable = true;

        chip.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', val);
            e.dataTransfer.setData('chipId', chip.id);
            audio.playPop();
        };

        chip.onclick = () => {
            evaluarIntentoArrastra(val, chip);
        };

        pool.appendChild(chip);
    });
}

function evaluarIntentoArrastra(valElegido, chipElement) {
    if (preguntaRespondida) return;
    preguntaRespondida = true;

    const slot = document.getElementById('targetSlot');
    const valorEsperado = parseInt(slot.dataset.answer, 10);

    // Deshabilitar fichas
    document.querySelectorAll('.chip-item').forEach(c => c.classList.add('blocked'));

    if (valElegido === valorEsperado) {
        audio.playCorrect();
        slot.textContent = valElegido;
        slot.className = 'drag-target-slot drop-success';

        aciertosJuego++;
        puntosAcumuladosJuego += 120;
        actualizarHeaderTimer(tiempoRestanteJuego);

        setTimeout(() => siguienteRondaArrastra(), 500);
    } else {
        audio.playError();
        slot.className = 'drag-target-slot drop-error';
        setTimeout(() => siguienteRondaArrastra(), 700);
    }
}

// ==========================================
// 7. DETECTIVE MATEMÁTICO (ANTI-ACHUNTE)
// ==========================================
function iniciarDetective() {
    juegoActualActivo = 'detective';
    puntosAcumuladosJuego = 0;
    aciertosJuego = 0;

    const modalBody = document.getElementById('gameModalBody');
    modalBody.innerHTML = `
        ${obtenerHTMLHeaderJuego('Detective Matemático', '🕵️‍♂️', '01:00')}
        <div class="detective-box">
            <div class="detective-badge">🕵️‍♂️</div>
            <div class="detective-clue" id="detectiveClueText">Cargando acertijo...</div>
            <div style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap;" id="detectiveOptions"></div>
        </div>
    `;

    abrirModalJuego();
    siguienteRondaDetective();
    iniciarTimerGenerico(60, () => {
        StorageManager.desbloquearLogro('detective');
        mostrarPantallaFinDeJuego('Detective Matemático', '🕵️‍♂️');
    });
}

function siguienteRondaDetective() {
    if (tiempoRestanteJuego <= 0) return;
    preguntaRespondida = false;

    const op = generarMultiplicacionAleatoria();
    const doble = op.respuesta / 2;

    const textoAcertijo = `"Soy un número oculto. Soy el resultado de multiplicar ${op.tabla} por ${op.factor} y soy exactamente el doble de ${doble % 1 === 0 ? doble : op.respuesta - 5}... ¿Qué número soy?"`;

    document.getElementById('detectiveClueText').textContent = textoAcertijo;

    const container = document.getElementById('detectiveOptions');
    if (!container) return;
    container.innerHTML = '';

    op.opciones.forEach(numVal => {
        const btn = document.createElement('button');
        btn.className = 'btn-option-timer';
        btn.textContent = numVal;
        btn.onclick = () => {
            if (preguntaRespondida) return;
            preguntaRespondida = true;

            container.querySelectorAll('.btn-option-timer').forEach(b => b.classList.add('locked-disabled'));

            if (numVal === op.respuesta) {
                audio.playCorrect();
                btn.style.background = '#2ed573';
                btn.style.color = 'white';
                aciertosJuego++;
                puntosAcumuladosJuego += 150;
                actualizarHeaderTimer(tiempoRestanteJuego);
                setTimeout(() => siguienteRondaDetective(), 400);
            } else {
                audio.playError();
                btn.classList.add('locked-error');
                setTimeout(() => siguienteRondaDetective(), 600);
            }
        };
        container.appendChild(btn);
    });
}

// ==========================================
// FUNCIONES AUXILIARES DE MODAL
// ==========================================
function abrirModalJuego() {
    document.getElementById('gameModal').classList.add('active');
}

function cerrarModalJuego() {
    audio.playClick();
    if (timerJuegoInterval) {
        clearInterval(timerJuegoInterval);
        timerJuegoInterval = null;
    }
    document.getElementById('gameModal').classList.remove('active');
    if (typeof actualizarDashboardUsuario === 'function') actualizarDashboardUsuario();
}
