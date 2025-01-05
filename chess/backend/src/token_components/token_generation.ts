import { Response } from "express";
import { Jwt } from "jsonwebtoken"
import { User } from "../Constants/Constants";

const generateToken=(userdata:User)=>{
const jwt =require('jsonwebtoken');
const token= jwt.sign(userdata,process.env.PRIVATE_TOKEN,{expiresIn:'1d'});
   return token;
}
export default generateToken;

