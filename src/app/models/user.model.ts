
import { TLiveStatus } from '../types/live-status.type';
import { RoleType } from '../types/role.type';
import { Wallet } from './wallet.model';

export interface User {
  id: string;
  imageUrl: string;
  username: string,
  name: string;
  age: number;
  description?: string;
  price: number;
  status: TLiveStatus;
  createdAt: Date;
  role: RoleType;
  wallet: Wallet;
}
