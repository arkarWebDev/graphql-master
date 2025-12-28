import gql from "graphql-tag";

export const roomTypeDefs = gql`
  type RoomImage {
    url: String!
    public_id: String!
  }

  type Review {
    id: ID
    user: User
    room: Room
    rating: Int
    comment: String
    createdAt: String
    updatedAt: String
  }

  type Room {
    id: ID!
    title: String!
    description: String!
    roomNumber: String!
    type: String!
    pricePerNight: Float!
    capacity: Int!
    isAvailable: Boolean!
    images: [RoomImage]
    reviews: [Review]
    location: String!
    createdAt: String
    updatedAt: String
  }

  input roomInput {
    title: String!
    description: String!
    roomNumber: String!
    type: String!
    pricePerNight: Float!
    capacity: Int!
    isAvailable: Boolean!
    images: [String]
    reviews: [String]
    location: String!
  }

  input PriceFilter {
    gt: Int
    gte: Int
    lt: Int
    lte: Int
  }

  input RoomFilters {
    type: String
    pricePerNight: PriceFilter
    capacity: Int
    isAvailable: Boolean
    location: String
  }

  type PaginateType {
    totalRoomCount: Int
    perPage: Int
  }

  type RoomsWithPaginate {
    rooms: [Room]
    pagination: PaginateType
  }

  type Query {
    getAllRooms(
      query: String
      filters: RoomFilters
      page: Int
    ): RoomsWithPaginate
    getRoomById(roomId: String!): Room
    getAllRoomsWithoutFilters: [Room]
  }

  type Mutation {
    createNewRoom(roomInput: roomInput!): Room
    updateRoom(roomId: ID!, roomInput: roomInput!): String
    deleteRoom(roomId: ID!): String
    deleteRoomImage(roomId: ID!, imageId: String!): Boolean
  }

  type Rating {
    value: Float!
    count: Int!
  }

  type Room {
    ratings: Rating!
  }
`;
