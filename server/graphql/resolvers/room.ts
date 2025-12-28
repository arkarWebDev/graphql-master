import {
  createNewRoom,
  deleteRoom,
  deleteRoomImage,
  getAllRooms,
  getAllRoomsWithoutFilters,
  getRoomById,
  updateRoom,
} from "../../controllers/room";
import { Room, RoomFilters } from "../../types/room";

export const roomResolvers = {
  Query: {
    getAllRooms: async (
      _: any,
      {
        query,
        filters,
        page,
      }: { query: string; filters: RoomFilters; page: number }
    ) => await getAllRooms(query, filters, page),
    getRoomById: async (_: any, { roomId }: { roomId: string }) =>
      await getRoomById(roomId),
    getAllRoomsWithoutFilters: async () => await getAllRoomsWithoutFilters(),
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
    deleteRoomImage: async (
      _: any,
      { roomId, imageId }: { roomId: string; imageId: string }
    ) => await deleteRoomImage(roomId, imageId),
  },
  Room: {
    ratings: (parent: any) => parent.ratings,
  },
};
