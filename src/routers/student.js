const express= require('express')
const Student=require('../models/student')
const Prof=require('../models/prof')
const Question=require('../models/question')
const Auth=require('../middleware/authStudent')
const router=express.Router()

//sign up
router.post('/student/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    if(!(name && email && password)){
      return res.send('Please provide name, email, and password')
    }
    if(!email.toLowerCase().includes('@stu'))return res.send('please provide the right email type!!')
    const student = await Student.findOne({ email }); 
    if (student) {
      return res.status(401).send('This email is already used before');
    }
    const newStudent = new Student(req.body);
    
    try {
      await newStudent.save();

      const token = await newStudent.createAuthToken();
      res.setHeader('Authorization', `Bearer ${token}`);
      res.status(200).send('Signup successful');
    } catch (e) {
      console.error(e); 
      res.status(400).send('An error occurred');
    }
  });


//sign in 
router.post('/student/signin',async (req,res)=>{
  const {email,password}=req.body
  const student= await Student.findOne({email})
  if(!student){
    return res.status(401).send('this Email is not valid')
  }
  if(student.password !== password){
    return res.send('password is not valid')
  }
  try{
    const token=await student.createAuthToken();
    res.setHeader('Authorization',`Bearer ${token}`)
    res.send('Login successfully')
  }catch(e){
    console.log(e)  
    res.status(401).send(e)
  }
  
})


//sign out 
router.post('/student/signout',Auth,async (req,res)=>{
  try{
    req.student.tokens=req.student.tokens.filter((token)=>token.token!==req.token)
    await req.student.save()
    res.status(200).send('logout successfully')
  }catch(e){
    console.log(e)
    res.send(e)
  }
})


// send question
router.post('/student/question',Auth,async (req,res)=>{
  const{profEmail,question}=req.body
  const checkEmail=await Prof.findOne({email:profEmail})
  if(!checkEmail){
    res.send('the prof email is invalid')
  }
  const q={
    'question':question,
    'prof_email':profEmail,
    'student_name':req.student.name,
    'student_email':req.student.email,
    'send_date': new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
  }

  try{
    const newQ=new Question(q)
    await newQ.save()
    res.status(200).send('the question sent successfully',info)
  }catch(e){
    console.log(e)
    res.send(e) 
  }

})

// // get my answered question
// router.get()


// // get my not answered question
// router.get()


module.exports=router