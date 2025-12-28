import {
  canReview,
  createAndUpdateReview,
  deleteReviewById,
  getAllReviews,
} from "../../controllers/review";
import { ReviewInput } from "../../types/review";
import { IUser } from "../../types/user";

export const reviewResolvers = {
  Query: {
    canReview: async (
      _: any,
      { reviewRoomId }: { reviewRoomId: string },
      { user }: { user: IUser }
    ) => canReview(reviewRoomId, user?.id),
    getAllReviews: async () => getAllReviews(),
  },
  Mutation: {
    createAndUpdateReview: async (
      _: any,
      { reviewInput }: { reviewInput: ReviewInput },
      { user }: { user: IUser }
    ) => createAndUpdateReview(reviewInput, user?.id),
    deleteReviewById: async (_: any, { reviewId }: { reviewId: string }) =>
      deleteReviewById(reviewId),
  },
};
