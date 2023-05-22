class ProductManager {
  constructor() {
    this.products = []; 
  }

  getProducts() {
    return this.products; 
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const id = this.generateId(); 
    const product = { id, title, description, price, thumbnail, code, stock }; 

    const existingProduct = this.products.find((p) => p.code === code); 
    if (existingProduct) {
      throw new Error('El código del producto ya está en uso.');
    }

    this.products.push(product); 
    return product; 
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id); 
    if (!product) {
      throw new Error('No se encontró ningún producto con el ID proporcionado.'); 
    }

    return product; 
  }

  updateProduct(id, updates) {
    const product = this.getProductById(id); 
    const updatedProduct = { ...product, ...updates }; 
    const index = this.products.findIndex((p) => p.id === id); 
    this.products[index] = updatedProduct; 
    return updatedProduct; 
  }

  deleteProduct(id) {
    const product = this.getProductById(id); 
    const index = this.products.findIndex((p) => p.id === id); 
    this.products.splice(index, 1); 
    return product; 
  }

  generateId() {
    return Date.now(); 
  }
}

const manager = new ProductManager(); 

console.log(manager.getProducts()); 
manager.addProduct(
  'producto prueba',
  'Este es un producto prueba',
  200,
  'Sin imagen',
  'abc123',
  25
);

console.log(manager.getProducts()); 

try {
  manager.addProduct(
    'producto prueba',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc123',
    25
  );
} catch (error) {
  console.error(error.message); 
}

try {
  const updatedProduct = manager.updateProduct(123456789, {
    title: 'Producto actualizado',
    price: 300,
  });
  console.log(updatedProduct); 
} catch (error) {
  console.error(error.message); 
}
