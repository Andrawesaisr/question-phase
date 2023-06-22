const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const validator=require('validator')
const  {Schema} =mongoose

const studentSchema=new Schema({
   name:{
    type:String,
    required:true,
    trim:true
   },
   email:{
    type:String,
    require:true,
    lowercase:true,
    unique:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Email is invalid')
        }
        if(!value.toLowerCase().includes('@stu.com')){
            throw new Error('email is invalide, Please add your email type')
        }
    }
   },
   password:{
    type:String,
    required:true,
    trim:true,
    validate(value){
        if(value.toLowerCase().includes('password')){
            throw new Error('The Password can not include password')
        }
    }
   },tokens:[{
    token:{
        type:String,
        required:true
    }
    }],
    notifications:[
        {
            prof_name:{
                type:String,
                required:true
            },
            question:{
                type:String,
                required:true
            },answer:{
                type:String,
                required:true
            },
            date:{
                type:String
            }
        }
    ]
})

studentSchema.methods.createAuthToken=async function(){
    const student=this
    const token=jwt.sign({_id:student._id.toString()},process.env.AUTH_KEY,{ expiresIn: '12h' })
    student.tokens=student.tokens.concat({token})
    await student.save()
    return token
}


const Student=mongoose.model('Student',studentSchema)

module.exports=Student