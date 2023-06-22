const mongoose = require('mongoose')
const {Schema}=mongoose

const QuestionSchema= new Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:false
    },
    student_name:{
        type:String,
        required:true,
        trim:true
    },
    student_email:{
        type:String,
        required:true,
    },
    prof_email:{
        type:String,
        required:true,
    },
    send_date:{
        type:String
    }
})




const Questions=mongoose.model('Questions',QuestionSchema)

module.exports=Questions