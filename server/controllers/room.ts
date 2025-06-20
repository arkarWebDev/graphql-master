import errorHandler from "../middlewares/errorHandler";
import { Room } from "../models/room";
import { Room as RoomType } from "../types/room";
import APIFilters from "../util/apiFilters";
import { NotFoundError } from "../util/not-found";

import { GraphQLError } from "graphql";

export const getAllRooms = errorHandler(async (query: string) => {
  const apiFilters = new APIFilters(Room).search(query);
  const rooms = await apiFilters.model;
  if (rooms.length === 0) {
    throw new NotFoundError("Rooms are not found.");
  }
  return rooms;
});

export const createNewRoom = errorHandler(async (roomInput: RoomType) => {
  const newRoom = await Room.create(roomInput);
  return newRoom;
});

export const getRoomById = errorHandler(async (roomId: string) => {
  const room = await Room.findById(roomId);

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
