

import insertData from "./express_server_components/user_signup";
import Login from "./express_server_components/ExpressLogin";
import { Response } from "express";
import cookieParser from 'cookie-parser'; 
import tokenAuth from "../token_components/tokenAuth";
import fetchGames from "./express_server_components/fetchGames";

const cors = require('cors');
const express = require('express');

export const app = express();



const allowedOrigins = [
  process.env.FRONTEND_URI, // Vite frontend
  'http://localhost:5173',    // Localhost frontend
   // Another possible device
];

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};


app.use(cors(corsOptions));
app.use(cookieParser());



app.use(express.json());




app.post('/signup', async(req:Request, res: Response) => {
  const { username, password, email } = req.body;

  console.log(`User: ${username}, Email: ${email}`);

    return  await insertData(username,password,email,res);
   
});


app.post('/login', async(req:Request, res:Response)=>{
    const{username,password} =req.body;
  return await Login(username,password,res);


});
app.post('/verify-token', (req:Request, res:Response)=>{
  console.log(req.cookies.authToken);
  const token  = req.cookies.authToken;
  if(token){
  const response =tokenAuth(token);
  console.log(response.result);
  return res.status(response.response?200:400).json({...response.result,'token':token});
}
  else{
    return res.status(401).json({error:"token not found"});

  }
})

app.get('/api/games', (req:Request, res:Response)=>{
  
  const token  =req.cookies.authToken;
  if(token){
    const response =tokenAuth(token);
    if(response.response){

      return fetchGames(response.result.Id,res);
    }
    return res.status(400).send('invalid token');

  }
  return res.status(401).send('token not found');

})


export default function  startExpress(){
  app.listen(5000,'0.0.0.0' ,() => {
    console.log('Server is listening on http://localhost:5000');
  })};












