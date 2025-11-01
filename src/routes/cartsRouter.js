const { Router } = require('express');
const { CartManager } = require("../dao/CartManager")

const cartsRouter = Router();

cartsRouter.get("/", async (req, res) => {
    try {
        const products = await CartManager.getAllCarts()
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({products})
    } catch (error) {
        console.error("Error al obtener carritos:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

cartsRouter.get("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const product = await CartManager.getCartsById(id)
        const prod = product.toObject ? product.toObject() : product;
        res.render("cart", prod)
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

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    try {
        const product = await CartManager.deleteProduct(cid, pid)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({product})
    }
    catch (error) {
        console.error("Error al eliminar producto:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

cartsRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await CartManager.deleteAllProducts(cid)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({cart})
    }
    catch (error) {
        console.error("Error al vaciar carrito:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

cartsRouter.put("/:cid", async (req, res) => {
    const { cid } = req.params
    const products = req.body
    try {
        const updatedCart = await CartManager.updateCart(cid, products)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({updatedCart})
    }
    catch (error) {
        console.error("Error al actualizar carrito:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const updatedProduct = await CartManager.updateProductQuantity(cid, pid, quantity)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({updatedProduct})
    }
    catch (error) {
        console.error("Error al actualizar cantidad del producto:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

module.exports = {cartsRouter};