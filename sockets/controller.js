const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo)
    socket.emit('estado-actual', ticketControl.ultimos4)

    //TODO 'tickets-pendientes'
    socket.emit('tickets-pendientes', ticketControl.tickets.length)

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente()
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)

        callback(siguiente)

        //TODO Notificar que hay un nuevo ticket pendiente de asignar

    })

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }

        const ticket = ticketControl.atenderTicket(escritorio)

        //TODO Notificar el cambio en los ultimos 4
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4)

        // TODO Emitir Tickets Pendientes
        socket.emit('tickets-pendientes', ticketControl.tickets.length)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)

        console.log(ticket)
        if (!ticket) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }

    })
}

module.exports = {
    socketController
}

