const path = require('path')
const fs = require('fs')

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero
        this.escritorio = escritorio
    }
}


class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate()
        this.tickets = []
        this.ultimos4 = []

        //? Metodo para iniciar la clase
        this.init()
    }

    get toJSON() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    //? Metodo que se ejecuta al inicializar la clase
    init () {
        const { hoy, tickets, ultimo, ultimos4} = require('../db/data.json')
        if (hoy === this.hoy) {
            this.tickets = tickets
            this.ultimo = ultimo
            this.ultimos4 = ultimos4
        } else {
            //? Si llegamos a este punto significa que es otro dia
            this.guardarDB()
        }
    }

    guardarDB() {
        //! Obtenemos la ruta del json
        const dbpath = path.join(__dirname, '../db/data.json')
        //! Metodo para guardar el json
        fs.writeFileSync(dbpath, JSON.stringify(this.toJSON))
    }

    siguiente() {
        //? Le sumamos el numero al ultimo ticket
        this.ultimo++;
        //? Creamos un nuevo ticket
        const ticket = new Ticket(this.ultimo, null)
        //? Lo agregamos al arreglo de tickets
        this.tickets.push(ticket)

        //? Guardamos en la BD
        this.guardarDB()

        //? Retornamos el ticket
        return 'Ticket ' + ticket.numero
    }

    atenderTicket(escritorio) {

        //TODO no tenemos tickers
        if (this.tickets.length === 0) {
            return null
        } 

        //! Obtenemos el primer ticket del arreglo
        const ticket = this.tickets.shift()
        ticket.escritorio = escritorio

        //! Agregamos el ticket al inicio del arreglo
        this.ultimos4.unshift(ticket)

        //! Borramos el ultimo ticket si es mayor a 4
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1)
        }

        this.guardarDB()
        return ticket
    }

}

module.exports = TicketControl