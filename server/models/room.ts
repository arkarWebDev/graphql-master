import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter room title."],
    },
    description: {
      type: String,
      required: [true, "Please enter description."],
    },
    roomNumber: {
      type: String,
      required: [true, "Please enter roomNumber."],
    },
    type: {
      type: String,
      required: [true, "Please enter roomType."],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Please enter pricePerNight."],
    },
    location: {
      type: String,
      required: [true, "Please enter location"],
    },
    capacity: {
      type: Number,
      required: [true, "Please enter roomCapacity."],
    },
    isAvailable: {
      type: Boolean,
      required: [true, "Please enter roomStatus."],
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

roomSchema.virtual("ratings").get(function () {
  let numberOfReviews = this.reviews.length;

  if (numberOfReviews === 0) {
    return {
      value: 5,
      count: 0,
    };
  }

  const toatalRatings = this.reviews.reduce(
    (sum: number, review: any) => sum + review.rating,
    0
  );

  const value = numberOfReviews > 0 ? toatalRatings / numberOfReviews : 0;
  return {
    value,
    count: numberOfReviews,
  };
});

roomSchema.set("toJSON", { virtuals: true });
roomSchema.set("toObject", { virtuals: true });

export const Room = mongoose.model("Room", roomSchema);
