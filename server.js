import express from 'express' 
import * as database from "./database.js"
import bcrypt from "bcrypt"
import { authorize } from './jwt.js'
import * as jwt from "./jwt.js"


const app = express()
app.use(express.json())

app.post("/api/login", async(req, res) => {
  const {email,password} = req.body
  if(!email || !password){
    res.status(400).send({status:"error",messages: "Missing fields"})
    return
  }

  const user = await database.getUserWithEmail(email)
  if(!user){
    res.status(400).send({status:"error",messages: "No such user"})
    return
  }

  const hashedPassword = user.password
  const plainPassword = req.body.password
  const same = await bcrypt.compare(plainPassword,hashedPassword)

  if(!same){
    res.status(400).send({status:"error",messages: "the passwords do not  match"})
  }


  //create jwt token
  const accessToken = jwt.generateToken({
    sub: user.id,
    email: user.email,
    displayName: user.displayName
  });

  console.log(accessToken)

  // res.send({status: "ok",userId:user.id})
  res.send({status: "ok",userId:accessToken})
})

app.post("/api/signup", async (req, res) => {
 
  const {email,password,displayName} = req.body;
  console.log("sign up", req.body)

  if(!email || !password || !displayName){
    res.status(400).send({status:"error",messages: "missing fields"})
    return 
  }

  const salt = await bcrypt.genSalt(13)
  const hashedPassword = await bcrypt.hash(password, salt)
  console.log(salt, hashedPassword)

  
 const user = await database.createUser({email,password: hashedPassword,displayName})

 const userInfo = {
  sub: user.id,
  email: user.email,
  displayName: user.displayName
};
const token = jwt.generateToken(userInfo);

return res.send({ 
  message: "Sign Up Successful. Log in to continue!",
  userId:token
});

})

app.put("/api/users/:id/displayName", authorize,async(req, res) => {


  //grab jwt
  //verify the jwt
  //grab the user if from the jwt 
 
  const userId = req.user.sub
  const {displayName} = req.body

  await database.updateUserDisplayName(userId,displayName);

  
  // const user = await database.updateUserDisplayName(userId, displayName);


  const getUser = await database.getUserById(userId);
  
  const userInfo = {
      sub: getUser.id,
      email: getUser.email,
      displayName: getUser.displayName,
  };
  const token = jwt.generateToken(userInfo);
  console.log("update displayName", displayName)
  return res.send({ 
    status:"Ok!",
    userId:token
  });
  
})

app.put("/api/users/:id/profileImage", (req, res) => {
  console.log("update profile image", req.body)
  res.send({status: "ok"})
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))