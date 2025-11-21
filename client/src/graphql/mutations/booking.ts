import { gql } from "@apollo/client";

export const CREATE_BOOKING_MUTATION = gql`
  mutation Mutation($bookingInput: BookingInput!) {
    createNewBooking(bookingInput: $bookingInput) {
      id
    }
  }
`;
