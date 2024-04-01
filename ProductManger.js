const fs = require('fs');

class ProductManager {

    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
        this.loadProducts(); 
    }

    
    loadProducts() {
        try {
            const data = fs.readFileSync(this.filePath);
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.saveProducts();
            } else {
                console.log('Error al cargar productos:', error.message);
            }
        }
    }

      
       saveProducts() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log('Error al guardar productos:', error.message);
        }
    }

    
    addProduct(titulo, descripcion, precio, miniatura, codigo, stock) {
        const productoExistente = this.products.find(producto => producto.codigo === codigo);
        if (productoExistente) {
            throw new Error('Ya existe un producto con el mismo código');
        }
        const producto = {
            id: this.generarIdProducto(),
            titulo,
            descripcion,
            precio,
            miniatura,
            codigo,
            stock
        };
        this.products.push(producto);
        this.saveProducts(); 
        return producto; 
    }
  
    generarIdProducto() {
        return this.products.length + 1;
    }

    obtenerProductos() {
        return this.products;
    }

    obtenerProductoPorId(id) {
        const producto = this.products.find(producto => producto.id === id);
        if (!producto) {
            throw new Error('Producto no encontrado'); 
        }
        return producto;
    }

    actualizarProducto(id, detalles) {
        const producto = this.obtenerProductoPorId(id);
        Object.assign(producto, detalles);
        this.saveProducts(); 
        return producto;
    }

    eliminarProducto(id) {
        const index = this.products.findIndex(producto => producto.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        const productoEliminado = this.products.splice(index, 1)[0];
        this.saveProducts(); 
        return productoEliminado;
    }
}

const productManager = new ProductManager('productos.json');

// Añadir un producto
// productManager.addProduct('Polera', 'Seleccion Argentina', 100, 'www.adidas.com', 'codigo2', 30);
// productManager.addProduct('Polera', 'Seleccion Brasil', 150, 'www.adidas.com', 'codigo3', 50);

// Obtener un producto por su ID
// const product = productManager.obtenerProductoPorId(1);
// console.log(product);

// Actualizar un producto por su ID
// const updatedProduct = productManager.actualizarProducto(2, { precio: 280 });
// console.log(updatedProduct);

// Eliminar un producto por su ID
// const deletedProduct = productManager.eliminarProducto(2);
// console.log(deletedProduct);

// Obtener todos los productos
// const products = productManager.obtenerProductos();
// console.log(products); 




