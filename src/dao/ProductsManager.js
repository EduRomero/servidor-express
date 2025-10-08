const fs=require("fs")

class ProductsManager{
    static products = []
    static path="./src/data/products.json"

    static async getProducts(){
        if(fs.existsSync(this.path)){
            this.products=JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            return this.products
        }else{
            return []
        }
    }

    static async getProductsById(id){
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

    static deleteProduct(id){
        let index=this.products.findIndex(p=>p.id==id)
        if(index!=-1){
            this.products.splice(index, 1)
            fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 5))
            return `Producto con id ${id} eliminado`
        }
        return `No existe un producto con id ${id}`
    }

    static async updateProduct(id, title, description, code, price, status, stock,
                            category, thumbnails){
        await this.getProducts()
        let index=this.products.findIndex(p=>p.id==id)
        if(index!=-1){
            this.products[index]={id, title, description, code, price, status, stock,
                category, thumbnails}
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 5))
            return this.products[index]
        }
        return `No existe un producto con id ${id}`
    }
}

module.exports = {ProductsManager}