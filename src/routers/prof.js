const express= require('express')
const Prof=require('../models/prof')
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




module.exports=router