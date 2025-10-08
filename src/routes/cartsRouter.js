const { Router } = require('express');
const { CartManager } = require("../dao/CartManager")

const cartsRouter = Router();

cartsRouter.get("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const product = await CartManager.getCarts(id)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({product})
    } catch (error) {
        console.error("Error al obtener carrito:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

cartsRouter.post("/", async (req, res) => {
    const { products } = req.body
    try {
        const nuevoCarrito = await CartManager.addCart(products)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({nuevoCarrito})
    } catch (error) {
        console.error("Error al insertar productos:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    try {
        const product = await CartManager.addProduct(cid, pid)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({product})
    }
    catch (error) {
        console.error("Error al insertar productos:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

module.exports = {cartsRouter};