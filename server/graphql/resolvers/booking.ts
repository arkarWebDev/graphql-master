import { Query } from "mongoose";
import {
  createNewBooking,
  getAllBookings,
  getBookedDatesById,
  getBookingById,
  getBookingByUser,
  getDashboardMetaData,
  updateBookingPayment,
} from "../../controllers/booking";
import { BookingInput } from "../../types/booking";
import { IUser } from "../../types/user";
import { deleteReviewById } from "../../controllers/review";
import { pubsub } from "../../apollo/pubsub";

export const bookingResolvers = {
  Subscription: {
    newBookingNoti: {
      subscribe: () => {
        return pubsub.asyncIterableIterator(["NEW_BOOKING"]);
      },
    },
  },
  Query: {
    getBookingById: async (
      _: any,
      { bookingId }: { bookingId: string },
      { user }: { user: IUser }
    ) => getBookingById(bookingId, user),
    getBookedDatesById: async (_: any, { roomId }: { roomId: string }) =>
      getBookedDatesById(roomId),
    getBookingByUser: async (
      _parent: any,
      _args: any,
      { user }: { user: IUser }
    ) => getBookingByUser(user.id),
    getDashboardMetaData: async (
      _: any,
      { startDate, endDate }: { startDate: Date; endDate: Date }
    ) => getDashboardMetaData(startDate, endDate),
    getAllBookings: async () => getAllBookings(),
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
