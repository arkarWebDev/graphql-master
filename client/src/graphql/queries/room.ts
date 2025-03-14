import { gql } from "@apollo/client";

export const GET_ALL_ROOMS = gql`
  query GetAllRooms {
    getAllRooms {
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
`;

export const GET_SINGLE_ROOM = gql`
  query Query($roomId: String!) {
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
  }
`;
