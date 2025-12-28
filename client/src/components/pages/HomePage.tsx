import { GET_ALL_ROOMS } from "@/graphql/queries/room";
import { useQuery } from "@apollo/client";
import { Room } from "../../types/Room";
import RoomCard from "@/components/home/RoomCard";
import Filters from "../common/Filters";
import { useSearchParams } from "react-router";
import Pagination from "../common/Pagination";
import { Telescope } from "lucide-react";

const HomePage = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("filter");
  const location = searchParams.get("location");
  const type = searchParams.get("type");
  const capacity = searchParams.get("capacity");
  const isAvailable = searchParams.get("available");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const filters = {
    ...(capacity && { capacity }),
    ...(type && { type }),
    ...(location && { location }),
    ...(isAvailable !== null && { isAvailable: isAvailable === "true" }),
  };

  const variables = {
    query,
    filters,
    page,
  };

  const { data, loading } = useQuery(GET_ALL_ROOMS, { variables });
  console.log(data);

  return (
    <main className="layout grid grid-cols-4 gap-6">
      <Filters />
      <div className="col-span-3">
        <h1 className="text-2xl font-bold">Top trending hotel in Myanmar</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Discover the most trending hotels for unforgettable experience.{" "}
        </p>
        <div className="mt-10">
          {!loading && data?.getAllRooms?.rooms.length === undefined && (
            <div className="w-full h-[50vh] flex items-center justify-center">
              <div>
                <Telescope className="w-40 h-40" />
                <h2 className="text-xl font-extrabold">404 : Not Found.</h2>
              </div>
            </div>
          )}
          {loading && <p>Loading ...</p>}
          {!loading && data?.getAllRooms.rooms && (
            <section className="grid grid-cols-3 gap-4">
              {data?.getAllRooms.rooms.map((room: Room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </section>
          )}
        </div>
        {!loading &&
          data?.getAllRooms?.rooms.length !== undefined &&
          data?.getAllRooms?.pagination?.totalRoomCount >
            data?.getAllRooms?.pagination?.perPage && (
            <Pagination
              totalRoomCount={data?.getAllRooms?.pagination?.totalRoomCount}
              perPage={data?.getAllRooms?.pagination?.perPage}
            />
          )}
      </div>
    </main>
  );
};

export default HomePage;
