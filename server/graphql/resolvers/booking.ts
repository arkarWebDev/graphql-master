import { createNewBooking } from "../../controllers/booking";
import { BookingInput } from "../../types/booking";
import { IUser } from "../../types/user";

export const bookingResolvers = {
  Mutation: {
    createNewBooking: async (
      _: any,
      { bookingInput }: { bookingInput: BookingInput },
      { user }: { user: IUser }
    ) => createNewBooking(bookingInput, user.id),
  },
};
