const fs = require("fs")

class CartManager{
    static carts = []
    static path="./src/data/carts.json"

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

module.exports = {CartManager}