// Dependencies
require('dotenv').config()
const { PORT = 3000, MONGODB_URL } = process.env
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

// DB Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
    .on('open', () => console.log('You are connected to mongoose'))
    .on('close', () => console.log('You are diconnected from mongoose'))
    .on('error', (error) => console.log(error))

// Models
const ProductsSchema = new mongoose.Schema({
    name: String,
    manufacturer: String,
    image: String,
    desc: String,
    price: String,
    category: String,
})

const Products = mongoose.model('Products', ProductsSchema)

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.send('Hello Garrett')
})
// Product Index
app.get('/product', async (req, res) => {
    try {
        res.json(await Products.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})
// Product Create
app.post('/product', async (req, res) => {
    try {
        res.json(await Products.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})
// Product Update
app.put('/product/:id', async (req, res) => {
    try{
        res.json(
            await Products.findByIdAndUpdate(req.params.id, req.body, {new:true})
        )
    } catch (error) {
        res.status(400).json(error)
    }
})
// Product Delete
app.delete('/product/:id', async (req, res) => {
    try {
        res.json(
            await Products.findByIdAndRemove(req.params.id)
        )
    } catch (error) {
        res.status(400).json(error)
    }
})
// Listener
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))