"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.default = startExpress;
const user_signup_1 = __importDefault(require("./express_server_components/user_signup"));
const ExpressLogin_1 = __importDefault(require("./express_server_components/ExpressLogin"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const tokenAuth_1 = __importDefault(require("../token_components/tokenAuth"));
const fetchGames_1 = __importDefault(require("./express_server_components/fetchGames"));
const ws_1 = require("ws");
const Game_Manger_1 = require("../Game_Manger");
const http_1 = __importDefault(require("http"));
const cors = require('cors');
const express = require('express');
exports.app = express();
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
exports.app.use(cors(corsOptions));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express.json());
// ✅ Signup Route
exports.app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    console.log(`User: ${username}, Email: ${email}`);
    return yield (0, user_signup_1.default)(username, password, email, res);
}));
// ✅ Login Route
exports.app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    return yield (0, ExpressLogin_1.default)(username, password, res);
}));
// ✅ Token Verification
exports.app.post('/verify-token', (req, res) => {
    const token = req.cookies.authToken;
    if (token) {
        const response = (0, tokenAuth_1.default)(token);
        return res.status(response.response ? 200 : 400).json(Object.assign(Object.assign({}, response.result), { token }));
    }
    return res.status(401).json({ error: "Token not found" });
});
// ✅ Fetch Games Route
exports.app.get('/api/games', (req, res) => {
    const token = req.cookies.authToken;
    if (token) {
        const response = (0, tokenAuth_1.default)(token);
        if (response.response) {
            return (0, fetchGames_1.default)(response.result.Id, res);
        }
        return res.status(400).send('Invalid token');
    }
    return res.status(401).send('Token not found');
});
const member = new Game_Manger_1.Game_Manager();
// Create an HTTP server from your Express app
const server = http_1.default.createServer(exports.app);
// Attach a WebSocket server to the HTTP server
const wss = new ws_1.WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    member.addUser(ws);
    ws.on('close', () => {
        member.removeUser(ws);
    });
});
// ✅ Start Server
function startExpress() {
    server.listen(5000, '0.0.0.0', () => {
        console.log(`Server is listening on port 5000  AND fronted url: https://chess-abhimanyu2345s-projects.vercel.app/`);
    });
}
