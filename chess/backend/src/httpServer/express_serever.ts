import insertData from "./express_server_components/user_signup";
import Login from "./express_server_components/ExpressLogin";
import { Response, Request } from "express";
import cookieParser from 'cookie-parser'; 
import tokenAuth from "../token_components/tokenAuth";
import fetchGames from "./express_server_components/fetchGames";
import { WebSocketServer } from "ws";
import { Game_Manager } from "../Game_Manger";
import http from 'http';
const cors = require('cors');
const express = require('express');

export const app = express();
// ✅ CORS Configuration
const allowedOrigins = [
  "https://chess-abhimanyu2345s-projects.vercel.app", 
  "http://localhost"
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

const member = new Game_Manager();

// Create an HTTP server from your Express app
const server = http.createServer(app);

// Attach a WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  member.addUser(ws);
  ws.on('close', () => {
    member.removeUser(ws);
  });
});


// ✅ Start Server
export default function startExpress() {
  
  server.listen(5000, '0.0.0.0', () => {
    console.log(`Server is listening on port 5000  AND fronted url: https://chess-abhimanyu2345s-projects.vercel.app/`);
    
  });
}
