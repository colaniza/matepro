/* ==========================================================================
   simce.js - Módulo del Ensayo Matemático tipo SIMCE 4° Básico (Layout Horizontal)
   ========================================================================== */

const PREGUNTAS_SIMCE = [
    {
        id: 1,
        contexto: "En la feria escolar, Camila compró 6 paquetes de lápices de colores para sus compañeros. Si cada paquete contiene 8 lápices, ¿cuántos lápices compró Camila en total?",
        icono: "✏️",
        opciones: [
            { letra: "A", texto: "40 lápices", correcta: false },
            { letra: "B", texto: "48 lápices", correcta: true },
            { letra: "C", texto: "54 lápices", correcta: false },
            { letra: "D", texto: "64 lápices", correcta: false }
        ],
        explicacion: "Para calcular el total de lápices debemos multiplicar la cantidad de paquetes (6) por la cantidad de lápices en cada paquete (8): 6 × 8 = 48 lápices."
    },
    {
        id: 2,
        contexto: "El profesor de educación física organiza a los estudiantes de 4° básico en 5 equipos para un torneo de básquetbol. Si cada equipo tiene 7 jugadores, ¿cuántos estudiantes participan en el torneo?",
        icono: "🏀",
        opciones: [
            { letra: "A", texto: "30 estudiantes", correcta: false },
            { letra: "B", texto: "35 estudiantes", correcta: true },
            { letra: "C", texto: "40 estudiantes", correcta: false },
            { letra: "D", texto: "45 estudiantes", correcta: false }
        ],
        explicacion: "Para encontrar el total de estudiantes, multiplicamos el número de equipos (5) por los integrantes de cada equipo (7): 5 × 7 = 35 estudiantes."
    },
    {
        id: 3,
        contexto: "En la biblioteca del colegio hay 4 estantes y en cada estante se colocaron 9 libros de cuentos infantiles. ¿Cuántos libros de cuentos hay en total?",
        icono: "📚",
        opciones: [
            { letra: "A", texto: "36 libros", correcta: true },
            { letra: "B", texto: "32 libros", correcta: false },
            { letra: "C", texto: "40 libros", correcta: false },
            { letra: "D", texto: "28 libros", correcta: false }
        ],
        explicacion: "Multiplicamos la cantidad de estantes (4) por los libros que hay en cada estante (9): 4 × 9 = 36 libros."
    },
    {
        id: 4,
        contexto: "Para el convivio del curso, la directiva compró 7 bolsas de manzanas. Cada bolsa contiene 6 manzanas rojas. ¿Cuántas manzanas compraron en total?",
        icono: "🍎",
        opciones: [
            { letra: "A", texto: "36 manzanas", correcta: false },
            { letra: "B", texto: "42 manzanas", correcta: true },
            { letra: "C", texto: "48 manzanas", correcta: false },
            { letra: "D", texto: "54 manzanas", correcta: false }
        ],
        explicacion: "Calculamos el producto entre las 7 bolsas y las 6 manzanas por bolsa: 7 × 6 = 42 manzanas."
    },
    {
        id: 5,
        contexto: "En una competencia de videojuegos educativos, Matías acumuló 8 monedas doradas en cada una de las 8 etapas completadas. ¿Cuántas monedas doradas reunió Matías?",
        icono: "🎮",
        opciones: [
            { letra: "A", texto: "56 monedas", correcta: false },
            { letra: "B", texto: "64 monedas", correcta: true },
            { letra: "C", texto: "72 monedas", correcta: false },
            { letra: "D", texto: "80 monedas", correcta: false }
        ],
        explicacion: "Multiplicamos las 8 etapas completadas por las 8 monedas ganadas en cada una: 8 × 8 = 64 monedas."
    },
    {
        id: 6,
        contexto: "Una fábrica de juguetes empaqueta autitos en cajas. Si empaquetan 9 cajas y cada caja lleva 5 autitos, ¿cuántos autitos empaquetaron?",
        icono: "🚗",
        opciones: [
            { letra: "A", texto: "45 autitos", correcta: true },
            { letra: "B", texto: "40 autitos", correcta: false },
            { letra: "C", texto: "50 autitos", correcta: false },
            { letra: "D", texto: "55 autitos", correcta: false }
        ],
        explicacion: "Al multiplicar las 9 cajas por los 5 autitos de cada caja obtenemos: 9 × 5 = 45 autitos."
    },
    {
        id: 7,
        contexto: "Para una clase de arte, la profesora distribuye 3 frascos con 10 pinceles cada uno entre las mesas de trabajo. ¿Cuántos pinceles repartió en total?",
        icono: "🎨",
        opciones: [
            { letra: "A", texto: "20 pinceles", correcta: false },
            { letra: "B", texto: "25 pinceles", correcta: false },
            { letra: "C", texto: "30 pinceles", correcta: true },
            { letra: "D", texto: "35 pinceles", correcta: false }
        ],
        explicacion: "Multiplicamos los 3 frascos por los 10 pinceles que contiene cada uno: 3 × 10 = 30 pinceles."
    },
    {
        id: 8,
        contexto: "Don José vende cajas de chocolates en su almacén. Si vendió 6 cajas y cada caja contiene 7 chocolates caseros, ¿cuántos chocolates vendió en total?",
        icono: "🍫",
        opciones: [
            { letra: "A", texto: "35 chocolates", correcta: false },
            { letra: "B", texto: "42 chocolates", correcta: true },
            { letra: "C", texto: "49 chocolates", correcta: false },
            { letra: "D", texto: "56 chocolates", correcta: false }
        ],
        explicacion: "Calculamos el producto de las 6 cajas por los 7 chocolates de cada caja: 6 × 7 = 42 chocolates."
    },
    {
        id: 9,
        contexto: "En el patio de la escuela hay 9 hileras de sillas para una presentación. Si en cada hilera colocaron 9 sillas, ¿cuántas sillas hay preparadas?",
        icono: "🪑",
        opciones: [
            { letra: "A", texto: "72 sillas", correcta: false },
            { letra: "B", texto: "81 sillas", correcta: true },
            { letra: "C", texto: "90 sillas", correcta: false },
            { letra: "D", texto: "99 sillas", correcta: false }
        ],
        explicacion: "Multiplicamos el número de hileras (9) por la cantidad de sillas en cada hilera (9): 9 × 9 = 81 sillas."
    },
    {
        id: 10,
        contexto: "Un agricultor recolectó 10 cajones de naranjas frescas. Si cada cajón pesa 8 kilos, ¿cuántos kilos de naranjas cosechó en total?",
        icono: "🍊",
        opciones: [
            { letra: "A", texto: "70 kilos", correcta: false },
            { letra: "B", texto: "80 kilos", correcta: true },
            { letra: "C", texto: "90 kilos", correcta: false },
            { letra: "D", texto: "100 kilos", correcta: false }
        ],
        explicacion: "Multiplicamos los 10 cajones recolectados por los 8 kilos de peso de cada cajón: 10 × 8 = 80 kilos."
    }
];

