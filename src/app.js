const express = require("express")
const {Server} =require("socket.io")
const { engine } = require("express-handlebars")
const { productsRouter } = require("./routes/productsRouter")
const { cartsRouter } = require("./routes/cartsRouter")
const {router:viewsRouter} =require("./routes/viewsRouter.js")
const path = require('path')
const { connDB } = require("./config/db.js")

const PORT = 8080

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine("hbs", engine({extname: "hbs"}))
app.set("view engine", "hbs")
app.set("views", "./src/views")
app.use(express.static(path.join(__dirname, "public")))

app.use("/api/products", 
    (req, res, next) => { 
        req.socket = serverSocket 
        next() 
    }, 
    productsRouter)

app.use("/api/carts", cartsRouter)
app.use("/",
    (req, res, next) => { 
        req.socket = serverSocket 
        next() 
    }, 
    viewsRouter)

const serverHTTP = app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto: ${PORT}`)
})

const serverSocket=new Server(serverHTTP)

connDB(
    "mongodb+srv://coder1:j1b6QKgTB7xsNVUh@cluster0.k4jsbix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    "shop_data"
)