const { Router } = require('express')
const { ProductsManager } = require("../dao/ProductsManager.js")

const router=Router()

router.get('/realtimeproducts',async(req,res)=>{

    const products = await ProductsManager.getProducts()
    
    res.render("realTimeProducts",{
        products
    })
})


module.exports={router}