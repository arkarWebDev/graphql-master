import { Room } from "./Room";
import { User } from "./User";

export interface IReview {
  id: string;
  user: User;
  room: Room;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
