from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.utils import secure_filename
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = 'programacionweb'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
db = SQLAlchemy(app)

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Modelos
class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    comunas = db.relationship('Comuna', backref='region', lazy=True)

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)
    avisos = db.relationship('AvisoAdopcion', backref='comuna', lazy=True)

class AvisoAdopcion(db.Model):
    __tablename__ = 'aviso_adopcion'
    id = db.Column(db.Integer, primary_key=True)
    fecha_ingreso = db.Column(db.DateTime, nullable=False, default=datetime.now)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    sector = db.Column(db.String(100))
    nombre = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    celular = db.Column(db.String(15))
    tipo = db.Column(db.Enum('gato', 'perro'), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    unidad_medida = db.Column(db.Enum('a', 'm'), nullable=False)
    fecha_entrega = db.Column(db.DateTime, nullable=False)
    descripcion = db.Column(db.Text(500))
    fotos = db.relationship('Foto', backref='aviso', lazy=True, cascade='all, delete-orphan')
    contactos = db.relationship('ContactarPor', backref='aviso', lazy=True, cascade='all, delete-orphan')

class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    aviso_id = db.Column(db.Integer, db.ForeignKey('aviso_adopcion.id'), nullable=False)

class ContactarPor(db.Model):
    __tablename__ = 'contactar_por'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra'), nullable=False)
    identificador = db.Column(db.String(150), nullable=False)
    aviso_id = db.Column(db.Integer, db.ForeignKey('aviso_adopcion.id'), nullable=False)

# Validaciones
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validar_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validar_celular(celular):
    if not celular:
        return True
    pattern = r'^\+?56\s?9\s?\d{8}$'
    return re.match(pattern, celular.replace('.', '').replace('-', '')) is not None

def validar_formulario_servidor(form, files):
    errores = []
    # Validar nombre
    nombre = form.get('nombre', '').strip()
    if not nombre:
        errores.append('El nombre es requerido')
    elif len(nombre) < 3:
        errores.append('El nombre debe tener al menos 3 caracteres')
    elif len(nombre) > 200:
        errores.append('El nombre no puede exceder 200 caracteres')
    
    # Validar email 
    email = form.get('email', '').strip()
    if not email:
        errores.append('El email es requerido')
    elif not validar_email(email):
        errores.append('El formato del email no es válido')
    elif len(email) > 100:
        errores.append('El email no puede exceder 100 caracteres')
    
    # Validar celular 
    celular = form.get('celular', '').strip()
    if celular and not validar_celular(celular):
        errores.append('El formato del celular no es válido (debe ser +569XXXXXXXX)')
    if celular and len(celular) > 15:
        errores.append('El celular no puede exceder 15 caracteres')
    
    # Validar región y comuna 
    try:
        region_id = int(form.get('region', 0))
        if region_id <= 0:
            errores.append('Debe seleccionar una región')
        else:
            region = Region.query.get(region_id)
            if not region:
                errores.append('La región seleccionada no es válida')
    except (ValueError, TypeError):
        errores.append('La región seleccionada no es válida')
    
    try:
        comuna_id = int(form.get('comuna', 0))
        if comuna_id <= 0:
            errores.append('Debe seleccionar una comuna')
        else:
            comuna = Comuna.query.get(comuna_id)
            if not comuna:
                errores.append('La comuna seleccionada no es válida')
    except (ValueError, TypeError):
        errores.append('La comuna seleccionada no es válida')
    
    # Validar sector
    sector = form.get('sector', '').strip()
    if len(sector) > 100:
        errores.append('El sector no puede exceder 100 caracteres')
    
    # Validar tipo de mascota 
    tipo = form.get('tipo', '')
    if tipo not in ['gato', 'perro']:
        errores.append('Debe seleccionar un tipo de mascota válido (gato o perro)')
    
    # Validar cantidad 
    try:
        cantidad = int(form.get('cantidad', 0))
        if cantidad < 1:
            errores.append('La cantidad debe ser al menos 1')
    except (ValueError, TypeError):
        errores.append('La cantidad debe ser un número válido')
    
    # Validar edad 
    try:
        edad = int(form.get('edad', 0))
        if edad < 1:
            errores.append('La edad debe ser al menos 1')
    except (ValueError, TypeError):
        errores.append('La edad debe ser un número válido')
    
    # Validar unidad de medida 
    unidad_edad = form.get('unidadEdad', '')
    if unidad_edad not in ['meses', 'años']:
        errores.append('Debe seleccionar una unidad de medida válida (meses o años)')
    
    # Validar fecha de entrega
    fecha_entrega_str = form.get('fechaEntrega', '')
    if not fecha_entrega_str:
        errores.append('La fecha de entrega es requerida')
    else:
        try:
            fecha_entrega = datetime.fromisoformat(fecha_entrega_str)
            if fecha_entrega <= datetime.now():
                errores.append('La fecha de entrega debe ser posterior a la fecha actual')
        except (ValueError, TypeError):
            errores.append('El formato de la fecha de entrega no es válido')
    
    # Validar descripción 
    descripcion = form.get('descripcion', '').strip()
    if len(descripcion) > 500:
        errores.append('La descripción no puede exceder 500 caracteres')
    
    # Validar fotos 
    fotos = files.getlist('fotos')
    fotos_validas = [f for f in fotos if f and f.filename]
    
    if not fotos_validas:
        errores.append('Debe subir al menos una foto')
    else:
        for foto in fotos_validas:
            if not allowed_file(foto.filename):
                errores.append(f'El archivo "{foto.filename}" no tiene una extensión válida (permitidas: png, jpg, jpeg, gif, webp)')
    
    # Validar contactos 
    contactos_tipos = form.getlist('contacto_tipo')
    contactos_ids = form.getlist('contacto_id')
    
    for tipo_contacto, id_contacto in zip(contactos_tipos, contactos_ids):
        if tipo_contacto and id_contacto:
            if tipo_contacto not in ['whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra']:
                errores.append(f'El tipo de contacto "{tipo_contacto}" no es válido')
            id_contacto_strip = id_contacto.strip()
            if len(id_contacto_strip) < 4 or len(id_contacto_strip) > 50:
                errores.append(f'El identificador de contacto debe tener entre 4 y 50 caracteres')
    
    return errores

# Rutas
@app.route('/')
def index():
    avisos = AvisoAdopcion.query.order_by(AvisoAdopcion.fecha_ingreso.desc()).limit(5).all()
    return render_template('index.html', avisos=avisos)

@app.route('/agregar', methods=['GET', 'POST'])
def agregar():
    if request.method == 'GET':
        regiones = Region.query.order_by(Region.nombre).all()
        return render_template('agregar.html', regiones=regiones)
    
    errores = validar_formulario_servidor(request.form, request.files)
    
    if errores:
        regiones = Region.query.order_by(Region.nombre).all()
        return render_template('agregar.html', regiones=regiones, errores=errores, form_data=request.form)
    
    try:
        aviso = AvisoAdopcion(
            fecha_ingreso=datetime.now(),
            comuna_id=int(request.form['comuna']),
            sector=request.form.get('sector', '').strip() or None,
            nombre=request.form['nombre'].strip(),
            email=request.form['email'].strip(),
            celular=request.form.get('telefono', '').strip() or None,
            tipo=request.form['tipo'],
            cantidad=int(request.form['cantidad']),
            edad=int(request.form['edad']),
            unidad_medida='a' if request.form['unidadEdad'] == 'años' else 'm',
            fecha_entrega=datetime.fromisoformat(request.form['fechaEntrega']),
            descripcion=request.form.get('descripcion', '').strip() or None
        )
        
        db.session.add(aviso)
        db.session.flush()  
        
        # Guardar fotos
        fotos = request.files.getlist('fotos')
        for foto in fotos:
            if foto and foto.filename and allowed_file(foto.filename):
                filename = secure_filename(foto.filename)
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                filename = f"{timestamp}_{filename}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                foto.save(filepath)
                
                foto_db = Foto(
                    ruta_archivo=f'uploads/{filename}',
                    nombre_archivo=filename,
                    aviso_id=aviso.id
                )
                db.session.add(foto_db)
        
        # Guardar contactos
        contactos_tipos = request.form.getlist('contacto_tipo')
        contactos_ids = request.form.getlist('contacto_id')
        
        for tipo, identificador in zip(contactos_tipos, contactos_ids):
            if tipo and identificador:
                contacto = ContactarPor(
                    nombre=tipo,
                    identificador=identificador.strip(),
                    aviso_id=aviso.id
                )
                db.session.add(contacto)
        
        db.session.commit()
        flash('Aviso de adopción agregado exitosamente!', 'success')
        return redirect(url_for('index'))
        
    except Exception as e:
        db.session.rollback()
        flash(f'Error al guardar el aviso: {str(e)}', 'error')
        regiones = Region.query_by(Region.nombre).all()
        return render_template('agregar.html', regiones=regiones, form_data=request.form)

@app.route('/listado')
def listado():
    page = request.args.get('page', 1, type=int)
    per_page = 5
    
    avisos_paginados = AvisoAdopcion.query.order_by(AvisoAdopcion.fecha_ingreso.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return render_template('listado.html', avisos=avisos_paginados)

@app.route('/detalle/<int:aviso_id>')
def detalle(aviso_id):
    aviso = AvisoAdopcion.query.get_or_404(aviso_id)
    return render_template('detalle.html', aviso=aviso)

@app.route('/api/comunas/<int:region_id>')
def get_comunas(region_id):
    comunas = Comuna.query.filter_by(region_id=region_id).all()
    return {'comunas': [{'id': c.id, 'nombre': c.nombre} for c in comunas]}

if __name__ == '__main__':
    app.run(debug=True)