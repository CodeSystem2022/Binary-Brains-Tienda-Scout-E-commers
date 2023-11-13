const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");
const path = require("path");
const { Client } = require('pg'); // Agrega la importación de Client desde 'pg'

// Configura tu cliente de PostgreSQL
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: 'admin',
    port: 5432,
});

// Configura MercadoPago
mercadopago.configure({
	access_token: "TEST-4540234230542330-110820-106b282653334ff7cdb4642116cc97f9-663410698",
});

// Middleware para manejar datos JSON y formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// // Habilita CORS
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Reemplaza con la URL del servidor del cliente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Sirve archivos estáticos desde la carpeta "client"
app.use(express.static(path.join(__dirname, "../client")));

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

// Ruta para crear preferencias de MercadoPago
app.post("/create_preference", (req, res) => {
    let preference = {
        items: [
            {
                title: req.body.description,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quanty),
            }
        ],
        back_urls: {
            "success": "http://localhost:8080",
            "failure": "http://localhost:8080",
            "pending": ""
        },
        auto_return: "approved",
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id
            });
        }).catch(function (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Error al crear preferencia de MercadoPago' });
        });
});

// Ruta para manejar feedback de MercadoPago
app.get('/feedback', function (req, res) {
    res.json({
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id
    });
});

// Conecta a la base de datos PostgreSQL
client.connect()
    .then(() => console.log('Conexión exitosa a PostgreSQL'))
    .catch(err => console.error('Error de conexión a PostgreSQL', err));

// Inicia el servidor en el puerto 8080
app.listen(8080, () => {
    console.log("El servidor está ahora en ejecución en el puerto 8080");
});
