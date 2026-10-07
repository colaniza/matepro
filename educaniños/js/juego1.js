/* ===================================================
   js/juego1.js - Minijuego Alimenta al Reno
   =================================================== */
let metaZanahorias = 0;
let canastaActual = 0;
let utteranceJ1 = null;

document.addEventListener('DOMContentLoaded', () => {
    const displayNombre = document.getElementById('displayNombre');
    const imgAvatar = document.getElementById('displayAvatar');
    if (displayNombre) displayNombre.textContent = localStorage.getItem('estudianteNombre') || "Estudiante";
    if (imgAvatar && localStorage.getItem('estudianteAvatar')) {
        imgAvatar.src = `img/${localStorage.getItem('estudianteAvatar')}`;
    }
    nuevoDesafioAleatorio();
});

function nuevoDesafioAleatorio() {
    metaZanahorias = Math.floor(Math.random() * 8) + 2; // Cantidad aleatoria entre 2 y 9
    canastaActual = 0;
    
    const contenedorSaco = document.getElementById('sacoComida');
    if (contenedorSaco) {
        contenedorSaco.innerHTML = "";
        for (let i = 0; i < 10; i++) {
            contenedorSaco.innerHTML += `<span class="zanahoria-item" id="zana-${i}" onclick="alimentarReno(${i})">🥕</span>`;
        }
    }
    
    const textoBurbuja = `¡Hola! Tengo mucha hambre, ¿me das exactamente ${metaZanahorias} zanahorias en mi plato?`;
    hablarConReflejoJ1(textoBurbuja, 'burbujaTexto');

    const btnSig = document.getElementById('btnSiguienteJuego');
    if (btnSig) btnSig.classList.add('oculto');
}

function prepararTextoKaraoke(elementoId, texto) {
    const contenedor = document.getElementById(elementoId);
    if (!contenedor) return;
    const palabras = texto.split(" ");
    contenedor.innerHTML = palabras.map((palabra, index) => {
        return `<span id="word-${elementoId}-${index}" class="palabra-karaoke">${palabra}</span>`;
    }).join(" ");
}

function hablarConReflejoJ1(texto, elementoId) {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    prepararTextoKaraoke(elementoId, texto);

    utteranceJ1 = new SpeechSynthesisUtterance(texto);
    utteranceJ1.lang = 'es-ES';
    utteranceJ1.rate = 0.95;

    let palabraIndex = 0;
    utteranceJ1.onboundary = (event) => {
        if (event.name === 'word') {
            const palAnterior = document.querySelector(`#${elementoId} .palabra-karaoke.resaltada`);
            if (palAnterior) palAnterior.classList.remove('resaltada');
            
            const palActual = document.getElementById(`word-${elementoId}-${palabraIndex}`);
            if (palActual) palActual.classList.add('resaltada');
            palabraIndex++;
        }
    };

    utteranceJ1.onend = () => {
        setTimeout(() => {
            document.querySelectorAll(`#${elementoId} .palabra-karaoke`).forEach(p => p.classList.remove('resaltada'));
        }, 500);
    };
    window.speechSynthesis.speak(utteranceJ1);
}

function alimentarReno(id) {
    const zana = document.getElementById(`zana-${id}`);
    if (zana && !zana.classList.contains('comida')) {
        zana.classList.add('comida');
        canastaActual++;
        if (typeof hablar === 'function') hablar(`${canastaActual}`);
    }
}

function borrarAlimentacion() {
    canastaActual = 0;
    document.querySelectorAll('.zanahoria-item').forEach(z => z.classList.remove('comida'));
    if (typeof hablar === 'function') hablar("Plato vacío. ¡Empecemos otra vez!");
}

function verificarRespuesta() {
    if (canastaActual === metaZanahorias) {
        const felicitacion = "¡Yupi! Pusiste la cantidad exacta en el plato. ¡Muchas gracias por alimentarme!";
        hablarConReflejoJ1(felicitacion, 'burbujaTexto');
        
        const btnSig = document.getElementById('btnSiguienteJuego');
        if (btnSig) btnSig.classList.remove('oculto');
    } else {
        const error = `¡Oh no! Pusiste ${canastaActual} zanahorias, pero yo necesito exactamente ${metaZanahorias}. ¡Vacía el plato e inténtalo de nuevo!`;
        hablarConReflejoJ1(error, 'burbujaTexto');
    }
}