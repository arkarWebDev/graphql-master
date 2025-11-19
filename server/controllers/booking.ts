import errorHandler from "../middlewares/errorHandler";
import { Booking } from "../models/booking";
import { BookingInput } from "../types/booking";

export const createNewBooking = errorHandler(
  async (bookingInput: BookingInput, userId: string) => {
    const newBooking = await Booking.create({
      ...bookingInput,
      user: userId,
    });

    return newBooking;
  }
);
