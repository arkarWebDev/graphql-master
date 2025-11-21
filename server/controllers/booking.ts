import errorHandler from "../middlewares/errorHandler";
import { Booking } from "../models/booking";
import { BookingInput } from "../types/booking";
import { IUser } from "../types/user";
import { NotFoundError } from "../util/not-found";

export const createNewBooking = errorHandler(
  async (bookingInput: BookingInput, userId: string) => {
    const newBooking = await Booking.create({
      ...bookingInput,
      user: userId,
    });

    return newBooking;
  }
);

export const getBookingById = errorHandler(
  async (bookingId: string, user: IUser) => {
    const booking = await Booking.findById(bookingId).populate("room");

    if (!booking) {
      throw new NotFoundError("Booking not found.");
    }

    if (!user.role?.includes("admin") && booking.user.toString() !== user.id) {
      throw new Error("You don't have permission to do this");
    }

    return booking;
  }
);
