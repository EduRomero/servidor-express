const { CartModel } = require("./models/cartModel")

class CartManager{
    static carts = []

    static async getAllCarts(){
        return await CartModel.find().populate('products.product')
    }

    static async getCartsById(id){
        return await CartModel.findById(id).populate('products.product')
    }

    static async addCart(products){
        const newCart = new CartModel({products})
        await newCart.save()
        return newCart
    }    

    static async addProduct(cid, pid){
        const cart = await CartModel.findById(cid)
        if(!cart){
            return `No se encontró el carrito con id ${cid}`
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid)
        if(productIndex !== -1){
            cart.products[productIndex].quantity += 1
        } else {
            cart.products.push({ product: pid, quantity: 1 })
        }
        await cart.save()
        return cart
    }

    static async deleteProduct(cid, pid){
        const cart = await CartModel.findById(cid)
        if(!cart){
            return `No se encontró el carrito con id ${cid}`
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid)
        if(productIndex !== -1){
            cart.products.splice(productIndex, 1)
            await cart.save()
            return cart
        } else {
            return `No se encontró el producto con id ${pid} en el carrito ${cid}`
        }
    }

    static async deleteAllProducts(cid){
        const cart = await CartModel.findById(cid)
        if(!cart){
            return `No se encontró el carrito con id ${cid}`
        }
        cart.products = []
        await cart.save()
        return cart
    }

    static async updateCart(cid, products){
        const cart = await CartModel.findById(cid)
        if(!cart){
            return `No se encontró el carrito con id ${cid}`
        }
        cart.products = products
        await cart.save()
        return cart
    }

    static async updateProductQuantity(cid, pid, quantity){
        const cart = await CartModel.findById(cid)
        if(!cart){
            return `No se encontró el carrito con id ${cid}`
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid)
        if(productIndex !== -1){
            cart.products[productIndex].quantity = quantity
            await cart.save()
            return cart
        } else {
            return `No se encontró el producto con id ${pid} en el carrito ${cid}`
        }
    }
}

module.exports = {CartManager}