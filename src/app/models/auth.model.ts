import { Room } from './room.model';
import { User } from './user.model';

export interface Auth {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthRoom {
  room: Room;
  token: string;
  refreshToken: string;
}
