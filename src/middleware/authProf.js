const jwt=require('jsonwebtoken')
const Prof=require('../models/prof')
const Auth= async function(req,res,next){
 try {  
    if(!req.header('Authorization')){
        return res.status(401).send('not Authorized')
      }
    const authorizationHeader = req.header('Authorization'); 
    if (!authorizationHeader) {
      return res.status(401).send('Authorization header missing');
    }
    const token = authorizationHeader.split(' ')[1];
    const decode=jwt.verify(token,process.env.AUTH_KEY)
    const prof= await Prof.findOne({_id:decode._id,'tokens.token':token})
    if(!prof){
        return res.send('not Authorized user')
    }
    req.prof=prof
    req.token=token
    next()
}catch(e){
    console.log(e)
    throw new Error(e)  
}
}

module.exports=Auth