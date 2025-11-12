import { clients } from "..";

export function sendNotification(userId: string, message: string) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ message, timestamp: Date.now() }));
  }
}
