import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import User from './models/User.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 9000

//DATABASE CONNECTIONS
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', err => console.error(error))
db.on('open', () => console.log('Connected to DB!'))

//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//ROUTES
app.get('/users', async (req, res) => {
    try{
        const users = await User.find()
        res.status(200).json(users)
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})


app.post('/login', async (req, res) => {
    try{
        const loginUser = await User.findOne({ email: req.body.email })
        if(!loginUser) return res.status(400).json({message: "Email invalid"})

        if(loginUser.password !== req.body.password ) return res.status(400).json({message: "Incorrect password"})
        res.status(200).json({ message: "Login Success" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
app.post('/register', async (req, res) => {
     
    const email = await User.findOne({ email: req.body.email })
    if(email) return res.json({ message: "Email Already Registered"})
    

    const registerUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    try {
        const saved = await registerUser.save()
        if(saved) return res.status(200).json(saved)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

app.get('/id/:id', async (req, res) => {
    try {
        const id = await User.findById({_id: req.params.id})
        res.status(200).json(id)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

app.patch('/update/:id', async (req, res) =>{
    if(req.body.name == null) return res.json({ message: "Couldn't update null type'"})
    try {
        const updated = await User.updateOne({_id: req.params.id}, {$set: {name: req.body.name}})
        res.status(200).send("Updated")
    } catch (err){
        res.status(400).json({ message: "Error while updating!" })
    }
})


app.delete('/delete/:id', async (req, res) => {
    try {
        const deletedUser = await User.deleteOne({_id: req.params.id})
        res.json({ message: 'Successfully deleted' })
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})
app.use((req, res) => {
    res.status(404).send('Not Found!')
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})
