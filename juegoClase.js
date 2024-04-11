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
        // Los numeros empiezan en 1 y terminan en filas*columnas-espacios
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
        // Eliminar la tabla si ya existe
        if (document.querySelector("table")) {
            document.querySelector("table").remove();
        }

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
        if (!this.comprobarVictoria()) {
            this.imprimirFormulario();
        }
    }

    imprimirFormulario() {
        // Eliminar el formulario si ya existe
        if (document.querySelector("form")) {
            document.querySelector("form").remove();
        }
        // Crear y agregar el formulario al final de la tabla
        let formulario = document.createElement("form");
        formulario.setAttribute("id", "formulario");

        formulario.innerHTML = `
            <label for="ficha">Introduce el número de la ficha que quieres mover</label>
            <input type="number" id="ficha" name="ficha" min="1" max="${this.filas * this.columnas - this.espacios} required">
            <input type="submit" value="Mover ficha">
        `;
        document.getElementById("puzzle").appendChild(formulario);
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
            this.imprimirMatriz();

            if (!this.comprobarVictoria()) {
                mensaje.innerHTML = `Has realizado ${this.movimientos} movimientos`;
            } else {
                mensaje.innerHTML = `¡Enhorabuena! Has completado el juego en ${this.tiempoTotal()} minutos y ${this.movimientos} movimientos`;
            }
        } else {
            mensaje.innerHTML = "Movimiento no válido, intente con un número adyacente al espacio en blanco.";
        }
    }

    restart() {
        let reiniciar = confirm("¿Quieres reiniciar el juego?");
        if (reiniciar) {
            this._tiempoInicio = new Date();
            this._movimientos = 0;
            this.calcularRelleno();
            this.crearMatriz();
            this.imprimirMatriz();
        }
    }

    calcularSolucion() {
        let rellenoOrdenado = [];
        for (let i = 1; i <= this.filas * this.columnas - this.espacios; i++) {
            rellenoOrdenado.push(i);
        }
        let espaciosSolucion = [];
        for (let i = 0; i < this.espacios; i++) {
            espaciosSolucion.push(" ");
        }
        rellenoOrdenado.push(espaciosSolucion);

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
        let tiempoTotal = Math.floor((tiempoFinal - this.tiempoInicio) / 60000);
        return tiempoTotal;
    }
}
