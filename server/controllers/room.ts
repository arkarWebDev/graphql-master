import errorHandler from "../middlewares/errorHandler";
import { Room } from "../models/room";
import { RoomFilters, Room as RoomType } from "../types/room";
import APIFilters from "../util/apiFilters";
import { NotFoundError } from "../util/not-found";

export const getAllRooms = errorHandler(
  async (query: string, filters: RoomFilters, page: number) => {
    const perPage = 6;
    const apiFilters = new APIFilters(Room)
      .search(query)
      .filters(filters)
      .populate("reviews");

    let rooms = await apiFilters.model;
    const totalRoomCount = rooms.length;
    apiFilters.pagination(page, perPage);

    rooms = await apiFilters.model.clone();
    if (rooms.length === 0) {
      throw new NotFoundError("Rooms are not found.");
    }
    return { rooms, pagination: { totalRoomCount, perPage } };
  }
);

export const createNewRoom = errorHandler(async (roomInput: RoomType) => {
  const newRoom = await Room.create(roomInput);
  return newRoom;
});

export const getRoomById = errorHandler(async (roomId: string) => {
  const room = await Room.findById(roomId).populate({
    path: "reviews",
    populate: {
      path: "user",
      model: "User",
    },
  });

  if (!room) {
    throw new NotFoundError("Room not found.");
  }
  return room;
});

export const updateRoom = errorHandler(
  async (roomId: string, roomInput: RoomType) => {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new NotFoundError("Room not found.");
    }

    await room.set(roomInput).save();
    return "Room is updated.";
  }
);

export const deleteRoom = errorHandler(async (roomId: string) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new NotFoundError("Room not found.");
  }

  await room.deleteOne();
  return "Room is destory!";
});
