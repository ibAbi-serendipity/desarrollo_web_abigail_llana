
// Cargar comentarios al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const listaComentarios = document.getElementById('listaComentarios');
    if (listaComentarios) {
        // Obtener el ID del aviso desde el botón
        const btnAgregar = document.getElementById('btnAgregarComentario');
        if (btnAgregar) {
            const avisoId = btnAgregar.getAttribute('data-aviso-id');
            if (avisoId) {
                cargarComentarios(avisoId);
            }
        }
    }
});

// Cargar comentarios desde el servidor 
async function cargarComentarios(avisoId) {
  try {
    const response = await fetch(`/api/comentarios/${avisoId}`);
    const data = await response.json();
    console.log("Comentarios:", data);

    const lista = document.getElementById("listaComentarios");
    if (!lista) return;

    lista.innerHTML = ""; // limpiar lista

    if (data.comentarios && data.comentarios.length > 0) {
      data.comentarios.forEach(c => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>${escapeHtml(c.nombre)}</strong> 
          <small>${c.fecha}</small><br>
          ${escapeHtml(c.texto)}
        `;
        lista.appendChild(item);
      });
    } else {
      lista.innerHTML = "<li>No hay comentarios todavía.</li>";
    }
  } catch (error) {
    console.error("Error al cargar comentarios:", error);
  }
}

// Agregar comentario 
async function agregarComentario(avisoId) {
  console.log('Intentando agregar comentario al aviso:', avisoId);

  const nombreInput = document.getElementById("nombreComentario");
  const textoInput = document.getElementById("textoComentario");
  const mensajeDiv = document.getElementById("mensajeComentario");
  const btnAgregar = document.getElementById("btnAgregarComentario");

  const nombre = nombreInput.value.trim();
  const texto = textoInput.value.trim();

  // Validación del lado del cliente
  let errores = [];
  if (!nombre) errores.push("El nombre es requerido");
  else if (nombre.length < 3) errores.push("El nombre debe tener al menos 3 caracteres");
  else if (nombre.length > 80) errores.push("El nombre no puede exceder 80 caracteres");

  if (!texto) errores.push("El comentario es requerido");
  else if (texto.length < 5) errores.push("El comentario debe tener al menos 5 caracteres");
  else if (texto.length > 300) errores.push("El comentario no puede exceder 300 caracteres");

  if (errores.length > 0) {
    mostrarMensaje(mensajeDiv, errores.join('. '), 'error');
    return;
  }

  // Deshabilitar mientras se envía
  btnAgregar.disabled = true;
  btnAgregar.textContent = 'Enviando...';

  try {
    const response = await fetch(`/api/comentarios/${avisoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, texto })
    });

    const data = await response.json();

    if (!response.ok) {
      // Mostrar errores del servidor (validaciones)
      const mensajeError = data.errores ? data.errores.join('. ') : data.error || 'Error desconocido';
      mostrarMensaje(mensajeDiv, mensajeError, 'error');
    } else {
      // Éxito
      mostrarMensaje(mensajeDiv, "✓ Comentario agregado exitosamente", "success");
      nombreInput.value = "";
      textoInput.value = "";
      cargarComentarios(avisoId);
    }
  } catch (error) {
    mostrarMensaje(mensajeDiv, "✗ Error al conectar con el servidor", "error");
  } finally {
    btnAgregar.disabled = false;
    btnAgregar.textContent = 'Agregar comentario';
  }
}

// Función auxiliar para mostrar mensajes
function mostrarMensaje(elemento, mensaje, tipo) {
    elemento.textContent = mensaje;
    elemento.className = 'mensaje ' + tipo;
    elemento.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}

// Función auxiliar para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}