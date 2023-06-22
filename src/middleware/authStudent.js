const jwt=require('jsonwebtoken')
const Student=require('../models/student')

const Auth = async function (req, res, next) {
  try {
    if(!req.header('Authorization')){
      return res.status(401).send('not Authorized')
    }
    const authorizationHeader = req.header('Authorization'); 
    if (!authorizationHeader) {
      return res.status(401).send('Authorization header missing');
    }

    const token = authorizationHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.AUTH_KEY);
    const student = await Student.findOne({
      _id: decode._id,
      'tokens.token': token
    });

    if (!student) {
      return res.status(401).send('User is not authorized');
    }

    req.student = student;
    req.token = token;
    next();
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

module.exports=Auth