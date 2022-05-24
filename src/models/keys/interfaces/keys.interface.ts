import { IUser } from '../../users/interfaces/users.interface';

export interface IKey {
  id?: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: IUser;
}
