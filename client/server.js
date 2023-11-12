const express = require('express');
const { Client } = require('pg');
const path = require('path');
const app = express();
const PORT = 3000;

// Configurar conexión a la base de datos PostgreSQL
const client = new Client({
    user: 'postgres',  // Reemplaza con tu nombre de usuario de PostgreSQL
    host: 'localhost',
    database: 'ecommerce',  // Reemplaza con el nombre de tu base de datos
    password: 'admin',  // Reemplaza con tu contraseña de PostgreSQL
    port: 5432,
});

// Conectar a la base de datos
client.connect()
    .then(() => console.log('Conexión exitosa a PostgreSQL'))
    .catch(err => console.error('Error de conexión a PostgreSQL', err));

// Middleware para manejar datos JSON y formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos (como tu archivo HTML)
app.use(express.static(path.join(__dirname)));

// Ruta para manejar el envío de datos desde el formulario
app.post('/guardarDatos', async (req, res) => {
    const { nombre, apellido, correo, telefono } = req.body;

    // Insertar datos en la base de datos
    const query = 'INSERT INTO promociones (nombre, apellido, correo, telefono) VALUES ($1, $2, $3, $4)';
    try {
        await client.query(query, [nombre, apellido, correo, telefono]);
        console.log('Datos insertados correctamente');
        res.status(200).json({ mensaje: 'Datos guardados correctamente' });
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).json({ mensaje: 'Error al guardar datos' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});