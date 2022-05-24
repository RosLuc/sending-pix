import { IKey } from '../../keys/interfaces/keys.interface';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  telephone: string;
  createdAt?: Date;
  updatedAt?: Date;
  keys?: IKey[];
}
