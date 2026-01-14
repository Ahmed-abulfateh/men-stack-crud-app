
const express = require('express') // import the express package
const mangoose = require('mongoose')
const dotenv = require('dotenv')

const app = express() // creates an instance of express Server



app.set('view engine', 'ejs') // set the view engine to ejs
dotenv.config() // configure dotenv to use .env file
app.use(express.static('public')) // my app will serve all static files from public folder
app.use(express.urlencoded({ extended: false }));

const mongoose = require('mongoose')// import mongoose package
async function conntentToDB(){
    try{
        // /database_name?
        await mongoose.connect('mongodb+srv://ahmad91bh_db_user:PThAapr5Jw7jcJ7s@ahmed-cluster.vcjqfsm.mongodb.net/CarsDB?retryWrites=true&w=majority')
        console.log('Connection Successful')
    }
    catch(err){
        console.log('Error in Connection')
    }
}
conntentToDB()
//schema
const carSchema = new mongoose.Schema({
    name: String,
    isReadyToDrive: Boolean,
    
})
//model
const Car = mongoose.model('car', carSchema)
// function to create and save a car
async function createCar(){
    const newCar = new Car({
        name: 'mazda',
        isReadyToDrive: true, 
    })
    await newCar.save()
}
//createCar() // uncomment to create and save a car
//routes

// Routes go here
app.get('/', async (req, res) => {
    res.render('homepage.ejs')  
})

// Show all cars
app.get('/cars', async (req, res) => {
    const allCars = await Car.find()
    res.render('all-cars.ejs', { allCars: allCars })
})

app.listen(3000, () => {
    console.log('App is working')
}) // Listen on Port 3000

// Route to show form for adding a new car
app.get('/cars/new', (req, res) => {
    const allCars = Car.find()
    res.render('new-cars.ejs', { allCars: allCars })
})

// Update car form
app.get('/cars/update/:id', async (req, res) => {
    const carToUpdate = await Car.findById(req.params.id)
    res.render('update-cars.ejs', { carToUpdate: carToUpdate })
})

// Handle update submission
app.post('/cars/update/:id', async (req, res) => {
    if (req.body.isReadyToDrive === 'on') {
        req.body.isReadyToDrive = true
    } else {
        req.body.isReadyToDrive = false
    }
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.redirect('/cars')
})

// Create new car
app.post('/cars', async (req, res) => {
    if (req.body.isReadyToDrive === 'on') {
        req.body.isReadyToDrive = true
    } else {
        req.body.isReadyToDrive = false
    }
    const createdCar = await Car.create(req.body)
    res.redirect('/cars')
    console.log(req.body)
})

// Delete a car
app.post('/cars/delete/:id', async (req, res) => {
    const deletedCar = await Car.findByIdAndDelete(req.params.id)
    res.redirect('/cars')
})

// Show details of a car
app.get('/cars/:id', async (req, res) => {
    const foundCar = await Car.findById(req.params.id)
    res.render('cars-details.ejs', { foundCar: foundCar })
})
