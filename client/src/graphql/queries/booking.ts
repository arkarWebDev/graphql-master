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

export const GET_BOOKING_BY_USER = gql`
  query ExampleQuery {
    getBookingByUser {
      meta {
        unpaidBookings
        totalBookings
        needToPay
      }
      bookings {
        room {
          title
          id
        }
        paymentInfo {
          id
          method
          status
        }
        startDate
        endDate
        amount {
          total
        }
        id
      }
    }
  }
`;
