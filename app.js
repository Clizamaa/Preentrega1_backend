const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = 8080;

const fs = require('fs');
const filePath = './productos.json';

app.get('/products', (req, res) => {
    let productos = [];
    try {
        const data = fs.readFileSync(filePath);
        productos = JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No se encontró el archivo de productos');
        } else {
            console.log('Error al cargar productos:', error.message);
        }
    }

    if (req.query.limit) {
        productos = productos.slice(0, req.query.limit);
    }    
    res.json(productos);
});

app.get('/products/:id', (req, res) => {
    let productos = [];
    try {
        const data = fs.readFileSync(filePath);
        productos = JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No se encontró el archivo de productos');
        } else {
            console.log('Error al cargar productos:', error.message);
        }
    }

    const producto = productos.find(producto => producto.id === Number(req.params.id));
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).json({ error: 'Producto no encontrado👀' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});

