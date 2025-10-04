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
