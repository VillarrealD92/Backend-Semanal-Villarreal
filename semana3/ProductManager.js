const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.idCounter = 1;
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const productsData = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(productsData);
      this.idCounter = Math.max(...this.products.map(product => product.id), 0) + 1;
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
    } catch (error) {
      throw new Error(`Error al escribir en el archivo: ${error.message}`);
    }
  }

  createId() {
    return this.idCounter++;
  }

  validations(product) {
    for (const key in product) {
      if (typeof product[key] === 'undefined') {
        throw new Error(`ERROR: El campo '${key}' no puede estar indefinido`);
      }
    }

    const checkCode = this.products.find(p => p.code === product.code);
    if (checkCode) {
      throw new Error('ERROR: El código ya está en uso');
    }
  }

  getProductsById(id) {
    const productById = this.products.find(p => p.id === id);
    if (productById) {
      return productById;
    } else {
      throw new Error('Producto no encontrado');
    }
  }

  async getProducts() {
    return this.products;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const id = this.createId();

    const product = {
      id: id,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock
    };

    this.validations(product);
    this.products.push(product);
    await this.saveProducts();
  }

  async updateProduct(id, updatedProductData) {
    const productToUpdate = this.products.find(product => product.id === id);

    if (!productToUpdate) {
      throw new Error('Producto no encontrado');
    } else {
      Object.assign(productToUpdate, updatedProductData);
      await this.saveProducts();
    }
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    } else {
      this.products.splice(productIndex, 1);
      await this.saveProducts();
    }
  }
}

const productManager = new ProductManager('./servicios.json');

// TEST
productManager.addProduct("Nuevo Producto", "Descripción del nuevo producto", 100, "imagen.jpg", "P001", 10);

try {
  const product = productManager.getProductsById(1);
  console.log("Producto encontrado:", product);
} catch (error) {
  console.error(error.message);
}

try {
  productManager.deleteProduct(1);
  console.log("Producto eliminado con éxito");
} catch (error) {
  console.error(error.message);
}