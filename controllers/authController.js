const db = require('../config/db');

// Login user and send OTP
exports.login = (req, res) => {
  const { email,password } = req.body;
  console.log(email)
  const sql = 'SELECT * FROM users WHERE email = ?';
  const user1={
    id:"1111",
    name:"Surya",
    email:"1111@gmail.com",
    password:"1111"
  }
  const user2={
    id:"2222",
    name:"Amit",
    email:"2222@gmail.com",
    password:"2222"
  }
  if(email==user1.email && password==user1.password ){
    res.send({status:"ok",...user1});
  }

  else if(email==user2.email && password==user2.password){
    res.send({status:"ok",...user2});
  }
  else{
    res.send({message:"Incorrect password or email"})
  }
};
