import { IGame } from "./game";

export interface IUser {
  _id?: string;
  email: string;
  name: string;
  password: string;
  games: IGame[];
}
