import { gql } from "@apollo/client";

export const GET_BOOKING_BY_ID = gql`
  query Query($bookingId: String!) {
    getBookingById(bookingId: $bookingId) {
      room {
        title
        id
      }
      id
      amount {
        total
        tax
        rent
        discount
      }
      daysOfRent
      rentPerDay
    }
  }
`;
