import { gql } from "@apollo/client";

export const CREATE_BOOKING_MUTATION = gql`
  mutation Mutation($bookingInput: BookingInput!) {
    createNewBooking(bookingInput: $bookingInput) {
      id
    }
  }
`;

export const UPDATE_BOOKING_PAYMENT = gql`
  mutation Mutation(
    $bookingId: String!
    $bookingInput: updateBookingPaymentInput!
  ) {
    updateBookingPayment(bookingId: $bookingId, bookingInput: $bookingInput)
  }
`;
