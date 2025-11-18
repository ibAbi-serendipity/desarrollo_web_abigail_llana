document.addEventListener("DOMContentLoaded", () => {
    const filas = document.querySelectorAll("[data-aviso-id]");

    filas.forEach(fila => {
        const id = fila.getAttribute("data-aviso-id");
        cargarPromedio(id);
    });
});

// Obtener promedio
async function cargarPromedio(id) {
    try {
        const resp = await fetch(`http://localhost:8080/api/notas/${id}/promedio`);
        const data = await resp.json();

        const span = document.getElementById(`nota-${id}`);

        if (data.promedio === -1) {
            span.textContent = "-";
        } else {
            span.textContent = data.promedio.toFixed(1);
        }

    } catch (e) {
        console.error("Error cargando promedio:", e);
    }
}


// Agregar nota
async function evaluar(event, id) {
    event.stopPropagation();

    let nota = prompt("Ingrese una nota entre 1 y 7:");
    if (nota === null) return;

    // validar que sea entero
    if (!/^[1-7]$/.test(nota)) {
        alert("La nota debe ser un número entero entre 1 y 7.");
        return;
    }

    nota = parseInt(nota);

    try {
        const resp = await fetch(`http://localhost:8080/api/notas/${id}/agregar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valor: nota })
        });

        const data = await resp.json();

        const span = document.getElementById(`nota-${id}`);

        if (data.promedio === -1) {
            span.textContent = "-";
        } else {
            span.textContent = data.promedio.toFixed(1);
        }

        alert("Nota agregada con éxito.");

    } catch (e) {
        console.error("Error evaluando:", e);
        alert("Error con el servidor.");
    }
}
