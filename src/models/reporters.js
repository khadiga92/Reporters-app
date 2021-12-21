const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const multer  = require('multer')

const reporterScehma = mongoose.Schema({
    name:{ 
        type:String,
        required:true,
        trim:true

    },
    age:{
        type:Number,
        default:30,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive number')
            }
        }
    },
    phone:{
        type:Number,
        required:true,
        trim:true,
        //minlength:11,
        // validate(value){
        //     if (!validator.isMobilePhone(value, 'ar-EG')) {
        //         throw new Error('Number must be egyptian number')
        //     }
        // }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{ 
        type:String,  
        required:true,
        trim:true,
        minlength:6
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }

})

reporterScehma.virtual('news',{
    ref:'News',   
    localField:'_id',   
    foreignField:'reporter'
})

reporterScehma.statics.findByCredentials = async(email,password) =>{
    const reporter = await Reporter.findOne({email})
    if(!reporter){
        throw new Error('Unable to login.. Please check email or password')
    }
    const isMatch = await bcrypt.compare(password,reporter.password)
    if(!isMatch){
        throw new Error('Unable to login.. Please check email or password')
    }

    return reporter
}

reporterScehma.pre('save',async function(next){
    const reporter = this
    if(reporter.isModified('password'))
    reporter.password = await bcrypt.hash(reporter.password,8)
    next()
})

reporterScehma.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'NewsApp')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}

reporterScehma.methods.toJSON = function(){
    const reporter = this
    const reporterObject = reporter.toObject()
    delete reporterObject.password
    delete reporterObject.tokens
    return reporterObject
}


const Reporter = mongoose.model('Reporter',reporterScehma)
module.exports = Reporter