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
        reviews
      }
    }
  }
`;

export const GET_SINGLE_ROOM = gql`
  query Query($roomId: String!, $getBookedDatesByIdRoomId2: String!) {
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
      reviews
      roomNumber
      title
      type
    }
    getBookedDatesById(roomId: $getBookedDatesByIdRoomId2)
  }
`;
