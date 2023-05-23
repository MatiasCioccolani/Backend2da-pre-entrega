const ARCHIVO = "products.txt";

const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.path = ARCHIVO;
    this.automaticId = 1;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const existCode = this.products.find((prod) => prod.code === code);
      if (existCode) {
        console.log(
          `El código ${code} coincide con el código ya existente de ${existCode.title}`
        );
      }

      const existId = this.products.find(
        (prod) => prod.id === this.automaticId
      );
      if (existId) {
        console.log(
          `El id ${this.automaticId} ya está en uso, no se puede agregar el producto`
        );
      }
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Por favor complete todos los campos solicitados");
      } else {
        const product = {
          id: this.automaticId++,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };

        this.products.push(product);
        console.log(`El producto ${title} fue agregado correctamente`);

        let text = JSON.stringify(this.products, null, 2);

        fs.writeFileSync(ARCHIVO, text, (error) => console.log(error));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      if (this.products.length === 0) {
        console.log("No hay productos disponibles");
      } else {
        console.log("Productos disponibles");
        this.products.forEach((product) => {
          console.log(product);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const productExistent = this.products.find((prod) => prod.id === id);
      if (!productExistent) {
        console.log(`Not found: el producto con el id ${id} no fue encontrado`);
      } else {
        console.log(`El producto con el id ${id} fue encontrado`);
        console.log(productExistent);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, fieldToUpdate, newValue) {
    try {
      const product = this.products.find((prod) => prod.id === id);
      if (!product) {
        console.log("El producto no fue encontrado");
      }

      product[fieldToUpdate] = newValue;

      fs.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2),
        (error) => {
          if (error) {
            console.log("Error al guardar los cambios en el archivo");
          } else {
            console.log("El producto fue actualizado correctamente");
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const index = this.products.findIndex((prod) => prod.id === id);

      if (index === -1) {
        console.log(`No se encontro ningún elemento con el id ${id}`);
        return;
      } else {
        console.log("El elemento del archivo se eliminó correctamente");
      }

      this.products.splice(index, 1);

      fs.readFile(ARCHIVO, "utf-8", (error, data) => {
        if (error) {
          console.log("Ocurrió un error al leer el archivo");
        }

        let productsData = JSON.parse(data);

        productsData = this.products;
        const contenidoActualizado = JSON.stringify(productsData, null, 2);

        fs.writeFile(ARCHIVO, contenidoActualizado, (error) => {
          if (error) {
            console.log("Hubo un error al actualizar el archivo");
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

(async () => {
  try {
    let test = new ProductManager();
    console.log(test.getProducts());
    await test.addProduct(
      "Producto prueba",
      "Este es un producto prueba",
      200,
      "Sin imagen",
      "abc123",
      25
    );
    await test.addProduct(
      "Producto prueba 2",
      "Este es un producto prueba 2",
      200,
      "Sin imagen",
      "abc321",
      25
    );
    await test.addProduct(
      "Producto prueba 3",
      "Este es un producto prueba 3",
      200,
      "Sin imagen",
      "cba123",
      25
    );
    console.log(test.getProducts());
    await test.getProductById(2);
    await test.getProductById(5);
    await test.updateProduct(2, "price", 500);
    await test.deleteProduct(3);
    await test.deleteProduct(5);
  } catch (error) {
    console.log(error);
  }
})();