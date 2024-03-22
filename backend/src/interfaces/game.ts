import { IUser } from "./user";

export interface IGame {
  board: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  categoryId: number;
  first: number;
  computerImage: number;
  userImage: number;
  level: number;
  result: number;
  winners: [number, number, number];
  user: IUser;
}
