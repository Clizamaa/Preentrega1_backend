const express = require('express');
const fs = require('fs');
const router = express.Router();

const filePath = './productos.json';

const readData = () => {
    try {
        const productos = fs.readFileSync(filePath);
        return JSON.parse(productos);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No se encontró el archivo de productos');
        } else {
            console.log('Error al cargar productos:', error.message);
        }
        return [];
    }
};

const writeData = (productos) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No se encontró el archivo de productos');
        } else {
            console.log('Error al cargar productos (post):', error.message);
        }
        return [];
    }
};

router.get('/', (req, res) => {
    const productos = readData();
    res.json(productos);
   
   if (req.query.limit){
         const limit = parseInt(req.query.limit);
         res.json(productos.slice(0, limit));
   }
});

router.get('/:pid', (req, res) => {

    const productos = readData();
    const pid = Number(req.params.pid);
    const producto = productos.find(producto => producto.id === pid);
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).json({ error: 'Producto no encontrado👀' });
    }
});

router.post('/', (req, res) => {
    const productos = readData();
    const {title, description, code, price, stock, category, thumbnails, status } = req.body;
    if (!title || !description || !code || !price || !stock || !category || status === undefined) {
        return res.status(400).json({ error: 'Faltan datos obligatorios ' });
    }

    const productoExistente = productos.find(producto => producto.code === code);
    if (productoExistente) {
        return res.status(400).json({ error: 'Ya existe un producto con el mismo código' });
    }

    const newProduct = {
        id: productos.length + 1,
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails,
        status: Boolean(status),
    };
    console.log(newProduct);
    productos.push(newProduct);
    writeData(productos);
    res.json({message: 'Producto agregado'});
});

 router.put('/:pid', (req, res) => {
    const productos = readData();
    const pid = Number(req.params.pid);
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;
    const productoIndex = productos.findIndex(producto => producto.id === pid);
    if (productoIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const producto = productos[productoIndex];
    if (title) {
        producto.title = title;
    }
    if (description) {
        producto.description = description;
    }
    if (code) {
        producto.code = code;
    }
    if (price) {
        producto.price = price;
    }
    if (stock) {
        producto.stock = stock;
    }
    if (category) {
        producto.category = category;
    }
    if (thumbnails) {
        producto.thumbnails = thumbnails;
    }
    if (status !== undefined) {
        producto.status = Boolean(status);
    }
    writeData(productos);
    res.json( {message: 'Producto actualizado'});
 }),

router.delete('/:pid', (req, res) => {
    const productos = readData();
    const pid = Number(req.params.pid);
    const productoIndex = productos.findIndex(producto => producto.id === pid);
    if (productoIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    productos.splice(productoIndex, 1);
    writeData(productos);
    res.json({message: 'Producto eliminado' });
}),

module.exports = router;

