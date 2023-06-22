const express= require('express')
const Prof=require('../models/prof')
const Question=require('../models/question')
const Student=require('../models/student')
const Auth=require('../middleware/authProf')
const router=express.Router()   


router.post('/prof/signup', async (req,res)=>{
    const {email,name,password} =req.body
    
    if(!(name && email && password)){
        return res.send('Please provide name, email, and password')
    }

    if(!email.toLowerCase().includes('@prof'))return res.send('please provide the right email type!!')
   
    const checkEmail=await Prof.findOne({email})
    if(checkEmail){
       return res.send('this email is already exist !!')
    }

    const newProf=new Prof(req.body)

    try{
        await newProf.save()
    
        const token=await newProf.createAuthToken()
   
        res.setHeader('Authorization',`Bearer ${token}`)
        res.status(200).send('Signup successful');
    }catch(e){
        console.log(e)
        res.send(e)
    }
})


router.post('/prof/signin',async (req,res)=>{
    const {email,password}=req.body

    const prof=await Prof.findOne({email})
    if(!prof){
        return res.send('user not found!!')
    }
    if(prof.password !== password){
        return res.send('Password is not correct')
    }
  
    try{
        const token=await prof.createAuthToken()
        res.setHeader('Authorization',`Bearer ${token}`)
        res.status(200).send('successfully signed in')
    }catch(e){
        console.log(e)
        res.send(e)
    }

})



router.post('/prof/signout',Auth,async (req,res)=>{
    try{
        req.prof.tokens=req.prof.tokens.filter((token)=>token.token!==req.token)
        await req.prof.save()
        res.status(200).send('loged out successfully')
    }catch(e){
        console.log(e)
        res.send(e) 
    }
})
// notification
router.get('/prof/notification',Auth,async(req,res)=>{
    let notifications=req.prof.notification
    req.prof.notification=[]
    try{
    req.prof.save()
    res.status(200).send(notifications)
    }catch(e){
        console.log(e)
        res.send(e)
    }
})

// get all question that are not answered 
router.get('/prof/allQuestion',Auth,async(req,res)=>{
    try{
        const all = await Question.find({'prof_email':req.prof.email,answer:''}).sort({ 'send_date': -1 });

        if(all.length===0){
            return res.send('there is no questions yet !!')
        }
        res.status(200).send(all)
    }catch(e){
        console.log(e)
        res.send(e)
    }
})

// answer a specific question
router.post('/prof/question/:id',Auth,async(req,res)=>{
    const {answer}=req.body
    const _id=req.params.id
    try{
        const question=await Question.findOne({_id})
        question.answer=answer
        await question.save()
        const student=await Student.findOne({email:question.student_email})
      
        student.notifications=student.notifications.concat({
            'prof_name':req.prof.name,
            'question':question.question,
            'answer':answer,
            'date': new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
        })
        await student.save()
        res.status(200).send(question)
    }catch(e){
        console.log(e)
        res.send(e)
    }
    

})

module.exports=router