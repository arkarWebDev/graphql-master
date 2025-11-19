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
    reviews: [String],
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model("Room", roomSchema);
