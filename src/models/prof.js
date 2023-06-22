const mongoose=require('mongoose')
const validator=require('validator')
const jwt = require('jsonwebtoken')
const {Schema}=mongoose

const profSchema= new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid Email !!')
            }
            if(!value.toLowerCase().includes('@prof.com')){
                throw new Error('email is invalide, Please add your email type')
            }
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('The Password can not include password')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


profSchema.methods.createAuthToken=async function(){
    const prof= this
    const token=jwt.sign({_id:prof._id.toString()},process.env.AUTH_KEY,{expiresIn:'12h'})
    prof.tokens=prof.tokens.concat({token})
    await prof.save()
    return token;
}


const Prof=mongoose.model('Prof',profSchema)


module.exports= Prof