let preguntaActualIndex = 0;
let respuestasEstudiante = {}; // { 0: 'B', 1: 'A', ... }

function inicializarEnsayoSimce() {
    preguntaActualIndex = 0;
    respuestasEstudiante = {};
    renderizarNavLateralSimce();
    cargarPreguntaSimce(0);
}

function renderizarNavLateralSimce() {
    const navGrid = document.getElementById('simceNavGrid');
    if (!navGrid) return;
    navGrid.innerHTML = '';

    PREGUNTAS_SIMCE.forEach((preg, idx) => {
        const btn = document.createElement('button');
        const respondida = respuestasEstudiante.hasOwnProperty(idx);
        btn.className = `btn-question-num ${preguntaActualIndex === idx ? 'active' : ''} ${respondida ? 'answered' : ''}`;
        btn.textContent = `P${idx + 1}`;
        btn.onclick = () => {
            audio.playClick();
            cargarPreguntaSimce(idx);
        };
        navGrid.appendChild(btn);
    });

    const cantRespondidas = Object.keys(respuestasEstudiante).length;
    const progressElem = document.getElementById('simceProgressText');
    if (progressElem) progressElem.textContent = `Respondidas: ${cantRespondidas} de 10`;
}

function cargarPreguntaSimce(index) {
    preguntaActualIndex = index;
    renderizarNavLateralSimce();

    const preg = PREGUNTAS_SIMCE[index];
    document.getElementById('simceQuestionBadge').textContent = `Pregunta ${index + 1} de 10`;
    document.getElementById('simceContextText').textContent = preg.contexto;
    document.getElementById('simceIllustrationBox').textContent = preg.icono;

    const optionsList = document.getElementById('simceOptionsList');
    optionsList.innerHTML = '';

    preg.opciones.forEach((opt) => {
        const card = document.createElement('div');
        const seleccionada = respuestasEstudiante[index] === opt.letra;
        card.className = `simce-option-card ${seleccionada ? 'selected' : ''}`;
        card.innerHTML = `
            <div class="simce-option-letter">${opt.letra}</div>
            <div class="simce-option-text">${opt.texto}</div>
        `;
        card.onclick = () => {
            audio.playPop();
            respuestasEstudiante[index] = opt.letra;
            cargarPreguntaSimce(index);
        };
        optionsList.appendChild(card);
    });

    const btnAnt = document.getElementById('btnSimceAnterior');
    const btnSig = document.getElementById('btnSimceSiguiente');

    if (btnAnt) btnAnt.style.display = index === 0 ? 'none' : 'inline-block';
    if (btnSig) btnSig.style.display = index === PREGUNTAS_SIMCE.length - 1 ? 'none' : 'inline-block';
}

