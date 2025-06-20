import {
  createNewRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
} from "../../controllers/room";
import { Room } from "../../types/room";

export const roomResolvers = {
  Query: {
    getAllRooms: async (_: any, { query }: { query: string }) =>
      await getAllRooms(query),
    getRoomById: async (_: any, { roomId }: { roomId: string }) =>
      await getRoomById(roomId),
  },
  Mutation: {
    createNewRoom: async (_: any, { roomInput }: { roomInput: Room }) =>
      await createNewRoom(roomInput),
    updateRoom: async (
      _: any,
      { roomId, roomInput }: { roomId: string; roomInput: Room }
    ) => await updateRoom(roomId, roomInput),
    deleteRoom: async (_: any, { roomId }: { roomId: string }) =>
      await deleteRoom(roomId),
  },
};
