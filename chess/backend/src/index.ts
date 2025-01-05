import { db_Connect } from "./DB/db.js";
import startExpress from "./httpServer/express_serever.js";
import startWebSocket from "./WebSocket/WebsSocketServer.js";

startWebSocket();
startExpress();
db_Connect();