import { WebSocketServer } from 'ws';
import { Game_Manager } from '../Game_Manger';


const wss = new WebSocketServer({ port: 8080,host:'0.0.0.0' });
const member = new Game_Manager();
const startWebSocket = () =>{
  console.log('wbss started');
wss.on('connection', (ws)=> {
  console.log('connection');
  member.addUser(ws);
  ws.on('close', ()=>{
    member.removeUser(ws);
  })
})};
export default startWebSocket;
