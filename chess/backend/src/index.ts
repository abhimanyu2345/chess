import { db_Connect } from "./DB/db.js";
import startExpress from "./httpServer/express_serever.js";


startExpress();



db_Connect();