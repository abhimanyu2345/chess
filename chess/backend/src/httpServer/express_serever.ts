import insertData from "./express_server_components/user_signup";
import Login from "./express_server_components/ExpressLogin";
import { Response, Request } from "express";
import cookieParser from 'cookie-parser'; 
import tokenAuth from "../token_components/tokenAuth";
import fetchGames from "./express_server_components/fetchGames";

const cors = require('cors');
const express = require('express');

export const app = express();
// ✅ CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URI, 
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// ✅ Apply Middleware in Correct Order
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// ✅ Signup Route
app.post('/signup', async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  console.log(`User: ${username}, Email: ${email}`);
  return await insertData(username, password, email, res);
});

// ✅ Login Route
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  return await Login(username, password, res);
});

// ✅ Token Verification
app.post('/verify-token', (req: Request, res: Response) => {
  const token = req.cookies.authToken;
  if (token) {
    const response = tokenAuth(token);
    return res.status(response.response ? 200 : 400).json({ ...response.result, token });
  }
  return res.status(401).json({ error: "Token not found" });
});

// ✅ Fetch Games Route
app.get('/api/games', (req: Request, res: Response) => {
  const token = req.cookies.authToken;
  if (token) {
    const response = tokenAuth(token);
    if (response.response) {
      return fetchGames(response.result.Id, res);
    }
    return res.status(400).send('Invalid token');
  }
  return res.status(401).send('Token not found');
});

// ✅ Start Server
export default function startExpress() {
  app.listen(5000, '0.0.0.0', () => {
    console.log(`Server is listening on port 5000 fronted url: ${process.env.FRONTEND_URL}`);
    
  });
}
