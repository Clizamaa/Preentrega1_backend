const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = 8080;

const fs = require('fs');
const filePath = './productos.json';

app.get('/api/products', (req, res) => {
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

app.get('/api/products/:id', (req, res) => {
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

app.post('/api/products', (req, res) => {
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

    const { title, description, code, price, stock, category, thumbnails } = req.body;
    // if (!title || !description || !code || !price || !stock || !category) {
    //     return res.status(400).json({ error: 'Faltan datos obligatorios' });
    // }

    const productoExistente = productos.find(producto => producto.code === code);
    if (productoExistente) {
        return res.status(400).json({ error: 'Ya existe un producto con el mismo código' });
    }

    const producto = {
        id: productos.length + 1,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails
    };
    productos.push(producto);

    try {
        fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
        res.json(producto);
    } catch (error) {
        console.log('Error al guardar productos:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});

