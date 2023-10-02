import { TLiveStatus } from '../types/live-status.type';
import { User } from './user.model';

export interface Room {
  id: string;
  key: string;
  roomName: string;
  imageRoomUrl: string;
  price: number;
  streamers: User[];
  viewers: User[];
  status: TLiveStatus;
  // offers: RoomOA[];
}
