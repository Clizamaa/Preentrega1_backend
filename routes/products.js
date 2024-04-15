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
    const {title} = req.body;
    console.log(req.body.title);
    // res.json(productos);


});

// router.put('/:pid', (req, res) => {
//     let productos = [];
//     try {
//         const data = fs.readFileSync(filePath);
//         productos = JSON.parse(data);
//     } catch (error) {
//         if (error.code === 'ENOENT') {
//             console.log('No se encontró el archivo de productos');
//         } else {
//             console.log('Error al cargar productos:', error.message);
//         }
//     }

//     const producto = productos.find(producto => producto.id === Number(req.params.id));
//     if (!producto) {
//         return res.status(404).json({ error: 'Producto no encontrado' });
//     }

//     const { title, description, code, price, stock, category, thumbnails } = req.body;

//     if (!title || !description || !code || !price || !stock || !category) {
//         return res.status(400).json({ error: 'Faltan datos obligatorios' });
//     }

//     const productoExistente = productos.find(producto => producto.code === code && producto.id !== Number(req.params.id));
//     if (productoExistente) {
//         return res.status(400).json({ error: 'Ya existe un producto con el mismo código' });
//     }

//     producto.title = title;
//     producto.description = description;
//     producto.code = code;
//     producto.price = price;
//     producto.stock = stock;
//     producto.category = category;
//     producto.thumbnails = thumbnails;

//     try {
//         fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
//         res.json(producto);
//     } catch (error) {
//         console.log('Error al guardar productos:', error.message);
//         res.status(500).json({ error: 'Error interno' });
//     }

// }),

// router.delete('/:pid', (req, res) => {
//     let productos = [];
//     try {
//         const data = fs.readFileSync(filePath);
//         productos = JSON.parse(data);
//     } catch (error) {
//         if (error.code === 'ENOENT') {
//             console.log('No se encontró el archivo de productos');
//         } else {
//             console.log('Error al cargar productos:', error.message);
//         }
//     }

//     const productoIndex = productos.findIndex(producto => producto.id === Number(req.params.id));
//     if (productoIndex === -1) {
//         return res.status(404).json({ error: 'Producto no encontrado' });
//     }

//     const producto = productos[productoIndex];
//     productos.splice(productoIndex, 1);

//     try {
//         fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
//         res.json(producto);
//     } catch (error) {
//         console.log('Error al guardar productos:', error.message);
//         res.status(500).json({ error: 'Error interno' });
//     }
// }),

module.exports = router;

