// VALIDACIONES FORMULARIO 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAviso");
  if (form) {
    form.addEventListener("submit", validarFormulario);
  }

  // Inicializar regiones y comunas
  if (typeof region_comuna !== "undefined") {
    inicializarRegionesYComunas();
  } else {
    console.error("region_comuna no está definido al cargar la página.");
  }

  // Prellenar fecha de entrega (+3 horas)
  const fechaEntrega = document.getElementById("fechaEntrega");
  if (fechaEntrega) {
    const ahora = new Date();
    ahora.setHours(ahora.getHours() + 3);
    fechaEntrega.value = ahora.toISOString().slice(0, 16); 
  }
});

// VALIDAR FORMULARIO 
function validarFormulario(event) {
  event.preventDefault();

  let errores = [];

  // Región y Comuna
  const region = document.getElementById("region");
  const comuna = document.getElementById("comuna");
  if (!region.value) errores.push("Debe seleccionar una región.");
  if (!comuna.value) errores.push("Debe seleccionar una comuna.");

  // Nombre
  const nombre = document.getElementById("nombre").value.trim();
  if (nombre.length < 3 || nombre.length > 200) {
    errores.push("El nombre debe tener entre 3 y 200 caracteres.");
  }

  // Email
  const email = document.getElementById("email").value.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email) || email.length > 100) {
    errores.push("Debe ingresar un correo válido (máx. 100 caracteres).");
  }

  // Teléfono (opcional)
  const telefono = document.getElementById("telefono").value.trim();
  if (telefono && !/^\+\d{3}\.\d{8,12}$/.test(telefono)) {
    errores.push("El teléfono debe estar en formato +NNN.NNNNNNNN");
  }

  // Contactar por (opcional)
  const contactos = document.querySelectorAll(".contactoExtra input");
  if (contactos.length > 5) {
    errores.push("No puede agregar más de 5 contactos.");
  } else {
    contactos.forEach(c => {
      const valor = c.value.trim();
      if (valor.length < 4 || valor.length > 50) {
        errores.push("Cada contacto debe tener entre 4 y 50 caracteres.");
      }
    });
  }
  // Tipo
  const tipo = document.getElementById("tipo").value;
  if (!tipo) errores.push("Debe seleccionar el tipo de mascota.");

  // Cantidad
  const cantidad = parseInt(document.getElementById("cantidad").value);
  if (isNaN(cantidad) || cantidad < 1) {
    errores.push("La cantidad debe ser un número entero mayor a 0.");
  }

  // Edad
  const edad = parseInt(document.getElementById("edad").value);
  const unidadEdad = document.getElementById("unidadEdad").value;
  if (isNaN(edad) || edad < 1) {
    errores.push("La edad debe ser un número entero mayor a 0.");
  }
  if (!unidadEdad) errores.push("Debe seleccionar la unidad de edad.");

  // Fecha entrega
  const fechaEntrega = document.getElementById("fechaEntrega").value;
  if (!fechaEntrega) {
    errores.push("Debe seleccionar la fecha de entrega.");
  } else {
    const fechaIngresada = new Date(fechaEntrega);
    const ahora = new Date();
    if (fechaIngresada < ahora) {
      errores.push("La fecha de entrega no puede ser menor a la actual.");
    }
  }

  // Fotos
  const fotos = document.querySelectorAll("#fotos input[type='file']");
  let fotosValidas = 0;
  fotos.forEach(f => {
    if (f.files.length > 0) fotosValidas++;
  });
  if (fotosValidas < 1) errores.push("Debe subir al menos una foto.");
  if (fotosValidas > 5) errores.push("Máximo 5 fotos permitidas.");

  // Mostrar errores o confirmar
  if (errores.length > 0) {
    alert("Errores encontrados:\n- " + errores.join("\n- "));
    return;
  }

  // Mostrar modal de confirmación
  document.getElementById("modalConfirmacion").style.display = "block";
}

// CONFIRMACIÓN 
function confirmarEnvio(aceptar) {
  const modal = document.getElementById("modalConfirmacion");

  if (aceptar) {
    modal.style.display = "none";
    document.body.innerHTML = `
      <h2>Hemos recibido la información de adopción, muchas gracias y suerte!</h2>
      <a href="index.html"><button>Volver a la portada</button></a>
    `;
  } else {
    modal.style.display = "none";
  }
}

// AGREGAR FOTO 
function agregarFoto() {
  const fotosDiv = document.getElementById("fotos");
  const totalFotos = fotosDiv.querySelectorAll("input[type='file']").length;

  if (totalFotos >= 5) {
    alert("Máximo 5 fotos permitidas.");
    return;
  }

  const nuevoInput = document.createElement("input");
  nuevoInput.type = "file";
  nuevoInput.accept = "image/*";
  fotosDiv.appendChild(nuevoInput);
}

//  AGREGAR CONTACTO EXTRA 
function agregarContacto(select) {
  const valor = select.value;
  if (!valor) return;

  const div = document.getElementById("contactos");
  const existentes = div.querySelectorAll(".contactoExtra").length;
  if (existentes >= 5) {
    alert("Solo puede agregar hasta 5 contactos.");
    select.value = "";
    return;
  }

  const cont = document.createElement("div");
  cont.className = "contactoExtra";

  const label = document.createElement("label");
  label.textContent = `Ingrese ID o URL de ${valor}:`;

  const input = document.createElement("input");
  input.type = "text";
  input.name = "contacto_" + valor;
  input.minLength = 4;
  input.maxLength = 50;

  cont.appendChild(label);
  cont.appendChild(input);
  div.appendChild(cont);

  select.value = "";
}

// REGIONES Y COMUNAS 
function inicializarRegionesYComunas() {
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");

  if (!regionSelect || !comunaSelect) return;

  // Llenar regiones
  region_comuna.regiones.forEach(region => {
    const opt = document.createElement("option");
    opt.value = region.nombre;
    opt.textContent = region.nombre;
    regionSelect.appendChild(opt);
  });

  // Cuando cambia región, poblar comunas
  regionSelect.addEventListener("change", () => {
    comunaSelect.innerHTML = '<option value="">Seleccione</option>';
    const regionElegida = region_comuna.regiones.find(r => r.nombre === regionSelect.value);
    if (regionElegida) {
      regionElegida.comunas.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.nombre;
        opt.textContent = c.nombre;
        comunaSelect.appendChild(opt);
      });
    }
  });
}

//  LISTADO: CLIC EN FILA 
document.addEventListener("DOMContentLoaded", () => {
  const tablaAvisos = document.getElementById("tablaAvisos");
  if (tablaAvisos) {
    tablaAvisos.querySelectorAll("tbody tr").forEach(fila => {
      fila.addEventListener("click", () => {
        window.location.href = "detalle.html";
      });
    });
  }
});

//  DETALLE: VISOR DE FOTOS 
document.addEventListener("DOMContentLoaded", () => {
  const visor = document.getElementById("visor");
  const fotoGrande = document.getElementById("fotoGrande");
  const btnCerrar = document.getElementById("cerrarVisor");

  if (visor && fotoGrande && btnCerrar) {
    // Función para mostrar la foto en grande
    window.mostrarFoto = function(src) {
      fotoGrande.src = src;
      visor.style.display = "flex";
    };

    // Botón cerrar
    btnCerrar.addEventListener("click", () => {
      visor.style.display = "none";
    });
  }
});
