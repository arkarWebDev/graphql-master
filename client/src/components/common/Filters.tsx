import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { updateSearchParams } from "@/lib/helpers";
import { Count, Locations, Types } from "@/lib/filtersData";
import { Checkbox } from "../ui/checkbox";

function Filters() {
  const [searchKey, setSearchKey] = useState<string>("");
  let [searchParams] = useSearchParams();
  const location = useLocation();

  const [filters, setFilters] = useState({
    location: searchParams.get("location"),
    type: searchParams.get("type"),
    capacity: searchParams.get("capacity"),
    available: searchParams.get("available"),
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchKey.trim().length === 0) {
      return;
    }

    searchParams = updateSearchParams(searchParams, "filter", searchKey);
    const url = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(url);
  };

  const handleClear = () => {
    setSearchKey("");
  };

  const updateURL = (filters: any) => {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams = updateSearchParams(searchParams, key, value as string);
      } else {
        searchParams.delete(key);
      }
    });

    const url = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(url);
  };

  const handleCheckboxClick = (filterType: any, value: any) => {
    setFilters((prev: any) => {
      const updatedFilters = {
        ...prev,
        [filterType]: prev[filterType] === value ? null : value,
      };
      updateURL(updatedFilters);
      return updatedFilters;
    });
  };

  useEffect(() => {
    if (searchKey.trim().length === 0) {
      searchParams.delete("filter");
      const url = `${window.location.pathname}?${searchParams.toString()}`;
      navigate(url);
    }
  }, [searchKey]);

  useEffect(() => {
    if (location.pathname === "/" && !location.search) {
      setFilters({
        capacity: null,
        type: null,
        available: null,
        location: null,
      });
    }
  }, [location]);

  return (
    <Card className="col-span-1 h-fit">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Filter & find your place.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="relative" onSubmit={handleSubmit}>
          <Input
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="pl-8"
            placeholder="Type and enter to find"
          />
          <Search
            className={`absolute top-2 left-2 h-5 w-5 cursor-pointer ${
              searchKey.length === 0 ? "block" : "hidden"
            }`}
          />
          <X
            className={`absolute top-2 left-2 h-5 w-5 cursor-pointer ${
              searchKey.length > 0 ? "block" : "hidden"
            }`}
            onClick={handleClear}
          />
        </form>
        <h2 className="font-semibold mt-4 mb-2">Location</h2>
        <div className="space-y-2">
          {Locations.map((loc, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={loc === filters.location}
                onCheckedChange={() => handleCheckboxClick("location", loc)}
              />
              <span className="text-sm font-medium text-gray-500">{loc}</span>
            </div>
          ))}
        </div>
        <h2 className="font-semibold mt-4 mb-2">Type</h2>
        <div className="space-y-2">
          {Types.map((typ, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={typ === filters.type}
                onCheckedChange={() => handleCheckboxClick("type", typ)}
              />
              <span className="text-sm font-medium text-gray-500">{typ}</span>
            </div>
          ))}
        </div>
        <h2 className="font-semibold mt-4 mb-2">Available</h2>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.available === "true"}
            onCheckedChange={() => handleCheckboxClick("available", "true")}
          />
          <span className="text-sm font-medium text-gray-500">
            Only show available rooms
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default Filters;
