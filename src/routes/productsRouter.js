const { Router } = require('express')
const { ProductsManager } = require("../dao/ProductsManager.js")

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    let { limit, page, sort, category, status } = req.query
    try {
        const { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await ProductsManager.getProducts(limit, page, sort, category, status)
        if (products.length === 0) {
            return res.status(404).send("No hay productos disponibles")
        }
        res.render("home", {products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage})
    }
    catch (error) {
        console.error("Error al obtener productos:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

productsRouter.get("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const product = await ProductsManager.getProductsById(id)        
        const prod = product.toObject ? product.toObject() : product;
        res.render("product", prod)
    }
    catch (error) {
        console.error("Error al obtener productos:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

productsRouter.post("/", async (req, res) => {
    const {id, title, description, code, price, status, stock, category, thumbnails } = req.body   
    try {
        if(!title || !description || !code){
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error: "Complete los datos obligatorios: title, description, code"})
        }
        
        const nuevoProducto = await ProductsManager.addProduct(id, title, description, code, price, status, stock, category, thumbnails)
        req.socket.emit("nuevoProducto", nuevoProducto)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({nuevoProducto})
    }
    catch (error) {
        console.error("Error al insertar productos:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

productsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const resultado = await ProductsManager.deleteProduct(id)
        req.socket.emit("eliminarProducto", id)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({resultado})
    }
    catch (error) {
        console.error("Error al eliminar productos:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    try {
        if(!title || !description || !code){
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error: "Complete los datos obligatorios: title, description, code"})
        }
        const resultado = await ProductsManager.updateProduct(parseInt(id), title, description, code, price, status, stock, category, thumbnails)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({resultado})
    }
    catch (error) {
        console.error("Error al actualizar productos:", error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error interno del servidor"})
    }
})

module.exports = {productsRouter};