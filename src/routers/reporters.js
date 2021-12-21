const express = require('express')
const router = new express.Router()
const Reporter = require('../models/reporters')
const auth = require('../middelware/auth')
const multer  = require('multer')

//Create/post
//Read/get
//Update/patch
//Delete

//SignUp
router.post('/signup', async (req, res) => {
    try {
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({
            reporter,
            token
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//Include image
const uploads = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('Please upload image'))
        }
        cb(null,true)
    }
})

router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try {
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
})

// login 
router.post('/login', async (req, res) => {
    try {
        const reporter = await Reporter.findByCredentials(req.body.email, req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({
            reporter,
            token
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// get all documents
router.get('/reporters', auth, async (req, res) => {
    try {
        const reporter = await Reporter.find({})
        res.status(200).send(reporter)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// get by id 
router.get('/reporters/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const reporter = await Reporter.findById(_id)
        if (!reporter) {
            return res.status(404).send('Unable to find reporter')
        }
        res.status(200).send(reporter)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/profile',auth,(req,res)=>{
    res.send(req.reporter)
})

//update
router.patch('/reporters/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password']
    let isValid = updates.every((el) => allowedUpdates.includes(el))
    if (!isValid) {
        return res.status(400).send("Can't update")
    }
    try {
        const _id = req.params.id
        const reporter = await Reporter.findById(_id)
        if (!reporter) {
            return res.status(404).send('No reporter is found')
        }
        updates.forEach((el) => (reporter[el] = req.body[el]))
        await reporter.save()
        res.status(200).send(reporter)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


// logout
router.delete('/logout', auth, async (req, res) => {
    try {
        req.reporter.tokens = req.reporter.tokens.filter((el) => {
            return el !== req.token

        })
        await req.reporter.save()
        res.status(200).send('Logout successfully')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// logout all
router.delete('/logoutall', auth, async (req, res) => {
    try {
        req.reporter.tokens = []
        await req.reporter.save()
        res.status(200).send('Logout all success')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//Delete
router.delete('/reporters/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const reporter = await Reporter.findByIdAndDelete(_id)
        if (!reporter) {
            return res.status(404).send('No reporter is found')
        }
        res.status(200).send(reporter)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router