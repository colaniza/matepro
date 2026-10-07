/* ==========================================================================
   storage.js - Gestión del Estado del Estudiante, Progreso y Persistencia
   ========================================================================== */

const STORAGE_KEY = 'misTablas_estudiante_data';

const DEFAULT_AVATARES = [
    { id: 'avatar1', nombre: 'Capitán Matemático', img: 'avatar1.jpg', color: '#ff7675' },
    { id: 'avatar2', nombre: 'Exploradora Estelar', img: 'avatar2.jpg', color: '#74b9ff' },
    { id: 'avatar3', nombre: 'Superhéroe Numérico', img: 'avatar3.jpg', color: '#ffeaa7' },
    { id: 'avatar4', nombre: 'Científica Genio', img: 'avatar4.jpg', color: '#a29bfe' },
    { id: 'avatar5', nombre: 'Astronauta Veloz', img: 'avatar5.jpg', color: '#fd79a8' },
    { id: 'avatar6', nombre: 'Campeón SIMCE', img: 'avatar6.jpg', color: '#55efc4' }
];

const DEFAULT_DATA = {
    nombre: '',
    avatarId: 'avatar1',
    puntos: 0,
    estrellas: 0,
    tablasProgreso: {
        2: { completado: false, porcentaje: 0, estrellas: 0 },
        3: { completado: false, porcentaje: 0, estrellas: 0 },
        4: { completado: false, porcentaje: 0, estrellas: 0 },
        5: { completado: false, porcentaje: 0, estrellas: 0 },
        6: { completado: false, porcentaje: 0, estrellas: 0 },
        7: { completado: false, porcentaje: 0, estrellas: 0 },
        8: { completado: false, porcentaje: 0, estrellas: 0 },
        9: { completado: false, porcentaje: 0, estrellas: 0 },
        10: { completado: false, porcentaje: 0, estrellas: 0 }
    },
    logros: [
        { id: 'primer_ingreso', titulo: '¡Bienvenido Explorador!', desc: 'Te has registrado en la plataforma.', icono: '🌟', obtenido: true },
        { id: 'maestro_2', titulo: 'Maestro del 2', desc: 'Completaste la tabla del 2.', icono: '🥇', obtenido: false },
        { id: 'maestro_5', titulo: 'Especialista del 5', desc: 'Completaste la tabla del 5.', icono: '⭐', obtenido: false },
        { id: 'maestro_10', titulo: 'Experto del 10', desc: 'Completaste la tabla del 10.', icono: '🏆', obtenido: false },
        { id: 'veloz', titulo: 'Velocista Matemático', desc: 'Ganaste el Desafío Contra el Tiempo.', icono: '⚡', obtenido: false },
        { id: 'detective', titulo: 'Detective Supremo', desc: 'Resolviste las pistas numéricas.', icono: '🔍', obtenido: false },
        { id: 'campeon_simce', titulo: 'Campeón SIMCE', desc: 'Aprobaste el ensayo con +80%.', icono: '🎓', obtenido: false }
    ],
    ensayosSimce: []
};

class StorageManager {
    static get() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULT_DATA };
        try {
            const data = JSON.parse(raw);
            return { ...DEFAULT_DATA, ...data };
        } catch (e) {
            return { ...DEFAULT_DATA };
        }
    }

    static save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    static registrarEstudiante(nombre, avatarId) {
        const current = this.get();
        current.nombre = nombre.trim();
        current.avatarId = avatarId;
        this.save(current);
    }

    static getAvatarInfo(avatarId) {
        return DEFAULT_AVATARES.find(a => a.id === avatarId) || DEFAULT_AVATARES[0];
    }

    static actualizarProgresoTabla(tablaNum, porcentaje, estrellasGanadas) {
        const data = this.get();
        if (!data.tablasProgreso[tablaNum]) {
            data.tablasProgreso[tablaNum] = { completado: false, porcentaje: 0, estrellas: 0 };
        }

        const prevPorcentaje = data.tablasProgreso[tablaNum].porcentaje;
        if (porcentaje > prevPorcentaje) {
            data.tablasProgreso[tablaNum].porcentaje = porcentaje;
        }

        if (porcentaje >= 100) {
            data.tablasProgreso[tablaNum].completado = true;
        }

        const prevEstrellas = data.tablasProgreso[tablaNum].estrellas;
        if (estrellasGanadas > prevEstrellas) {
            const dif = estrellasGanadas - prevEstrellas;
            data.estrellas += dif;
            data.puntos += dif * 100;
            data.tablasProgreso[tablaNum].estrellas = estrellasGanadas;
        }

        // Revisar logros
        if (data.tablasProgreso[2].completado) this.desbloquearLogroData(data, 'maestro_2');
        if (data.tablasProgreso[5].completado) this.desbloquearLogroData(data, 'maestro_5');
        if (data.tablasProgreso[10].completado) this.desbloquearLogroData(data, 'maestro_10');

        this.save(data);
    }

    static agregarPuntos(puntos, estrellas = 0) {
        const data = this.get();
        data.puntos += puntos;
        data.estrellas += estrellas;
        this.save(data);
    }

    static desbloquearLogro(logroId) {
        const data = this.get();
        this.desbloquearLogroData(data, logroId);
        this.save(data);
    }

    static desbloquearLogroData(data, logroId) {
        const logro = data.logros.find(l => l.id === logroId);
        if (logro && !logro.obtenido) {
            logro.obtenido = true;
            data.puntos += 200;
        }
    }

    static guardarEnsayoSimce(puntaje, total, respuestas) {
        const data = this.get();
        const porcentaje = Math.round((puntaje / total) * 100);
        
        data.ensayosSimce.push({
            fecha: new Date().toLocaleDateString('es-CL'),
            puntaje,
            total,
            porcentaje,
            respuestas
        });

        if (porcentaje >= 80) {
            this.desbloquearLogroData(data, 'campeon_simce');
        }

        data.puntos += puntaje * 50;
        this.save(data);
    }

    static calcularProgresoTotal() {
        const data = this.get();
        let suma = 0;
        const totalTablas = 9; // 2 al 10
        for (let i = 2; i <= 10; i++) {
            suma += (data.tablasProgreso[i] ? data.tablasProgreso[i].porcentaje : 0);
        }
        return Math.round(suma / totalTablas);
    }
}
