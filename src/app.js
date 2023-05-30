//const express = require("express");
import { Express } from "express";
const PORT = 3000;
const app = express();
//const { ProductManager } = require("./productManager");
import { ProductManager } from "./productManager";

const productManager = new ProductManager();
//const fs = require("fs");

const productos = this.products;

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  try {
    let productsList = await productManager.getProducts();
    res.json(productsList);
  } catch (error) {
    console.log(error);
  }
});

app.get("/products", async (req, res) => {
  let limit = req.query.limit;
  if (!limit || limit !== Number) return res.send({ productos });
  let productosFiltrados = productos.slice(
    (products) => products.limit === limit
  );
  res.send({ productos: productosFiltrados });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
