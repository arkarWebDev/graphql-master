import gql from "graphql-tag";

export const bookingTypeDefs = gql`
  input CustomerInput {
    name: String!
    email: String!
  }

  input AmountInput {
    rent: Float!
    discount: Float!
    tax: Float!
    total: Float!
  }

  input BookingInput {
    room: ID!
    startDate: String!
    endDate: String!
    customer: CustomerInput!
    amount: AmountInput!
    daysOfRent: Int!
    rentPerDay: Float!
    additionalNote: String
  }

  type Customer {
    name: String!
    email: String!
  }

  type Amount {
    rent: Float!
    discount: Float!
    tax: Float!
    total: Float!
  }

  type PaymentInfo {
    id: String
    status: String
    method: String
  }

  type Booking {
    id: ID
    user: User
    room: Room
    startDate: String!
    endDate: String!
    customer: Customer!
    amount: Amount!
    daysOfRent: Int!
    rentPerDay: Float!
    paymentInfo: PaymentInfo
    additionalNote: String
  }

  type BookingMeta {
    totalBookings: Int!
    unpaidBookings: Int!
    needToPay: Float!
  }

  type BookingListResponse {
    bookings: [Booking!]!
    meta: BookingMeta!
  }

  type Sale {
    date: String
    sales: Float
    bookings: Int
  }

  type DashboardMetaData {
    sales: [Sale]
    totalSales: Float
    totalBookings: Int
    totalPendingAmount: Float
    totalPaidCashAmount: Float
  }

  input PaymentInfoInput {
    id: String
    status: String
    method: String
  }

  input updateBookingPaymentInput {
    paymentInfo: PaymentInfoInput
  }

  type Query {
    getBookingById(bookingId: String!): Booking!
    getBookedDatesById(roomId: String!): [String]!
    getBookingByUser: BookingListResponse!
    getDashboardMetaData(
      startDate: String!
      endDate: String!
    ): DashboardMetaData!
    getAllBookings: [Booking]
  }

  type Mutation {
    createNewBooking(bookingInput: BookingInput!): Booking!
    updateBookingPayment(
      bookingId: String!
      bookingInput: updateBookingPaymentInput!
    ): Boolean
  }

  type Subscription {
    newBookingNoti: String
  }
`;
