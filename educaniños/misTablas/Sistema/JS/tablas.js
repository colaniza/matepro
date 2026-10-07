/* ==========================================================================
   tablas.js - Explorador Interactivo de Tablas del 2 al 10 y Grupos Visuales
   ========================================================================== */

const TABLAS_DATOS = {
    2: {
        patron: "La tabla del 2 siempre da números PARES. Es simplemente sumar el número consigo mismo (el doble).",
        itemEmoji: "🍎",
        ejemplo: { g: 3, i: 2, desc: "3 grupos de 2 manzanas = 6 manzanas en total" }
    },
    3: {
        patron: "La suma de los dígitos de los resultados de la tabla del 3 siempre es múltiplo de 3 (ej: 12 -> 1+2=3).",
        itemEmoji: "⭐",
        ejemplo: { g: 4, i: 3, desc: "4 grupos de 3 estrellas = 12 estrellas" }
    },
    4: {
        patron: "Multiplicar por 4 es lo mismo que calcular el DOBLE DEL DOBLE (ej: 6x2=12, y el doble de 12 es 24).",
        itemEmoji: "🚗",
        ejemplo: { g: 2, i: 4, desc: "2 autos con 4 ruedas cada uno = 8 ruedas" }
    },
    5: {
        patron: "¡Facilísimo! Todos los resultados de la tabla del 5 terminan siempre en 0 o en 5.",
        itemEmoji: "✋",
        ejemplo: { g: 3, i: 5, desc: "3 manos con 5 dedos cada una = 15 dedos" }
    },
    6: {
        patron: "Al multiplicar 6 por un número par, el resultado termina en la misma cifra (ej: 6x4=24, 6x8=48).",
        itemEmoji: "🎲",
        ejemplo: { g: 2, i: 6, desc: "2 dados de 6 caras cada uno = 12 caras" }
    },
    7: {
        patron: "La tabla del 7 combina la tabla del 5 más la tabla del 2 (ej: 7x4 es (5x4) + (2x4) = 20 + 8 = 28).",
        itemEmoji: "🎈",
        ejemplo: { g: 2, i: 7, desc: "2 ramos con 7 globos cada uno = 14 globos" }
    },
    8: {
        patron: "Multiplicar por 8 es calcular el doble del doble del doble (el triple doble).",
        itemEmoji: "🐙",
        ejemplo: { g: 2, i: 8, desc: "2 pulpos de 8 tentáculos cada uno = 16 tentáculos" }
    },
    9: {
        patron: "¡El truco de los dedos! En la tabla del 9, las decenas y unidades de los resultados siempre suman 9.",
        itemEmoji: "🚀",
        ejemplo: { g: 3, i: 9, desc: "3 escuadrones de 9 naves = 27 naves" }
    },
    10: {
        patron: "¡La más divertida! Para multiplicar cualquier número por 10, solo agrégale un CERO al final.",
        itemEmoji: "💎",
        ejemplo: { g: 4, i: 10, desc: "4 cofres con 10 gemas cada uno = 40 gemas" }
    }
};

let tablaActual = 2;

function inicializarModuloTablas() {
    renderizarSelectorTablas();
    cargarTabla(2);
}

function renderizarSelectorTablas() {
    const contenedor = document.getElementById('selectorTablasHeader');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    for (let i = 2; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = `btn-num-tabla ${tablaActual === i ? 'active' : ''}`;
        btn.textContent = `Tabla del ${i}`;
        btn.onclick = () => {
            audio.playClick();
            cargarTabla(i);
        };
        contenedor.appendChild(btn);
    }
}

function cargarTabla(num) {
    tablaActual = num;
    renderizarSelectorTablas();

    const info = TABLAS_DATOS[num];
    document.getElementById('tablaDisplayTitle').textContent = `📘 Tabla del ${num}`;
    document.getElementById('patronTexto').textContent = info.patron;
    document.getElementById('btnPatronAudio').onclick = () => audio.speak(info.patron);

    renderizarGruposVisuales(num, info.ejemplo.g, info.ejemplo.i, info.itemEmoji, info.ejemplo.desc);
    renderizarFilasTabla(num);

    // Marcar avance
    StorageManager.actualizarProgresoTabla(num, 100, 3);
}

function renderizarGruposVisuales(tabla, numGrupos, itemsPorGrupo, emoji, descripcion) {
    const contenedor = document.getElementById('groupsFlex');
    const expressBox = document.getElementById('multiplicationExpress');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    for (let g = 0; g < numGrupos; g++) {
        const groupBox = document.createElement('div');
        groupBox.className = 'group-box';
        
        for (let item = 0; item < itemsPorGrupo; item++) {
            const itemSpan = document.createElement('span');
            itemSpan.className = 'group-item';
            itemSpan.textContent = emoji;
            itemSpan.onclick = () => {
                audio.playPop();
                itemSpan.style.transform = 'scale(1.5) rotate(20deg)';
                setTimeout(() => itemSpan.style.transform = '', 200);
            };
            groupBox.appendChild(itemSpan);
        }

        contenedor.appendChild(groupBox);
    }

    expressBox.textContent = `${numGrupos} × ${itemsPorGrupo} = ${numGrupos * itemsPorGrupo}`;
    document.getElementById('groupDescText').textContent = descripcion;
}

function renderizarFilasTabla(tabla) {
    const grid = document.getElementById('tablaRowsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 1; i <= 10; i++) {
        const res = tabla * i;
        const row = document.createElement('div');
        row.className = 'tabla-row-item';
        row.innerHTML = `
            <span>${tabla} × ${i}</span>
            <span style="color:#4e54c8; font-weight:900;">= ${res}</span>
        `;
        row.onclick = () => {
            audio.playClick();
            const info = TABLAS_DATOS[tabla];
            renderizarGruposVisuales(tabla, i, tabla, info.itemEmoji, `${i} grupos de ${tabla} = ${res}`);
            audio.speak(`${tabla} por ${i} es igual a ${res}`);
        };
        grid.appendChild(row);
    }
}
