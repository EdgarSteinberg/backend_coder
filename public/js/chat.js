document.addEventListener('DOMContentLoaded', function () {
    // Verificar si la URL actual contiene "/chat"
    if (window.location.href.includes("localhost:8080/chat")) {
        // El código aquí solo se ejecutará en la página http://localhost:8080/chat

        document.getElementById("mensajeForm").addEventListener("submit", (event) => {
            event.preventDefault();
        
            const user = document.getElementById('user').value;
            const message = document.getElementById('message').value;
        
            const nuevoMensaje = {
                user,
                message
            };
        
            // Emitir el mensaje al servidor
            socket.emit('nuevoMensaje', nuevoMensaje);
        
            document.getElementById("mensajeForm").reset()
        });
        
        function mostrarMensaje(mensaje) {
            const messagesLogs = document.getElementById('messagesLogs');
            messagesLogs.innerHTML += `
                <div class="message-container">
                    <h2>${mensaje.user}</h2>
                    <p>${mensaje.message}</p>
                </div>
            `;
        }
        
        // Escuchar el evento de nuevo mensaje desde el servidor
        socket.on('nuevoMensaje', (data) => {
            // Mostrar el mensaje en la interfaz de usuario
            mostrarMensaje(data);
        });
    }
});
