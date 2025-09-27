const express = require("express")
const { ProductsManager } = require("./dao/ProductsManager")
const { CartManager } = require("./dao/CartManager")
const PORT = 8080

const app = express()
app.use(express.json())

// Rutas para Manejo de Productos (/api/products/)

app.get("/products", async (req, res) => {
    try {
        const products = await ProductsManager.getProducts()
        if (products.length === 0) {
            return res.status(404).send("No hay productos disponibles")
        }
        res.send(products)
    }
    catch (error) {
        console.error("Error al obtener productos:", error)
        return res.status(500).send("Error interno del servidor")
    }
    
})

app.get("/products/:id", async (req, res) => {
    const { id } = req.params
    try {
        const products = await ProductsManager.getProducts(id)
        res.send(products)
    }
    catch (error) {
        console.error("Error al obtener productos:", error)
        return res.status(500).send("Error interno del servidor")
    }
})

app.post("/products", async (req, res) => {
    const {title, description, code, price, status, stock, category, thumbnails } = req.body   
    try {
        if(!title || !description || !code){
            return res.status(400).send("Complete los datos obligatorios: title, description, code")
        }
        const nuevoProducto = await ProductsManager.addProduct(title, description, code, price, status, stock, category, thumbnails)
        res.send(nuevoProducto)
    }
    catch (error) {
        console.error("Error al insertar productos:", error)
        return res.status(500).send("Error interno del servidor")
    }
})

// Rutas para Manejo de Carritos (/api/carts/)

app.get("/carts/:id", async (req, res) => {
    const { id } = req.params
    try {
        const product = await CartManager.getCarts(id)
        res.send(product)
    } catch (error) {
        console.error("Error al obtener carrito:", error)
        return res.status(500).send("Error interno del servidor")
    }
})

app.post("/carts", async (req, res) => {
    const { products } = req.body
    try {
        const nuevoCarrito = await CartManager.addCart(products)
        res.send(nuevoCarrito)
    } catch (error) {
        console.error("Error al insertar productos:", error)
        return res.status(500).send("Error interno del servidor")
    }
})

app.post("/:cid/carts/:pid", async (req, res) => {
    const { cid, pid } = req.params
    try {
        const product = await CartManager.addProduct(cid, pid)
        res.send(product)
    }
    catch (error) {
        console.error("Error al insertar productos:", error)
        return res.status(500).send("Error interno del servidor")
    }
})

app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto: ${PORT}`)
}
)