import { Query } from "mongoose";
import {
  createNewBooking,
  getBookedDatesById,
  getBookingById,
  updateBookingPayment,
} from "../../controllers/booking";
import { BookingInput } from "../../types/booking";
import { IUser } from "../../types/user";

export const bookingResolvers = {
  Query: {
    getBookingById: async (
      _: any,
      { bookingId }: { bookingId: string },
      { user }: { user: IUser }
    ) => getBookingById(bookingId, user),
    getBookedDatesById: async (_: any, { roomId }: { roomId: string }) =>
      getBookedDatesById(roomId),
  },
  Mutation: {
    createNewBooking: async (
      _: any,
      { bookingInput }: { bookingInput: BookingInput },
      { user }: { user: IUser }
    ) => createNewBooking(bookingInput, user.id),

    updateBookingPayment: async (
      _: any,
      {
        bookingId,
        bookingInput,
      }: { bookingId: string; bookingInput: Partial<BookingInput> },
      { user }: { user: IUser }
    ) => updateBookingPayment(bookingId, bookingInput, user),
  },
};
