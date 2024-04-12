//al llamar a la clase se ejecutan los métodod del constructor
let juego = new Juego();

let reiniciar = document.getElementById("reiniciar");
reiniciar.addEventListener("click", () => {
    juego.restart();
});

let resolver = document.getElementById("resolver");
resolver.addEventListener("click", () => {
    juego.resolver();
});
