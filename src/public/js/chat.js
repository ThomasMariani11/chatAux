Swal.fire({
        title: "Identifiquese",
        input: "text",
        text:  "ingrese su nickname",
        inputValidator : (value) => {
            return !value && 'debe ingresar un nombre'
        },
        allowOutsideClick: false
    })


    .then(resultado => {
    let {value:nombre} = resultado
    const socket = io()
    document.title = nombre
    const inputMensaje = document.getElementById('chat')
    inputMensaje.focus()
    const divMensajes = document.getElementById('mensajes')

    socket.on('saludo', (saludo, mensajes) => {
        mensajes.forEach(mensaje => {
            let parrafo = document.createElement('p')
            parrafo.classList.add('mensaje')
            parrafo.innerHTML = `<strong>${mensaje.nombre}</strong> dice <i>${mensaje.mensaje}</i>`
            divMensajes.appendChild(parrafo)
        })
        if(nombre){
            socket.emit('id', nombre)
        }
    })

    socket.on('nuevo-usuario', nombre => {
        Swal.fire({
            text: `Bienvenido ${nombre}`,
            toast: true,
            position : 'top-right'
        })
    })
    socket.on('nuevoMensaje', (nombre,mensaje) => {
        let parrafo = document.createElement('p')
        parrafo.classList.add('mensaje')
        parrafo.innerHTML = `<strong>${nombre}</strong> dice <i>${mensaje}</i`
        divMensajes.appendChild(parrafo)
        divMensajes.scrollTop = divMensajes.scrollHeight
    })

    socket.on('saleUsuario',nombre => {
        Swal.fire({
            text: `${nombre} se ha desconectado`,
            toast: true,
            position : 'top-right'
        })
    })
    
    inputMensaje.addEventListener('keyup', e => {
        e.preventDefault()
        // console.log(e, e.target.value);
        if(e.code === 'Enter'){
            if(e.target.value.trim().length > 0){
                socket.emit('mensaje', nombre , e.target.value.trim())
                e.target.value = ''
                e.target.focus()
            }
        }
    })


})