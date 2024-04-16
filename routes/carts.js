const express = require('express');
const router = express.Router();    

const fs = require('fs');
const filePath = './carts.json';

const readData = () => {
    try {
        const carrito = fs.readFileSync(filePath);
        return JSON.parse(carrito);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No se encontró el carrito de productos');
        } else {
            console.log('Error al cargar carrito:', error.message);
        }
        return [];
    }
};

const writeData = (carrito) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(carrito, null, 2));
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No se encontró el archivo de carritos');
        } else {
            console.log('Error al cargar carrito:', error.message);
        }
        return [];
    }
};

router.post('/', (req, res) => {
    const carts = readData();
    const newCart = {
        id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
        products: []
    };
    carts.push(newCart);
    writeData(carts);
    res.json(newCart);
});

router.get('/:cid', (req, res) => {
    const carts = readData();
    const cart = carts.find(cart => cart.id === Number(req.params.cid));
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado👀' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    // la ruta POST /carts/:cid/product/:pid debe agregar un producto al carrito con id :cid
});

module.exports = router;