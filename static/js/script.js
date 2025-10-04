// VALIDACIONES FORMULARIO
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAviso");
  if (form) {
    form.addEventListener("submit", validarFormulario);
  }

  inicializarRegionesConFlask();

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
  const telefono = document.getElementById("celular").value.trim();
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
  const fechaEntregaVal = document.getElementById("fechaEntrega").value;
  if (!fechaEntregaVal) {
    errores.push("Debe seleccionar la fecha de entrega.");
  } else {
    const fechaIngresada = new Date(fechaEntregaVal);
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

// CONFIRMACIÓN /Ahora hace submit al servidor
function confirmarEnvio(aceptar) {
  const modal = document.getElementById("modalConfirmacion");

  if (aceptar) {
    modal.style.display = "none";
    // Enviar formulario a Flask
    document.getElementById("formAviso").submit();
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

  const label = document.createElement("label");
  const nuevoInput = document.createElement("input");
  nuevoInput.type = "file";
  nuevoInput.accept = "image/*";
  nuevoInput.name = "fotos";
  
  label.appendChild(nuevoInput);
  fotosDiv.appendChild(label);
}

// AGREGAR CONTACTO EXTRA 
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
  cont.style.marginTop = "10px";
  cont.style.padding = "10px";
  cont.style.backgroundColor = "#f9f9f9";
  cont.style.borderRadius = "5px";

  const label = document.createElement("label");
  label.textContent = `Ingrese ID o URL de ${valor}:`;
  label.style.display = "block";
  label.style.marginBottom = "5px";

  // Input hidden con el tipo de contacto
  const inputTipo = document.createElement("input");
  inputTipo.type = "hidden";
  inputTipo.name = "contacto_tipo";
  inputTipo.value = valor;

  // Input para el identificador/URL
  const input = document.createElement("input");
  input.type = "text";
  input.name = "contacto_id";
  input.minLength = 4;
  input.maxLength = 50;
  input.placeholder = `ID o URL de ${valor}`;
  input.style.width = "70%";
  input.style.marginRight = "10px";

  // Botón para eliminar este contacto
  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.textContent = "Eliminar";
  btnEliminar.className = "btn-eliminar";
  btnEliminar.onclick = function() {
    cont.remove();
  };

  cont.appendChild(label);
  cont.appendChild(inputTipo);
  cont.appendChild(input);
  cont.appendChild(btnEliminar);
  div.appendChild(cont);

  // Resetear el select para poder agregar más
  select.value = "";
}

// REGIONES Y COMUNAS 
function inicializarRegionesConFlask() {
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");

  if (!regionSelect || !comunaSelect) return;

  // Cuando cambia región, cargar comunas desde Flask
  regionSelect.addEventListener("change", function() {
    const regionId = this.value;
    
    if (!regionId) {
      comunaSelect.innerHTML = '<option value="">Seleccione</option>';
      return;
    }

    comunaSelect.innerHTML = '<option value="">Cargando...</option>';
    comunaSelect.disabled = true;

    // Fetch a la API de Flask
    fetch(`/api/comunas/${regionId}`)
      .then(response => response.json())
      .then(data => {
        comunaSelect.innerHTML = '<option value="">Seleccione</option>';
        
        if (data.comunas && data.comunas.length > 0) {
          data.comunas.forEach(comuna => {
            const opt = document.createElement("option");
            opt.value = comuna.id;
            opt.textContent = comuna.nombre;
            comunaSelect.appendChild(opt);
          });
        }
        
        comunaSelect.disabled = false;
      })
      .catch(error => {
        console.error('Error al cargar comunas:', error);
        comunaSelect.innerHTML = '<option value="">Error al cargar</option>';
        comunaSelect.disabled = false;
      });
  });
}

// LISTADO: CLIC EN FILA 
document.addEventListener("DOMContentLoaded", () => {
  const tablaAvisos = document.getElementById("tablaAvisos");
  if (tablaAvisos) {
    tablaAvisos.querySelectorAll("tbody tr").forEach(fila => {
      fila.addEventListener("click", () => {
        //Redirigir a la ruta Flask 
        const avisoId = fila.dataset.avisoId;
        if (avisoId) {
          window.location.href = `/detalle/${avisoId}`;
        }
      });
    });
  }
});

// DETALLE: VISOR DE FOTOS 
document.addEventListener("DOMContentLoaded", () => {
  const visor = document.getElementById("visor");
  const fotoGrande = document.getElementById("fotoGrande");
  const btnCerrar = document.getElementById("cerrarVisor");

  if (visor && fotoGrande && btnCerrar) {
    window.mostrarFoto = function(src) {
      fotoGrande.src = src;
      visor.style.display = "flex";
    };

    btnCerrar.addEventListener("click", () => {
      visor.style.display = "none";
    });
  }
});

// MODAL DE CONFIRMACIÓN - Para botón con onclick
function mostrarConfirmacion() {
  const form = document.getElementById("formAviso");
  
  // Validar manualmente antes de mostrar modal
  let errores = [];
  
  const region = document.getElementById("region").value;
  const comuna = document.getElementById("comuna").value;
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const tipo = document.getElementById("tipo").value;
  const cantidad = document.getElementById("cantidad").value;
  const edad = document.getElementById("edad").value;
  const unidadEdad = document.getElementById("unidadEdad").value;
  const fechaEntrega = document.getElementById("fechaEntrega").value;
  
  if (!region) errores.push("Debe seleccionar una región.");
  if (!comuna) errores.push("Debe seleccionar una comuna.");
  if (nombre.length < 3 || nombre.length > 200) errores.push("El nombre debe tener entre 3 y 200 caracteres.");
  if (!email.includes('@')) errores.push("El email no es válido.");
  if (!tipo) errores.push("Debe seleccionar el tipo de mascota.");
  if (!cantidad || cantidad < 1) errores.push("La cantidad debe ser al menos 1.");
  if (!edad || edad < 1) errores.push("La edad debe ser al menos 1.");
  if (!unidadEdad) errores.push("Debe seleccionar la unidad de edad.");
  if (!fechaEntrega) errores.push("Debe seleccionar la fecha de entrega.");
  
  // Validar contactos (opcional, pero si hay deben ser validos)
  const contactosInputs = document.querySelectorAll('.contactoExtra input[name="contacto_id"]');
  contactosInputs.forEach(input => {
    const valor = input.value.trim();
    if (valor.length > 0 && (valor.length < 4 || valor.length > 50)) {
      errores.push("Cada contacto debe tener entre 4 y 50 caracteres.");
    }
  });

  // Validar fotos
  const fotos = document.querySelectorAll("#fotos input[type='file']");
  let hayFoto = false;
  fotos.forEach(f => {
    if (f.files.length > 0) hayFoto = true;
  });
  if (!hayFoto) errores.push("Debe subir al menos una foto.");
  
  if (errores.length > 0) {
    alert("Errores encontrados:\n- " + errores.join("\n- "));
    return false;
  }
  
  // Si todo está bien, mostrar modal
  document.getElementById("modalConfirmacion").style.display = "block";
  return false;
}