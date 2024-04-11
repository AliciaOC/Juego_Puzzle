//al llamar a la clase se ejecutan los métodod del constructor
let juego = new Juego();

// Agregar evento para el envío del formulario y obtener valores
let formulario = document.getElementById("formulario");

formulario.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevenir el envío del formulario

    let ficha = parseInt(document.getElementById("ficha").value);
    let movimiento = document.getElementById("movimiento").value;

    // Llamar al método moverFicha con los valores obtenidos
    juego.moverFicha(ficha, movimiento);
});
