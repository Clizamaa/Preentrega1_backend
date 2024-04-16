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
    let carts = [];
    const carritos = readData();

    const cart = {
        id: carts.length + 1,
        products: req.body.products
    }
    console.log(cart);
    carts.push(cart);

    writeData(carts);
    res.json({message: 'Carrito agregado'});
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
    let carts = [];
    try {
        const data = fs.readFileSync(filePath);
        carts = JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No se encontró el archivo de carritos');
        } else {
            console.log('Error al cargar carritos:', error.message);
        }
    }

    const cart = carts.find(cart => cart.id === Number(req.params.cid));
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado👀' });
    }

    const product = cart.products.find(product => product.id === Number(req.params.pid));
    if (product) {
        product.quantity++;
    } else {
        cart.products.push({ id: Number(req.params.pid), quantity: 1 });
    }

    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));

    res.json(cart);
});

module.exports = router;