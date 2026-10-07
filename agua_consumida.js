// ===== REFERENCIAS A LOS ELEMENTOS DEL HTML =====
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
// ===== CLAVE DE LOCALSTORAGE =====
const CLAVE = 'agua_estado';
// ===== ESTADO POR DEFECTO =====
// vasos: vasos tomados | meta: vasos por día | ml: tamaño de cada vaso
const estadoInicial = { vasos: 0, meta: 8, ml: 250 };
// ===== LEER EL ESTADO GUARDADO =====
function leerEstado() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        // Si hay datos guardados los usamos; si no, partimos del estado inicial
        return guardado ? { ...estadoInicial, ...JSON.parse(guardado) } : { ...estadoInicial };
    } catch (error) {
      return { ...estadoInicial }; // si algo falla, empezamos desde cero
    }
}
// Al cargar la página recuperamos lo que ya estaba guardado
let estado = leerEstado();
// ===== GUARDAR EL ESTADO =====
function guardarEstado() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
// ===== AGREGAR O QUITAR UN VASO =====
function agregarVaso() {
    estado.vasos++;
    guardarEstado();
    dibujarPantalla();
}
function quitarVaso() {
    if (estado.vasos === 0) return;  // no puede haber vasos negativos
    estado.vasos--;
    guardarEstado();
    dibujarPantalla();
}
// ===== CAMBIAR UN AJUSTE (meta o tamaño del vaso) =====
// Recibe el nombre del ajuste, el campo de texto, y los límites permitidos
function cambiarAjuste(nombre, campo, minimo, maximo) {
    const numero = parseInt(campo.value, 10);
    if (isNaN(numero) || numero < minimo || numero > maximo) return;  // ignora valores inválidos
    estado[nombre] = numero;
    guardarEstado();
    dibujarPantalla();
}
// ===== EMPEZAR UN NUEVO DÍA =====
function reiniciarDia() {
    if (!confirm('¿Quieres empezar un nuevo día? Los vasos volverán a cero.')) return;
    estado.vasos = 0;  // la meta y el tamaño del vaso se conservan
    guardarEstado();
    dibujarPantalla();
}
// ===== ACTUALIZAR TODO LO QUE SE VE EN PANTALLA =====
function dibujarPantalla() {
    // Cálculo del progreso (la barra nunca pasa del 100%)
    const progreso = Math.min(100, (estado.vasos / estado.meta) * 100);
    const litros = (estado.vasos * estado.ml) / 1000;
    // Números y barra
    vasosTexto.textContent = estado.vasos;
    metaTexto.textContent = estado.meta;
    relleno.style.width = progreso + '%';
    barra.setAttribute('aria-valuenow', Math.round(progreso));
    porcentajeTexto.textContent = Math.round(progreso) + '%';
    litrosTexto.textContent = litros.toLocaleString('es-CO', { maximumFractionDigits: 2 }) + ' L';
    // Mensaje según el avance
    mensaje.textContent = estado.vasos >= estado.meta
        ? '¡Meta cumplida! Buen trabajo 💧'
        : `Te faltan ${estado.meta - estado.vasos} vasos para la meta.`;
    // Dibujamos los vasos: llenos los tomados y vacíos los que faltan
    vasosDibujo.innerHTML = '';
    const cantidad = Math.max(estado.meta, estado.vasos);  // si te pasas de la meta, se siguen mostrando
    for (let i = 0; i < cantidad; i++) {
        const vaso = document.createElement('div');
        vaso.className = i < estado.vasos ? 'vaso lleno' : 'vaso';
        vasosDibujo.appendChild(vaso);
    }
    // El botón de quitar se desactiva cuando no hay vasos
    btnQuitar.disabled = estado.vasos === 0;
}
// ===== EVENTOS =====
btnAgregar.addEventListener('click', agregarVaso);
btnQuitar.addEventListener('click', quitarVaso);
btnReiniciar.addEventListener('click', reiniciarDia);
// Los ajustes se guardan mientras se escribe (con límites de 1-20 y 50-1000)
inputMeta.addEventListener('input', () => cambiarAjuste('meta', inputMeta, 1, 20));
inputMl.addEventListener('input', () => cambiarAjuste('ml', inputMl, 50, 1000));
// Al salir de un campo, si quedó vacío o inválido, volvemos al último valor correcto
inputMeta.addEventListener('change', () => { inputMeta.value = estado.meta; });
inputMl.addEventListener('change', () => { inputMl.value = estado.ml; });
// ===== INICIO: se ejecuta al cargar o refrescar la página =====
inputMeta.value = estado.meta;  // muestra la meta guardada en su campo
inputMl.value = estado.ml;      // muestra el tamaño del vaso guardado
dibujarPantalla();              // dibuja todo con los datos guardados