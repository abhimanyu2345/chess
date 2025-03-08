import { useEffect, useState } from "react";
import { host } from "../constants/Constants";

export default function useSocket(): WebSocket | null {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Use secure protocol and omit port in production.
    const protocol = process.env.NODE_ENV === "production" ? "wss" : "ws";
    const port = process.env.NODE_ENV === "production" ? "" : ":8080";
    // If no port, then URL is simply "wss://host"
    const socketUrl = port ? `${protocol}://${host}${port}` : `${protocol}://${host}`;

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      setWs(socket);
    };
    socket.onclose = () => {
      setWs(null);
    };
    return () => {
      socket.close();
    };
  }, []);
  
  return ws;
}
