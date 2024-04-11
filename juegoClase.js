class Juego {
    constructor(filas, columnas, espacios) {
        this._filas = filas;
        this._columnas = columnas;
        this._espacios = espacios;
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
        let tabla = document.querySelector("table");
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

        formulario.innerHTML = `
            <label for="ficha">Introduce el número de la ficha que quieres mover</label>
            <input type="number" id="ficha" name="ficha" min="1" max="${this.filas * this.columnas - this.espacios}">
            <label for="movimiento">¿Hacia dónde quieres moverla?</label>
            <select id="movimiento" name="movimiento">
                <option value="arriba">Arriba</option>
                <option value="abajo">Abajo</option>
                <option value="izquierda">Izquierda</option>
                <option value="derecha">Derecha</option>
            </select>
            <input type="submit" value="Mover ficha">
        `;
        document.getElementById("puzzle").appendChild(formulario);
    }

    moverFicha(valorCasilla, movimiento) {
        let espaciolibre = false;

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

        switch (movimiento) {
            case "arriba":
                if (fila > 0 && this.matriz[fila - 1][columna] === " ") {
                    espaciolibre = true;
                }
                break;
            case "abajo":
                if (fila < this.filas - 1 && this.matriz[fila + 1][columna] === " ") {
                    espaciolibre = true;
                }
                break;
            case "izquierda":
                if (columna > 0 && this.matriz[fila][columna - 1] === " ") {
                    espaciolibre = true;
                }
                break;
            case "derecha":
                if (columna < this.columnas - 1 && this.matriz[fila][columna + 1] === " ") {
                    espaciolibre = true;
                }
                break;
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

            let mensaje = document.querySelector("p");
            mensaje.textContent = ""; // Limpiar el mensaje anterior
            if (!this.comprobarVictoria()) {
                mensaje.textContent = `Has realizado ${this.movimientos} movimientos`;
            } else {
                mensaje.textContent = `¡Enhorabuena! Has completado el juego en ${this.tiempoTotal()} minutos y ${this.movimientos} movimientos`;
            }
        } else {
            alert("Movimiento no válido");
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
