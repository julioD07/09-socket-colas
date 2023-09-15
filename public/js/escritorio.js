

const searchParamas = new URLSearchParams(window.location.search)

if (!searchParamas.has('escritorio')) {
    window.location = 'index.html'
    throw new Error('El escritorio es obligatorio')
}

const escritorio = searchParamas.get('escritorio')
console.log({escritorio})

const socket = io();

const lblEscritorio = document.querySelector('#lblEscritorio')
const btnAtender = document.querySelector('#btnAtender')
const divAlerta = document.querySelector('#alerta')
const divSmall = document.querySelector('#small')
const lblPendientes = document.querySelector('#lblPendientes')

lblEscritorio.innerText = escritorio
divAlerta.style.display = 'none'
divSmall.innerText = `Nadie`

socket.on('connect', () => {
    // console.log('Conectado');

    btnAtender.disabled = false
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    btnAtender.disabled = true
});


socket.on('ultimo-ticket', (ultimoTicket) => {
    // lblNuevoTicket.innerText =  `Ticket ${ultimoTicket}`
})

socket.on('tickets-pendientes', (payload) => {
    console.log(payload)

    if (payload === 0) {
        divAlerta.style.display = ''
    } else {
        
    }

    lblPendientes.innerText = payload
})


btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', {escritorio}, ({ok, ticket}) => {
        
        if (!ok) {
            divSmall.innerText = `Nadie`
            return divAlerta.style.display = ''
        }

        divSmall.innerText = `Ticket ${ticket.numero}`

    })

    // socket.emit('siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket
    // });
});