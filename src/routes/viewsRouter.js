const { Router } = require('express')
const { ProductsManager } = require("../dao/ProductsManager.js")

const router=Router()

router.get('/realtimeproducts',async(req,res)=>{

    const result = await ProductsManager.getProducts()
    let productsArray = result.docs || result || []
    if (!Array.isArray(productsArray)) productsArray = [productsArray]
    const products = productsArray.map(p => p && p.toObject ? p.toObject() : p)
    res.render("realTimeProducts",
        { products }
    )
})


module.exports={router}