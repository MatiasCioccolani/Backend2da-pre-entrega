const fs = require('fs');

class Product {
  static id = 0;

  constructor(path) {
    this.path = path;
    this.props = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    try {
      this.products = JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (error) {
      console.log('Error reading file:', error);
      this.products = [];
    }
    Product.id = this.products.reduce((prev, curr) => (
      curr.id >= prev ? curr.id : prev
    ), 0);
  }

  getAllProducts(req, res) {
    try {
      let { limit } = req.query;
      if (limit) {
        let productsWithLimit = this.products.slice(0, limit);
        res.send(productsWithLimit);
      }
      res.send(this.products);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  getProductId(req, res) {
    try {
      let paramId = req.params.pid;
      let productFound = this.products.find(product => product.id == paramId);
      const response = productFound ? productFound : { error: `No se encontró ningún producto con el id ${paramId}` };
      res.send(response);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  isValidateCode(product) {
    return this.products.some(item => item.code === product.code);
  }

  addToCart(req, res) {
    try {
      let newProduct = req.body;
      console.log(newProduct);
      for (let prop of this.props) {
        if (!newProduct.hasOwnProperty(prop) || this.isValidateCode(newProduct)) {
          res.status(400).send('Producto Invalido!');
        }
      }

      this.products = [...this.products, { id: ++Product.id, ...newProduct }];
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
      return res.send(this.products);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  updateProduct(req, res) {
    try {
      let param = parseInt(req.params.pid);
      let updatedFields = req.body;

      const updateProductIndex = this.products.findIndex(product => product.id === param);
      if (updateProductIndex !== -1) {
        Object.assign(this.products[updateProductIndex], updatedFields);
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        res.send(this.products);
      } else {
        res.status(404).send('Product not found');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  deleteProduct(req, res) {
    try {
      const id = parseInt(req.params.pid);
      const filterProducts = this.products.filter(product => product.id !== id);
      fs.writeFileSync(this.path, JSON.stringify(filterProducts, null, 2));
      res.send(filterProducts);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = Product;
