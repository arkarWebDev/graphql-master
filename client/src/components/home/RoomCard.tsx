import { MapPin, Star } from "lucide-react";
import { Room } from "../../types/Room";
import { Link } from "react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
type RoomCardProps = {
  room: Room;
};

const RoomCard = ({ room }: RoomCardProps) => {
  const [loading, setLoading] = useState(true);
  return (
    <Link to={`/rooms/${room.id}`}>
      {loading && (
        <div className="w-full aspect-video bg-gray-300 flex items-center justify-center rounded-lg animate-pulse">
          <p>loading</p>
        </div>
      )}
      <img
        src={room.images[0].url}
        alt="Room Image"
        className={cn("rounded-lg aspect-video", loading ? " hidden" : "block")}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />

      <div className="">
        <h2 className="text-lg font-bold mt-1">{room.title}</h2>
        <p className="text-sm">Rating Count</p>
      </div>
      <p className="font-bold text-xl">
        $ {room.pricePerNight}{" "}
        <span className="text-sm font-medium text-muted-foreground">
          /night
        </span>
      </p>
    </Link>
  );
};

export default RoomCard;
