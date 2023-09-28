import { MessageType } from "../types/message.type";

export interface Message {
  id: string;
  type: MessageType;
  message: string;
  sender_id: string;
  room_id: string;
  created_at: Date;
}
