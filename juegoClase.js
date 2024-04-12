class Juego {
    constructor() {
        this._filas = 3;
        this._columnas = 3;
        this._espacios = 1;
        this._relleno = [];
        this._matriz = [];
        this._tiempoInicio = new Date();
        this._movimientos = 0;
        this._solucion = this.calcularSolucion();
        this.calcularRelleno();
        this.crearMatriz();
        this.calcularSolucion();
        this.imprimirMatriz();
    }

    get filas() {
        return this._filas;
    }

    get columnas() {
        return this._columnas;
    }

    get espacios() {
        return this._espacios;
    }

    get relleno() {
        return this._relleno;
    }

    get matriz() {
        return this._matriz;
    }

    get tiempoInicio() {
        return this._tiempoInicio;
    }

    get movimientos() {
        return this._movimientos;
    }

    get solucion() {
        return this._solucion;
    }

    set filas(filas) {
        this._filas = filas;
    }

    set columnas(columnas) {
        this._columnas = columnas;
    }

    set espacios(espacios) {
        this._espacios = espacios;
    }

    set relleno(relleno) {
        this._relleno = relleno;
    }

    set matriz(matriz) {
        this._matriz = matriz;
    }

    set tiempoInicio(tiempoInicio) {
        this._tiempoInicio = tiempoInicio;
    }

    set movimientos(movimientos) {
        this._movimientos = movimientos;
    }

    set solucion(solucion) {
        this._solucion = solucion;
    }

    calcularRelleno() {
        // Los numeros empiezan en 1 y terminan en 8 por lo que podría hacerlo manualmente, pero lo dejo así por si se cambia el tamaño del puzzle
        for (let i = 1; i <= this.filas * this.columnas - this.espacios; i++) {
            this.relleno.push(i);
        }

        // Añado los espacio en blanco al relleno
        for (let i = 0; i < this.espacios; i++) {
            this.relleno.push(" ");
        }
        // Desordeno el array
        this.relleno = this.shuffle(this.relleno);
    }

    shuffle(arr) {
        //Fisher-Yates shuffle algorithm
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let k = arr[i];
            arr[i] = arr[j];
            arr[j] = k;
        }
        return arr;
    }

    crearMatriz() {
        // Crear matriz con los valores del array relleno
        let contador = 0;
        for (let i = 0; i < this.filas; i++) {
            this.matriz[i] = [];
            for (let j = 0; j < this.columnas; j++) {
                this.matriz[i][j] = this.relleno[contador];
                contador++;
            }
        }
    }

    imprimirMatriz() {
        //Crear tabla y añadir a section con id=puzzle
        let tabla = document.createElement("table");
        document.getElementById("puzzle").appendChild(tabla);

        for (let fila of this.matriz) {
            let tr = document.createElement("tr");
            for (let casilla of fila) {
                let td = document.createElement("td");
                td.textContent = casilla;
                tr.appendChild(td);
            }
            tabla.appendChild(tr);
        }

        // Agregar evento a todas las casillas para que el usuario pueda pulsar la casilla que quiera mover
        let casillas = document.getElementsByTagName("td");
        for (let casilla of casillas) {

            casilla.addEventListener("click", (event) => {

                let ficha = parseInt(event.target.innerHTML);
                juego.moverFicha(ficha);
            });
        };
    }

    moverFicha(valorCasilla) {
        let article = document.getElementById("infoJuego");
        article.innerHTML = "";
        let mensaje = document.createElement("p");
        article.appendChild(mensaje);

        let espaciolibre = false;
        let movimiento = "";

        let fila, columna;
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                if (this.matriz[i][j] === valorCasilla) {
                    fila = i;
                    columna = j;
                    break;
                }
            }
        }

        //Busco si hay espacio en blanco anexo a la casilla y determino el movimiento.
        if (fila > 0 && this.matriz[fila - 1][columna] === " ") {
            espaciolibre = true;
            movimiento = "arriba";
        }
        if (fila < this.filas - 1 && this.matriz[fila + 1][columna] === " ") {
            espaciolibre = true;
            movimiento = "abajo";
        }
        if (columna > 0 && this.matriz[fila][columna - 1] === " ") {
            espaciolibre = true;
            movimiento = "izquierda";
        }
        if (columna < this.columnas - 1 && this.matriz[fila][columna + 1] === " ") {
            espaciolibre = true;
            movimiento = "derecha";
        }

        if (espaciolibre) {
            switch (movimiento) {
                case "arriba":
                    this.matriz[fila - 1][columna] = valorCasilla;
                    this.matriz[fila][columna] = " ";
                    break;
                case "abajo":
                    this.matriz[fila + 1][columna] = valorCasilla;
                    this.matriz[fila][columna] = " ";
                    break;
                case "izquierda":
                    this.matriz[fila][columna - 1] = valorCasilla;
                    this.matriz[fila][columna] = " ";
                    break;
                case "derecha":
                    this.matriz[fila][columna + 1] = valorCasilla;
                    this.matriz[fila][columna] = " ";
                    break;
            }

            this.movimientos++;
            document.querySelector("table").remove();
            this.imprimirMatriz();

            if (!this.comprobarVictoria()) {
                mensaje.innerHTML = `Has realizado ${this.movimientos} movimientos`;
            } else {
                mensaje.innerHTML = `¡Enhorabuena! Has completado el juego en ${this.tiempoTotal()} segundos y ${this.movimientos} movimientos`;
            }
        } else {
            mensaje.innerHTML = "Movimiento no válido, intente con un número adyacente al espacio en blanco.";
        }
    }

    restart() {
        document.querySelector("table").remove();
        this._tiempoInicio = new Date();
        this._movimientos = 0;
        this.crearMatriz();
        document.getElementById("infoJuego").innerHTML = "";
        this.imprimirMatriz();

    }

    calcularSolucion() {
        let rellenoOrdenado = [];
        for (let i = 1; i <= this.filas * this.columnas - this.espacios; i++) {
            rellenoOrdenado.push(i);
        }
        rellenoOrdenado.push(" ");

        const solucion = () => {
            let solucionMatriz = [];
            let contador = 0;
            for (let i = 0; i < this.filas; i++) {
                solucionMatriz[i] = [];
                for (let j = 0; j < this.columnas; j++) {
                    solucionMatriz[i][j] = rellenoOrdenado[contador];
                    contador++;
                }
            }
            return solucionMatriz;
        };

        this.solucion = solucion();
    }


    comprobarVictoria() {
        for (let i = 0; i < this.matriz.length; i++) {
            for (let j = 0; j < this.matriz[i].length; j++) {
                if (this.matriz[i][j] !== this.solucion[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    tiempoTotal() {
        //Calculo los minutos
        let tiempoFinal = new Date();
        let tiempoTotal = Math.floor((tiempoFinal - this.tiempoInicio) / 1000);
        return tiempoTotal;
    }

    resolver() {
        //imprimo una matriz que solo necesita un movimiento para estar resuelta
        let matrizRegalada = [
            [1, 2, 3],
            [4, 5, 6],
            [7, " ", 8]
        ];

        this.movimientos = 0;
        this.tiempoInicio = new Date();
        document.getElementById("infoJuego").innerHTML = "";
        document.querySelector("table").remove();
        this.matriz = matrizRegalada;
        this.imprimirMatriz();
    }
}
