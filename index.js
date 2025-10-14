// URL de la API
const API_URL = 'http://www.raydelto.org/agenda.php';

// Cargar contactos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarContactos();
});

// Evento del formulario
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await agregarContacto();
});

// Función para cargar contactos (GET)
async function cargarContactos() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '<div class="loading">Cargando contactos...</div>';

    try {
        // Petición GET a la API
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar los contactos');
        }

        // Convertir respuesta JSON a objeto JavaScript
        const contactos = await response.json();
        
        // Mostrar solo los últimos 10 contactos (los más recientes)
        const contactosRecientes = contactos.slice(-10);
        mostrarContactos(contactosRecientes);
    } catch (error) {
        contactsList.innerHTML = `<div class="error">Error al cargar los contactos: ${error.message}</div>`;
    }
}

// Función para mostrar contactos en HTML
function mostrarContactos(contactos) {
    const contactsList = document.getElementById('contactsList');

    if (!contactos || contactos.length === 0) {
        contactsList.innerHTML = '<div class="empty-state">No hay contactos en la agenda</div>';
        return;
    }

    let html = '<div class="contacts-list">';
    contactos.forEach(contacto => {
        html += `
            <div class="contact-item">
                <div class="contact-name">${contacto.nombre} ${contacto.apellido}</div>
                <div class="contact-phone">Tel: ${contacto.telefono}</div>
            </div>
        `;
    });
    html += '</div>';

    contactsList.innerHTML = html;
}

// Función para agregar contacto (POST)
async function agregarContacto() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const messageDiv = document.getElementById('message');

    messageDiv.innerHTML = '';

    try {
        // Petición POST a la API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Convertir objeto a JSON
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                telefono: telefono
            })
        });

        if (!response.ok) {
            throw new Error('Error al guardar el contacto');
        }

        messageDiv.innerHTML = '<div class="success">Contacto agregado exitosamente</div>';
        
        // Limpiar formulario
        document.getElementById('contactForm').reset();
        
        // Recargar lista
        await cargarContactos();

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);

    } catch (error) {
        messageDiv.innerHTML = `<div class="error">Error al agregar el contacto: ${error.message}</div>`;
    }
}