import { Response } from "express";  // Remove the unused 'response' import
import jwt from 'jsonwebtoken';  // Use 'import' for jwt

const tokenAuth = (token: string): { response: boolean, result: any } => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.PRIVATE_TOKEN as string);
    
    // Return a successful response with the decoded token
    return { response: true, result: decoded };
  } catch (err:any) {
    // Return an error response with the error message
    console.error('Token verification failed:', err);
    return { response: false, result: err.message || 'Invalid token' };
  }
};

export default tokenAuth;
