const express = require("express")
const fs=require("fs")

const PORT = 8080

const app = express()
app.use(express.json())

class ProductsManager{
    static products = []
    static path="./src/products.json"

    static async getProducts(){
        if(fs.existsSync(this.path)){
            this.products=JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            return this.products
        }else{
            return []
        }
    }

    static async getProducts(id){
        if(fs.existsSync(this.path)){
            this.products=JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            const producto=this.products.find(p=>p.id==id)
            return producto
        }else{
            return []
        }
    }

    static async addProduct(title, description, code, price, status, stock,
                            category, thumbnails){
        
        if(!title || !description || !code){
            return `Complete los datos!`
        }

        await this.getProducts()

        let existe=this.products.find(u=>u.code==code)
        if(existe){
            return `Ya existe un producto con codigo ${code}: ${existe.title}`
        }

        let id=1
        if(this.products.length > 0){
            id=Math.max(...this.products.map(d=>d.id))+1
        }
        
        let nuevoProducto={
            id, 
            title,
	        description,
	        code,
	        price,
	        status,
	        stock,
	        category,
	        thumbnails
        }        

        this.products.push(nuevoProducto)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 5))
        return nuevoProducto
    }    
}


class CartManager{
    static carts = []
    static path="./src/carts.json"

    static async getAllCarts(){
        if(fs.existsSync(this.path)){
            this.carts=JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            return this.carts
        }else{
            return []
        }
    }

    static async getCarts(id){
        if(fs.existsSync(this.path)){
            this.carts=JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            const cart=this.carts.find(p=>p.id==id)
            return cart.products
        }else{
            return []
        }
    }

    static async addCart(products){
        await this.getAllCarts()
        let id=1
        console.log(this.carts)
        if(this.carts.length > 0){
            id=Math.max(...this.carts.map(d=>d.id))+1
        }
        else {
            return "error"
        }
        
        let nuevoCarrito={
            id, 
            products
        }        

        this.carts.push(nuevoCarrito)
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 5))
        return nuevoCarrito
    }    

    static async addProduct(cid, pid){
        const product = await this.getCarts(cid)

        if(product.length==0) {
            return "Carrito no encontrado"
        }

        const prodId = product.find(p=>p.productId==pid)
        
        if(prodId==undefined){
            product.push({product: pid, quantity: 1})
        } else {
            prodId.quantity++
        }

        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 5))
        return product
    }
}

// Rutas para Manejo de Productos (/api/products/)

app.get("/products", async (req, res) => {
    const products = await ProductsManager.getProducts()
    res.send(products)
})

app.get("/products/:id", async (req, res) => {
    const { id } = req.params
    const products = await ProductsManager.getProducts(id)
    res.send(products)
})

app.post("/products", async (req, res) => {
    const {title, description, code, price, status, stock, category, thumbnails } = req.body   
    const nuevoProducto = await ProductsManager.addProduct(title, description, code, price, status, stock, category, thumbnails)
    res.send(nuevoProducto)
})

// Rutas para Manejo de Carritos (/api/carts/)

app.get("/carts/:id", async (req, res) => {
    const { id } = req.params
    const product = await CartManager.getCarts(id)
    res.send(product)
})

app.post("/carts", async (req, res) => {
    const { products } = req.body
    const nuevoCarrito = await CartManager.addCart(products)
    res.send(nuevoCarrito)
})

app.post("/:cid/carts/:pid", async (req, res) => {
    const { cid, pid } = req.params
    const nuevoCarrito = await CartManager.addProduct(cid, pid)
    res.send(nuevoCarrito)
})

app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto: ${PORT}`)
}
)