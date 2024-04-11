let filas;
do {
    filas = parseInt(prompt("introduce el numero de filas de la matriz"));
} while (filas <= 0 || isNaN(filas));

let columnas;
do {
    columnas = parseInt(prompt("introduce el numero de columnas de la matriz"));
} while (columnas <= 0 || isNaN(columnas));

let espacios;
do {
    espacios = parseInt(prompt("introduce el número de espacios en blanco"));
} while (espacios <= 0 || espacios >= filas * columnas || isNaN(espacios));

//al llamar a la clase se ejecutan los métodod del constructor
let juego = new Juego(filas, columnas, espacios);

// Agregar evento para el envío del formulario y obtener valores
let formulario = document.getElementById("formulario");
formulario.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevenir el envío del formulario

    let ficha = parseInt(document.getElementById("ficha").value);
    let movimiento = document.getElementById("movimiento").value;

    // Llamar al método moverFicha con los valores obtenidos
    juego.moverFicha(ficha, movimiento);
});
