//----------------------------------//
//--|funcionalidad_agua_consumida|--//
//----------------------------------//
const vasosTexto = document.getElementById('vasos');
const metaTexto = document.getElementById('meta');
const barra = document.getElementById('barra');
const relleno = document.getElementById('relleno');
const porcentajeTexto = document.getElementById('porcentaje');
const litrosTexto = document.getElementById('litros');
const mensaje = document.getElementById('mensaje');
const vasosDibujo = document.getElementById('vasosDibujo');
const btnAgregar = document.getElementById('btnAgregar');
const btnQuitar = document.getElementById('btnQuitar');
const btnReiniciar = document.getElementById('btnReiniciar');
const inputMeta = document.getElementById('inputMeta');
const inputMl = document.getElementById('inputMl');
const CLAVE = 'agua_estado';
const estadoInicial = {
    vasos: 0,
    meta: 8,
    ml: 250
};
//-----------------------------//
//--|leer_el_estado_guardado|--//
//-----------------------------//
function leerEstado() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        return guardado
            ? { ...estadoInicial, ...JSON.parse(guardado) }
            : { ...estadoInicial };
    } catch (error) {
        return { ...estadoInicial };
    }
}
let estado = leerEstado();
function guardarEstado() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
//--------------------------------------//
//--|agregar_y_quitar_un_vaso_de_agua|--//
//--------------------------------------//
function agregarVaso() {
    estado.vasos++;
    guardarEstado();
    dibujarPantalla();
}
function quitarVaso() {
    if (estado.vasos === 0) {
        return;
    }
    estado.vasos--;
    guardarEstado();
    dibujarPantalla();
}
//-------------------------------------//
//--|cambiar_los_ajustes_del_consumo|--//
//-------------------------------------//
function cambiarAjuste(nombre, campo, minimo, maximo) {
    const numero = parseInt(campo.value, 10);
    if (isNaN(numero) || numero < minimo || numero > maximo) {
        return;
    }
    estado[nombre] = numero;
    guardarEstado();
    dibujarPantalla();
}
//--------------------------//
//--|empezar_un_nuevo_dia|--//
//--------------------------//
function reiniciarDia() {
    if (!confirm('¿Quieres empezar un nuevo día? Los vasos volverán a cero.')) {
        return;
    }
    estado.vasos = 0;
    guardarEstado();
    dibujarPantalla();
}
//----------------------------//
//--|actualizar_la_pantalla|--//
//----------------------------//
function dibujarPantalla() {
    const progreso = Math.min(100, (estado.vasos / estado.meta) * 100);
    const litros = (estado.vasos * estado.ml) / 1000;
    vasosTexto.textContent = estado.vasos;
    metaTexto.textContent = estado.meta;
    relleno.style.width = progreso + '%';
    barra.setAttribute('aria-valuenow', Math.round(progreso));
    porcentajeTexto.textContent = Math.round(progreso) + '%';
    litrosTexto.textContent =
        litros.toLocaleString('es-CO', { maximumFractionDigits: 2 }) + ' L';
    mensaje.textContent = estado.vasos >= estado.meta
        ? '¡Meta cumplida! Buen trabajo 💧'
        : `Te faltan ${estado.meta - estado.vasos} vasos para la meta.`;
    vasosDibujo.innerHTML = '';
    const cantidad = Math.max(estado.meta, estado.vasos);
    for (let i = 0; i < cantidad; i++) {
        const vaso = document.createElement('div');
        vaso.className = i < estado.vasos ? 'vaso lleno' : 'vaso';
        vasosDibujo.appendChild(vaso);
    }
    btnQuitar.disabled = estado.vasos === 0;
}
//----------------------------//
//--|eventos_de_los_botones|--//
//----------------------------//
btnAgregar.addEventListener('click', agregarVaso);
btnQuitar.addEventListener('click', quitarVaso);
btnReiniciar.addEventListener('click', reiniciarDia);
inputMeta.addEventListener('input', () => {
    cambiarAjuste('meta', inputMeta, 1, 20);
});
inputMl.addEventListener('input', () => {
    cambiarAjuste('ml', inputMl, 50, 1000);
});
inputMeta.addEventListener('change', () => {
    inputMeta.value = estado.meta;
});
inputMl.addEventListener('change', () => {
    inputMl.value = estado.ml;
});
//---------------------------//
//--|iniciar_la_aplicacion|--//
//---------------------------//
inputMeta.value = estado.meta;
inputMl.value = estado.ml;
dibujarPantalla();