import { GET_ALL_ROOMS } from "@/graphql/queries/room";
import { useQuery } from "@apollo/client";
import { Room } from "../../types/Room";
import RoomCard from "@/components/home/RoomCard";
import Filters from "../common/Filters";
import { useSearchParams } from "react-router";
import Pagination from "../common/Pagination";

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

  console.log(filters);

  const variables = {
    query,
    filters,
    page,
  };

  const { data, loading, error } = useQuery(GET_ALL_ROOMS, { variables });

  return (
    <main className="layout grid grid-cols-4 gap-6">
      <Filters />
      <div className="col-span-3">
        <h1 className="text-2xl font-bold">Top trending hotel in Myanmar</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Discover the most trending hotels for unforgettable experience.{" "}
        </p>
        <div className="mt-10">
          {loading && <p>Loading ...</p>}
          {!loading && data?.getAllRooms.rooms && (
            <section className="grid grid-cols-3 gap-4">
              {data?.getAllRooms.rooms.map((room: Room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </section>
          )}
        </div>
        <Pagination
          totalRoomCount={data?.getAllRooms?.pagination?.totalRoomCount}
          perPage={data?.getAllRooms?.pagination?.perPage}
        />
      </div>
    </main>
  );
};

export default HomePage;
