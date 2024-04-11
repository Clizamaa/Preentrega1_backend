const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const productsRouter = require('./api/products');
const cartsRouter = require('./api/carts');
const PORT = 8080;

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(PORT, () => {
    console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});