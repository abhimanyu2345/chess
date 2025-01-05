import { useEffect, useState } from "react";

export default function useSocket():WebSocket|null{
    const [WS,SetWs]= useState<null|WebSocket>(null);
    
    useEffect(()=>{
        let socket = new WebSocket('ws://localhost:8080');
        socket.onopen = ()=>{
            SetWs(socket)
        }
        socket.onclose = ()=>{
            SetWs(null);
        }
        return ()=>{
            socket.close();
        }


    },[]);
    return WS;

    
}