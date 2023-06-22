const express=require('express')
const mongoose=require('mongoose')
const studentRouter=require('./routers/student')
const profRouter =require('./routers/prof')

const app=express()
app.use(express.json())
app.use(studentRouter)
app.use(profRouter)


const port=process.env.PORT || 3000

mongoose.connect('mongodb+srv://andrew:password111@cluster0.k1lrhbw.mongodb.net/question-phase',{
    useUnifiedTopology:true,
    useNewUrlParser: true
})


app.listen(port,()=>{
    console.log(`the app is running on port ${port}`)
})