import { Button } from "@/components/ui/button";
import { DELETE_REVIEW_BY_ID_MUTATION } from "@/graphql/mutations/review";

import { GET_ALL_REVIEWS } from "@/graphql/queries/review";
import { IReview } from "@/types/review";
import { useMutation } from "@apollo/client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import StarRatings from "react-star-ratings";
import { toast } from "sonner";

export const columns: ColumnDef<IReview>[] = [
  {
    accessorKey: "roomTitle",
    header: "Name",
    cell: ({ row }) => (
      <Link to={`/rooms/${row.original.id}`} className="font-medium">
        {row.getValue("roomTitle")}
      </Link>
    ),
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <p className="text-sm font-medium text-gray-500">
        {row.original.comment}
      </p>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <StarRatings
        rating={row.original.rating}
        starRatedColor="orange"
        numberOfStars={5}
        name="rating"
        starDimension="18px"
        starSpacing="1px"
      />
    ),
  },
  {
    id: "actions",
    header: "Manage",
    cell: ({ row }) => {
      const [deleteReview, { loading }] = useMutation(
        DELETE_REVIEW_BY_ID_MUTATION,
        {
          onCompleted: () => {
            toast.success("Review deleted.");
          },
          refetchQueries: [GET_ALL_REVIEWS],
        }
      );

      const handleDeleteReview = async (id: string) => {
        console.log(id);

        await deleteReview({
          variables: {
            reviewId: id,
          },
        });
      };

      return (
        <Button
          size={"sm"}
          variant={"destructive"}
          onClick={() => handleDeleteReview(row.original.id)}
          disabled={loading}
        >
          Delete
        </Button>
      );
    },
  },
];
