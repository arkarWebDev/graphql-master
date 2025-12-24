import { gql } from "@apollo/client";

export const GET_ALL_ROOMS = gql`
  query GetAllRooms($query: String, $page: Int, $filters: RoomFilters) {
    getAllRooms(query: $query, page: $page, filters: $filters) {
      pagination {
        perPage
        totalRoomCount
      }
      rooms {
        id
        title
        images {
          url
        }
        location
        pricePerNight
        reviews {
          id
          rating
        }
      }
    }
  }
`;

export const GET_SINGLE_ROOM = gql`
  query Query(
    $roomId: String!
    $getBookedDatesByIdRoomId2: String!
    $reviewRoomId: ID!
  ) {
    getRoomById(roomId: $roomId) {
      capacity
      description
      id
      images {
        public_id
        url
      }
      isAvailable
      location
      pricePerNight
      reviews {
        id
        user {
          id
          name
        }
        rating
        comment
        createdAt
        updatedAt
      }
      roomNumber
      title
      type
    }
    getBookedDatesById(roomId: $getBookedDatesByIdRoomId2)
    canReview(reviewRoomId: $reviewRoomId)
  }
`;
