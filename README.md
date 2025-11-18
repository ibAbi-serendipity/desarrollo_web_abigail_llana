# Tarea 1 - Desarrollo Web
   
   ## Descripción
   Este proyecto implementa un sistema básico de adopción de mascotas utilizando **HTML, CSS y JavaScript**.  
   La tarea incluye las siguientes secciones:
   - **Portada** con menú y últimos 5 avisos.
   - **Formulario** para agregar avisos de adopción con validaciones.
   - **Listado** de avisos con información detallada.
   - **Detalle** de un aviso individual con visor de fotos.
   - **Estadísticas** con gráficos estáticos inventados.
   
   ## Decisiones tomadas
   - Utilicé flexbox para organizar los elementos.
   - Agregué comentarios en el código para mayor claridad.
   - Los gráficos de estadísticas fueron generados con datos ficticios en **Google Colab (Python/Matplotlib)** y exportados como imágenes PNG.

# Tarea 2 – Desarrollo Web  

   ## Descripción  
   Esta segunda parte del proyecto amplía el sistema de adopción de mascotas desarrollado en la **Tarea 1**, integrando ahora **Python (Flask)** y **MySQL** para manejar los datos de manera dinámica.  

   Las funcionalidades implementadas son:  

   - **Portada:** muestra un mensaje de bienvenida, el menú principal y los **últimos 5 avisos de adopción** registrados en la base de datos.  
   - **Agregar aviso de adopción:** despliega el mismo formulario de la Tarea 1, manteniendo las validaciones en **JavaScript**, pero enviando la información mediante **POST** a una ruta de Flask. En el servidor se validan nuevamente los datos y se insertan en las tablas `aviso_adopcion`, `contactar_por` y `foto`. Las imágenes se almacenan físicamente en la carpeta `static/uploads`.  
   - **Listado de avisos:** obtiene todos los avisos desde la base de datos y los muestra paginados de 5 en 5. Al hacer clic en una fila se accede al detalle completo del aviso.  
   - **Detalle de aviso:** muestra la información y las fotos asociadas al aviso seleccionado.  

   ## Decisiones tomadas  
   - Se utilizó **Flask con SQLAlchemy** para manejar la conexión y las relaciones entre tablas, facilitando las operaciones CRUD.  
   - La validación en el servidor replica las reglas de validación del cliente para asegurar la integridad de los datos.  
   - Se implementó un endpoint `/api/comunas/<region_id>` para cargar las comunas dinámicamente desde JavaScript al seleccionar una región, reemplazando el uso del archivo `region_comuna.js` de la Tarea 1.  
   - Las imágenes se renombran con un **timestamp** para evitar conflictos y se guardan en la carpeta `static/uploads`.  
   - Se agregó manejo de errores y mensajes mediante **Flask Flash** para informar al usuario sobre el resultado de cada operación.  

# Tarea 3 – Desarrollo Web

## Descripción
En esta tercera entrega se amplía el sistema de adopción de mascotas desarrollado en la **Tarea 2**, incorporando **estadísticas** y un **sistema de comentarios** para los avisos de adopción. 

Las funcionalidades principales añadidas son:

### Estadísticas
Se implementan **3 gráficos** para analizar los avisos de adopción:

1. **Gráfico de líneas**  
   - Muestra la cantidad de avisos agregados por día.  
   - Eje X: días, Eje Y: cantidad de avisos.

2. **Gráfico de torta**  
   - Muestra el total de avisos de adopción por tipo de mascota: perro o gato.

3. **Gráfico de barras**  
   - Eje X: meses.  
   - Para cada mes, se muestran dos barras: cantidad de avisos de gatos y de perros.  
   - Eje Y: cantidad de avisos.

Todos los gráficos se generan **en el lado del cliente** usando **JavaScript (fetch)** para consultar los endpoints del servidor que obtienen la información desde la base de datos. Se utilizó **Chart.js** para la visualización de los gráficos.

### Sistema de comentarios
Se agrega la funcionalidad para que los usuarios puedan **agregar y visualizar comentarios** en cada aviso de adopción:

- **Agregar comentario**
  - Formulario con campos:
    - Nombre: obligatorio, entre 3 y 80 caracteres.
    - Texto del comentario: obligatorio, mínimo 5 caracteres, área de texto de 4 filas y 50 columnas.
  - Validación tanto en **cliente (JavaScript)** como en **servidor (Flask)**.
  - Los comentarios válidos se insertan en la tabla `comentario` de la base de datos.
  - Se informa al usuario si hay errores de validación y se mantiene el formulario visible para corrección.

- **Listado de comentarios**
  - Se muestran todos los comentarios asociados a un aviso, con:
    - Fecha
    - Nombre del comentarista
    - Texto del comentario
  - Se utiliza **JavaScript asíncrono (fetch)** para cargar los comentarios dinámicamente sin recargar la página.

## Decisiones tomadas 
- Se implementaron **endpoints API** para estadísticas y comentarios, consumidos mediante **fetch** en el cliente.   
- Se eligió **Chart.js** para los gráficos por su facilidad de integración y licencia libre.

# Tarea 4 – Desarrollo Web

## Descripción
En esta tarea se agrega una nueva funcionalidad al sistema de adopción desarrollado previamente en Flask, incorporando ahora un módulo adicional en Spring Boot para manejar la evaluación de los avisos mediante notas.

Las funcionalidades implementadas son:

- Mostrar promedio de notas en el listado de avisos:
Cada aviso muestra su nota promedio. Si no tiene evaluaciones, se muestra “-”.

- Evaluar aviso:
Al hacer clic en “evaluar”, el usuario puede ingresar una nota entre 1 y 7.
La nota se envía mediante JavaScript usando fetch() hacia un servicio REST en Spring Boot.

- Actualización dinámica:
Luego de agregar una nota, el promedio se recalcula y se actualiza en pantalla sin recargar la página.

## Decisiones tomadas 
- Se mantuvo el proyecto original en Flask, sin modificar su estructura ni sus rutas principales.
- Se creó un módulo independiente en Spring Boot para manejar: almacenamiento de notas, cálculo de promedios, validación de rangos (solo enteros entre 1 y 7).
- Las llamadas al backend se realizan de forma asíncrona con fetch() desde el archivo notas.js, ubicado en la carpeta static/js del proyecto Flask.
- El frontend solo muestra un nuevo botón “evaluar” y un contenedor para la nota promedio, sin alterar el resto del diseño del listado.
- Se evitaron dependencias entre Flask y Spring Boot fuera de la comunicación vía API, manteniendo ambos sistemas aislados.

## Cómo ejecutar el proyecto
1. Ejecutar el servidor Flask con
python app.py

2. Ejecutar el servidor Spring Boot con
mvn spring-boot:run