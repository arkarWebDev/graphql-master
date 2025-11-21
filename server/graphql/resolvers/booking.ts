import { Query } from "mongoose";
import { createNewBooking, getBookingById } from "../../controllers/booking";
import { BookingInput } from "../../types/booking";
import { IUser } from "../../types/user";

export const bookingResolvers = {
  Query: {
    getBookingById: async (
      _: any,
      { bookingId }: { bookingId: string },
      { user }: { user: IUser }
    ) => getBookingById(bookingId, user),
  },
  Mutation: {
    createNewBooking: async (
      _: any,
      { bookingInput }: { bookingInput: BookingInput },
      { user }: { user: IUser }
    ) => createNewBooking(bookingInput, user.id),
  },
};
