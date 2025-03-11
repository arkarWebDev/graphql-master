import mongoose from "mongoose";
import { Room } from "../models/room";
import { rooms } from "./data";

const seedRooms = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/");

    await Room.deleteMany();
    console.log("Rooms are destory!!!");

    await Room.insertMany(rooms);
    console.log("Rooms are added!!!");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedRooms();
