const { ProductModel } = require("./models/productsModel")

class ProductsManager{
    static products = []

    static async getProducts(limit = 10, page = 1, sort, category, status){
        const filter = {}
        if (category) {
            filter.category = category
        }
        if (typeof status !== 'undefined') {
            const statusBool = (status === 'true' || status === true)
            filter.status = statusBool
        }
        return await ProductModel.paginate(filter, { limit, page, lean: true, sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}})
    }

    static async getProductsById(id){
        return await ProductModel.findById(id)
    }

    static async addProduct(id, title, description, code, price, status, stock,
                            category, thumbnails){
        const newProduct = new ProductModel({id, title, description, code, price, status, stock,
            category, thumbnails})
        await newProduct.save()
        return newProduct
    }    

    static async deleteProduct(id){
        return ProductModel.findByIdAndDelete(id)
    }

    static async updateProduct(id, title, description, code, price, status, stock,
                            category, thumbnails){
        return ProductModel.findByIdAndUpdate(id, {title, description, code, price, status, stock,
            category, thumbnails}, {new: true})
    }
}

module.exports = {ProductsManager}