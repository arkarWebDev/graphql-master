import { pubsub } from "../apollo/pubsub";
import errorHandler from "../middlewares/errorHandler";
import { Booking } from "../models/booking";
import { BookingInput } from "../types/booking";
import { IUser } from "../types/user";
import { NotFoundError } from "../util/not-found";

export const createNewBooking = errorHandler(
  async (bookingInput: BookingInput, userId: string) => {
    const newBooking = await Booking.create({
      ...bookingInput,
      user: userId,
    });

    pubsub.publish("NEW_BOOKING", {
      newBookingNoti: "New booking placed.",
    });
    return newBooking;
  }
);

export const getBookingById = errorHandler(
  async (bookingId: string, user: IUser) => {
    const booking = await Booking.findById(bookingId).populate("room");

    if (!booking) {
      throw new NotFoundError("Booking not found.");
    }

    if (!user.role?.includes("admin") && booking.user.toString() !== user.id) {
      throw new Error("You don't have permission to do this");
    }

    return booking;
  }
);

export const updateBookingPayment = errorHandler(
  async (
    bookingId: string,
    bookingInput: Partial<BookingInput>,
    user: IUser
  ) => {
    const booking = await Booking.findById(bookingId).populate("room");

    if (!booking) {
      throw new NotFoundError("Booking not found.");
    }

    if (!user.role?.includes("admin") && booking.user.toString() !== user.id) {
      throw new Error("You don't have permission to do this");
    }

    await booking.set(bookingInput).save();

    return true;
  }
);

export const getBookedDatesById = errorHandler(async (roomId: string) => {
  const bookings = await Booking.find({ room: roomId });

  const bookedDates = bookings.flatMap((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const dates = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }

    return dates;
  });

  return bookedDates;
});

export const getBookingByUser = errorHandler(async (userId: string) => {
  const bookings = await Booking.find({ user: userId })
    .populate("room")
    .sort({ createdAt: -1 });

  const totalBookings = bookings.length;

  const unpaidBookings = bookings.filter(
    (booking) => booking.paymentInfo?.status !== "paid"
  );

  const needToPay = unpaidBookings.reduce((sum, booking) => {
    return sum + booking.amount?.total || 0;
  }, 0);

  return {
    bookings,
    meta: {
      totalBookings,
      unpaidBookings: unpaidBookings.length,
      needToPay,
    },
  };
});
1;

export const getAllBookings = errorHandler(async () => {
  const bookings = Booking.find().populate("user room").sort({ createdAt: -1 });

  return bookings;
});

const getMetaData = errorHandler(async (startDate: Date, endDate: Date) => {
  const saleDataInfo = await Booking.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $facet: {
        // [
        // {_id:{date : "2025-10-01"},totalSales : 1000, numOfBookings : 100},
        // {_id:{date : "2025-10-01"},totalSales : 1000, numOfBookings : 100}
        // ]
        salesData: [
          {
            $group: {
              _id: {
                date: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },
              },
              totalSales: { $sum: "$amount.total" },
              numOfBookings: { $sum: 1 },
            },
          },
        ],
        pendingCashData: [
          {
            $match: { "paymentInfo.status": "pending" },
          },
          {
            $group: {
              _id: null,
              totalPendingCash: { $sum: "$amount.total" },
            },
          },
        ],
        paidCashData: [
          {
            $match: {
              "paymentInfo.status": "paid",
              "paymentInfo.method": "cash",
            },
          },
          {
            $group: {
              _id: null,
              totalPaidCash: { $sum: "$amount.total" },
            },
          },
        ],
      },
    },
  ]);

  const {
    salesData: salesDataResult = [],
    pendingCashData: pendingCashDataResult = [],
    paidCashData: paidCashDataResult = [],
  } = saleDataInfo[0];

  // {_id:{date : "2025-10-01"},totalSales : 1000, numOfBookings : 100}
  // {"2025-10-01":{sales : 1000, bookings:100}}

  const salesMap = new Map();
  let totalSales = 0;
  let totalBookings = 0;

  salesDataResult.forEach((data: any) => {
    const date = data?._id?.date; // "2025-10-01"
    const sales = data?.totalSales || 0; // 1000 || 0
    const bookings = data?.numOfBookings || 0; // 100 || 0

    salesMap.set(date, { sales, bookings });
    totalSales += sales;
    totalBookings += bookings;
  });

  // {"2025-10-01":{sales : 1000, bookings:100}}
  let currentDate = new Date(startDate);
  const finalSalesData = [];

  while (currentDate <= endDate) {
    // [
    // 2025-10-01
    // {
    //    2025-10-01,
    //    sales : 1000 || 0,
    //    bookings : 100 || 0
    // }
    // 2025-10-02

    // {
    //    2025-10-02,
    //    sales :  0,
    //    bookings : 0
    // }
    // ]
    const date = currentDate.toISOString().split("T")[0];
    finalSalesData.push({
      date,
      sales: salesMap.get(date)?.sales || 0,
      bookings: salesMap.get(date)?.bookings || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalPendingAmount = pendingCashDataResult[0]?.totalPendingCash || 0;
  const totalPaidCashAmount = paidCashDataResult[0]?.totalPaidCash || 0;

  return {
    salesData: finalSalesData,
    totalSales,
    totalBookings,
    totalPendingAmount,
    totalPaidCashAmount,
  };
});

export const getDashboardMetaData = errorHandler(
  async (startDate: Date, endDate: Date) => {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const {
      salesData,
      totalSales,
      totalBookings,
      totalPendingAmount,
      totalPaidCashAmount,
    } = await getMetaData(startDate, endDate);

    return {
      sales: salesData,
      totalSales,
      totalBookings,
      totalPendingAmount,
      totalPaidCashAmount,
    };
  }
);