function navegarSimce(direccion) {
    audio.playClick();
    const nuevoIdx = preguntaActualIndex + direccion;
    if (nuevoIdx >= 0 && nuevoIdx < PREGUNTAS_SIMCE.length) {
        cargarPreguntaSimce(nuevoIdx);
    }
}

function finalizarEnsayoSimce() {
    audio.playClick();
    const cantRespondidas = Object.keys(respuestasEstudiante).length;
    if (cantRespondidas < 10) {
        audio.playError();
        if (!confirm(`Solo has respondido ${cantRespondidas} de 10 preguntas. ¿Deseas finalizar el ensayo de todas formas?`)) {
            return;
        }
    }

    let aciertos = 0;
    PREGUNTAS_SIMCE.forEach((preg, idx) => {
        const elegida = respuestasEstudiante[idx];
        const optCorrecta = preg.opciones.find(o => o.correcta);
        if (elegida === optCorrecta.letra) {
            aciertos++;
        }
    });

    const porcentaje = Math.round((aciertos / 10) * 100);
    StorageManager.guardarEnsayoSimce(aciertos, 10, respuestasEstudiante);

    if (porcentaje >= 70 && typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    }

    renderizarResultadosSimce(aciertos, porcentaje);
}

function renderizarResultadosSimce(aciertos, porcentaje) {
    const modalBody = document.getElementById('gameModalBody');
    let nivel = 'En Desarrollo 📈';
    let colorNivel = '#ff4757';

    if (porcentaje >= 80) {
        nivel = 'Destacado 🏆';
        colorNivel = '#2ed573';
        audio.playFanfare();
    } else if (porcentaje >= 60) {
        nivel = 'Adecuado ⭐';
        colorNivel = '#ffa502';
        audio.playCorrect();
    } else {
        audio.playError();
    }

    let feedbackHTML = '';
    PREGUNTAS_SIMCE.forEach((preg, idx) => {
        const elegida = respuestasEstudiante[idx] || 'Sin responder';
        const optCorrecta = preg.opciones.find(o => o.correcta);
        const esCorrecta = elegida === optCorrecta.letra;

        feedbackHTML += `
            <div class="simce-feedback-item ${esCorrecta ? 'correct' : 'incorrect'}">
                <div style="font-weight:900; font-size:1.1rem; margin-bottom:6px;">
                    ${esCorrecta ? '✅' : '❌'} Pregunta ${idx + 1}: ${preg.contexto}
                </div>
                <div style="font-size:0.95rem; margin-bottom:6px;">
                    <strong>Tu respuesta:</strong> ${elegida} | <strong>Respuesta Correcta:</strong> ${optCorrecta.letra}) ${optCorrecta.texto}
                </div>
                <div style="font-size:0.9rem; color:#475569; background:rgba(255,255,255,0.7); padding:10px; border-radius:10px;">
                    💡 <strong>Explicación:</strong> ${preg.explicacion}
                </div>
            </div>
        `;
    });

    modalBody.innerHTML = `
        <div class="simce-results-card">
            <h2 style="font-size:2rem; font-weight:900; color:#4e54c8; margin-bottom:15px;">📊 Resultado del Ensayo SIMCE</h2>
            
            <div class="simce-score-circle">
                <div class="simce-score-num">${aciertos}/10</div>
                <div style="font-weight:700;">${porcentaje}%</div>
            </div>

            <h3 style="font-size:1.4rem; font-weight:800; color:${colorNivel}; margin-bottom:20px;">Nivel Alcanzado: ${nivel}</h3>

            <button class="btn-ingresar" onclick="cerrarModalJuego()" style="max-width:300px; margin:0 auto 25px auto;">VOLVER AL MENÚ PRINCIPAL 🏠</button>

            <h3 style="text-align:left; font-size:1.3rem; font-weight:900; color:#2d3436; margin-bottom:15px;">Retroalimentación Detallada:</h3>
            <div class="simce-feedback-list">
                ${feedbackHTML}
            </div>
        </div>
    `;

    abrirModalJuego();
}
